import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { CATEGORY_OPTIONS } from "@/components/dashboard/categoryOptions";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "dashboard.json");

function defaultData() {
  return {
    categories: CATEGORY_OPTIONS.map((item) => ({ ...item })),
    events: [],
  };
}

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch (error) {
    await fs.writeFile(dataFile, JSON.stringify(defaultData(), null, 2), "utf8");
  }
}

export async function GET() {
  await ensureFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const data = raw ? JSON.parse(raw) : defaultData();
  return NextResponse.json(data);
}

export async function POST(request) {
  const payload = await request.json();
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(payload, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
