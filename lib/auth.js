import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  return inputPassword === storedPassword;
}

export function isGoogleAuthEnabled() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function getAllowedGoogleEmails() {
  return (process.env.ADMIN_ALLOWED_GOOGLE_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function findAdminById(userId) {
  const sql = getSqlClient();
  const rows = await sql`
    SELECT id, name, email, role, number, password
    FROM admin
    WHERE CAST(id AS text) = ${userId}
    LIMIT 1
  `;

  return rows[0] || null;
}

const providers = [
  CredentialsProvider({
    name: "Admin Login",
    credentials: {
      userId: { label: "User ID", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const userId = credentials?.userId?.trim();
      const password = credentials?.password;

      if (!userId || !password) {
        throw new Error("Enter your user ID and password.");
      }

      const admin = await findAdminById(userId);

      if (!admin) {
        throw new Error("Invalid user ID or password.");
      }

      const passwordMatches = await verifyPassword(password, admin.password);

      if (!passwordMatches) {
        throw new Error("Invalid user ID or password.");
      }

      return {
        id: String(admin.id),
        name: admin.name ? String(admin.name) : String(admin.id),
        role: admin.role ? String(admin.role) : "principal",
        phone: admin.number ? String(admin.number) : "",
        email: admin.email ? String(admin.email) : "",
      };
    },
  }),
];

if (isGoogleAuthEnabled()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/Admin_login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const allowedEmails = getAllowedGoogleEmails();
      const email = user?.email?.toLowerCase();

      if (!email || allowedEmails.length === 0) {
        return false;
      }

      return allowedEmails.includes(email);
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || "admin";
        token.name = user.name || "";
        token.phone = user.phone || "";
        token.email = user.email || "";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.name = token.name || session.user.name || "";
        session.user.phone = token.phone || "";
        session.user.email = token.email || session.user.email || "";
      }

      return session;
    },
  },
};

export function nextAuthHandler(req, res) {
  return NextAuth(req, res, authOptions);
}
