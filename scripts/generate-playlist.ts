/**
 * Build-time script: scans public/audio/ and generates/updates playlist.json.
 * Run: npx tsx scripts/generate-playlist.ts
 *
 * Playlist entries can be hand-tuned in src/app/data/playlist.json for
 * title / artist / cover / duration fields.  This script only adds new
 * audio files that aren't already in the json – it never overwrites
 * existing entries so your manual edits are safe.
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

// ─── read existing playlist ────────────────────────────────────────
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

// ─── attempt to get duration via ffprobe ────────────────────────────
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

const files = fs
  .readdirSync(AUDIO_DIR)
  .filter((f) => audioExts.includes(path.extname(f).toLowerCase()));

const playlist = loadPlaylist();
const existingFiles = new Set(playlist.map((s) => s.file));
let added = 0;

for (const file of files) {
  if (existingFiles.has(file)) continue;

  const nameWithoutExt = path.basename(file, path.extname(file));
  const duration =
    getDurationSec(path.join(AUDIO_DIR, file)) || 194; // fallback

  const song: Song = {
    id: String(playlist.length + added + 1),
    title: nameWithoutExt,
    artist: "Unknown",
    file: `audio/${file}`,
    duration,
    cover: "",
  };

  playlist.push(song);
  existingFiles.add(file);
  added++;
  console.log(` + added: ${file}  (${duration}s)`);
}

if (added === 0) {
  console.log(" Playlist is up to date. No new files.");
} else {
  savePlaylist(playlist);
  console.log(` Done. ${added} new song(s), ${playlist.length} total.`);
}
