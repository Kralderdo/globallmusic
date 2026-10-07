import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const authorization = req.headers.get("authorization");

  if (
    process.env.CRON_SECRET &&
    authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "GlobalMusic keşif sistemi hazır.",
    time: new Date().toISOString()
  });
}
