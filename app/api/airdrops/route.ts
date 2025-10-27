import { NextResponse } from "next/server";
import { loadAirdrops, saveAirdrops } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json(loadAirdrops());
}

export async function POST(req: Request) {
  const { name, url, category = 'General', priority = 'Medium', dueDate, progress = 0, description, tags = [] } = await req.json();
  const data = loadAirdrops();
  data.push({
    id: randomUUID(),
    name,
    url,
    checkedIn: false,
    category,
    priority,
    dueDate,
    progress,
    description,
    tags
  });
  saveAirdrops(data);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = loadAirdrops().map(a =>
    a.id === body.id ? { ...a, ...body } : a
  );
  saveAirdrops(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = loadAirdrops().filter(a => a.id !== id);
  saveAirdrops(data);
  return NextResponse.json({ success: true });
}
