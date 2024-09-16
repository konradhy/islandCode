import { NextResponse } from "next/server";
import { createPool } from "mysql2/promise";

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 25060,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  console.log("id", id);

  try {
    const [rows] = await pool.query("SELECT * FROM cases WHERE id = ?", [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
