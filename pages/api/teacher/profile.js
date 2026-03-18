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

function mapTeacherRow(row) {
  if (!row) return null;

  return {
    id: String(row.id || ""),
    name: row.name ? String(row.name) : "",
    subject: row.subject ? String(row.subject) : "",
    number: row.number ? String(row.number) : "",
    doj: row.doj ? String(row.doj) : "",
    gender: row.gender ? String(row.gender) : "",
  };
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || session?.user?.userType !== "teacher") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const teacherId = String(session.user.id);
  const sql = getSqlClient();

  if (req.method === "GET") {
    const rows = await sql`
      SELECT id, name, subject, number, doj, gender
      FROM teachers
      WHERE CAST(id AS text) = ${teacherId}
      LIMIT 1
    `;

    if (!rows[0]) {
      return res.status(404).json({ error: "Teacher profile not found." });
    }

    return res.status(200).json({ profile: mapTeacherRow(rows[0]) });
  }

  if (req.method === "PUT") {
    const name = sanitize(req.body?.name);
    const subject = sanitize(req.body?.subject);
    const number = sanitize(req.body?.number);

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    const rows = await sql`
      UPDATE teachers
      SET
        name = ${name},
        subject = ${subject || null},
        number = ${number || null}
      WHERE CAST(id AS text) = ${teacherId}
      RETURNING id, name, subject, number, doj, gender
    `;

    if (!rows[0]) {
      return res.status(404).json({ error: "Teacher profile not found." });
    }

    return res.status(200).json({ profile: mapTeacherRow(rows[0]) });
  }

  return res.status(405).json({ error: "Method not allowed." });
}
