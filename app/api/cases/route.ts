import { NextResponse } from "next/server";
import { createPool, RowDataPacket } from "mysql2/promise";

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 25060,
});

export async function POST(request: Request) {
  const { searchTerm, filters, page = 1 } = await request.json();
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM cases WHERE 1=1";
  const queryParams: (string | number | string[])[] = [];

  if (searchTerm) {
    query += " AND (caseTitle LIKE ? OR caseNumber LIKE ?)";
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  if (filters.jurisdictions && filters.jurisdictions.length > 0) {
    query += " AND LOWER(jurisdiction) IN (?)";
    queryParams.push(filters.jurisdictions.map((j: string) => j.toLowerCase()));
  }

  if (filters.courts && filters.courts.length > 0) {
    query += " AND LOWER(court) IN (?)";
    queryParams.push(filters.courts.map((c: string) => c.toLowerCase()));
  }

  if (filters.yearRange && filters.yearRange.length === 2) {
    query += " AND year BETWEEN ? AND ?";
    queryParams.push(filters.yearRange[0], filters.yearRange[1]);
  }

  query += " ORDER BY dateOfDelivery DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  try {
    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

    return NextResponse.json({
      cases: rows,
      hasMore: rows.length > limit,
    });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
