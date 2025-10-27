import { NextResponse } from "next/server";
import { loadAirdrops, saveAirdrops } from "@/lib/storage";

export async function POST() {
  const reset = loadAirdrops().map(a => ({ ...a, checkedIn: false }));
  saveAirdrops(reset);
  return NextResponse.json({ success: true });
}
