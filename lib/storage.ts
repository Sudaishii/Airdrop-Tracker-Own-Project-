import fs from "fs";
import path from "path";

export interface Airdrop {
  id: string;
  name: string;
  url: string;
  checkedIn: boolean;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string; // ISO date string
  progress: number; // 0-100
  description?: string;
  tags: string[];
}

const filePath = path.join(process.cwd(), "data", "airdrops.json");

export function loadAirdrops(): Airdrop[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveAirdrops(data: Airdrop[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
