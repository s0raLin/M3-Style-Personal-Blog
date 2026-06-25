/**
 * Build-time script: scans public/audio/ and regenerates playlist.json.
 * Run: npx tsx scripts/generate-playlist.ts
 *
 * This script always regenerates the playlist from scratch, preserving any
 * manual edits made to existing entries (title, artist, cover) when possible.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const AUDIO_DIR = path.resolve(import.meta.dirname, "../public/audio");
const PLAYLIST_PATH = path.resolve(
  import.meta.dirname,
  "../src/app/data/playlist.json",
);

interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number; // seconds
  cover: string;
}

function loadPlaylist(): Song[] {
  if (!fs.existsSync(PLAYLIST_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(PLAYLIST_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function savePlaylist(list: Song[]) {
  fs.writeFileSync(PLAYLIST_PATH, JSON.stringify(list, null, 2) + "\n");
}

function getDurationSec(filePath: string): number {
  try {
    const out = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}" 2>/dev/null`,
    )
      .toString()
      .trim();
    const n = parseFloat(out);
    return Number.isFinite(n) ? Math.round(n) : 0;
  } catch {
    return 0;
  }
}

// ─── main ───────────────────────────────────────────────────────────
const audioExts = [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".opus"];

if (!fs.existsSync(AUDIO_DIR)) {
  console.log(" public/audio/ does not exist – nothing to do.");
  process.exit(0);
}

const oldPlaylist = loadPlaylist();
// Build lookup: bare filename -> old entry
const oldByFile = new Map<string, Song>();
for (const s of oldPlaylist) {
  const bare = s.file.replace(/^audio\//, "");
  oldByFile.set(bare, s);
}

const files = fs
  .readdirSync(AUDIO_DIR)
  .filter((f) => audioExts.includes(path.extname(f).toLowerCase()));

const newPlaylist: Song[] = [];
let idx = 0;

for (const file of files) {
  const old = oldByFile.get(file);
  const nameWithoutExt = path.basename(file, path.extname(file));
  const duration =
    getDurationSec(path.join(AUDIO_DIR, file)) || old?.duration || 194;

  newPlaylist.push({
    id: old?.id ?? String(idx + 1),
    title: old?.title ?? nameWithoutExt,
    artist: old?.artist ?? "Unknown",
    file: `audio/${file}`,
    duration,
    cover: old?.cover ?? "",
  });
  idx++;
}

// Remove old entries whose files no longer exist (already handled by rebuilding)

savePlaylist(newPlaylist);
console.log(` Regenerated playlist: ${newPlaylist.length} song(s).`);
newPlaylist.forEach((s) => console.log(`   ${s.artist} - ${s.title}  (${s.duration}s)`));
