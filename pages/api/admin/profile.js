import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

function sanitize(value) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const name = sanitize(req.body?.name);
  const email = sanitize(req.body?.email);
  const number = sanitize(req.body?.number);
  const role = sanitize(req.body?.role);

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  const sql = getSqlClient();
  const rows = await sql`
    UPDATE admin
    SET
      name = ${name},
      email = ${email || null},
      number = ${number || null},
      role = ${role || null}
    WHERE CAST(id AS text) = ${String(session.user.id)}
    RETURNING id, name, email, number, role
  `;

  if (!rows[0]) {
    return res.status(404).json({ error: "Admin record not found." });
  }

  return res.status(200).json({ user: rows[0] });
}
