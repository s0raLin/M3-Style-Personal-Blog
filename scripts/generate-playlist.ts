/**
 * Build-time script: scans public/music/ folders and regenerates playlist.json.
 * Each song is a folder under public/music/ containing:
 *   - metadata.json  (title, artist, album, year, genre, cover filename)
 *   - lyrics.lrc     (LRC lyrics file)
 *   - cover.{jpg,png} (album art)
 *   - song file      (the actual audio file, symlinked or placed directly)
 *
 * Run: npx tsx scripts/generate-playlist.ts
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MUSIC_DIR = path.resolve(import.meta.dirname, "../public/music");
const AUDIO_DIR = path.resolve(import.meta.dirname, "../public/audio");
const PLAYLIST_PATH = path.resolve(
  import.meta.dirname,
  "../src/app/data/playlist.json",
);

interface SongMeta {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  genre?: string;
  cover: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number;
  cover: string;
  folder: string;
  lyricsPath: string;
  meta: SongMeta;
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

const audioExts = [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".opus"];

// Find audio file in a folder or fall back to public/audio/
function findAudioFile(folderName: string): string | null {
  const folderPath = path.join(MUSIC_DIR, folderName);

  // First, look for audio files directly in the music folder
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    const audioFile = files.find((f) =>
      audioExts.includes(path.extname(f).toLowerCase()),
    );
    if (audioFile) {
      return `music/${folderName}/${audioFile}`;
    }
  }

  // Fallback: search in public/audio/ for a file whose name contains the folder name
  if (fs.existsSync(AUDIO_DIR)) {
    const audioFiles = fs.readdirSync(AUDIO_DIR);
    const match = audioFiles.find(
      (f) =>
        audioExts.includes(path.extname(f).toLowerCase()) &&
        (f.includes(folderName) ||
          decodeURIComponent(f).includes(decodeURIComponent(folderName)) ||
          folderName.includes(
            path.basename(f, path.extname(f)).split(" - ")[0],
          )),
    );
    if (match) {
      return `audio/${match}`;
    }
  }

  return null;
}

// ─── main ───────────────────────────────────────────────────────────

if (!fs.existsSync(MUSIC_DIR)) {
  console.log(" public/music/ does not exist – nothing to do.");
  process.exit(0);
}

const folders = fs
  .readdirSync(MUSIC_DIR)
  .filter((f) => fs.statSync(path.join(MUSIC_DIR, f)).isDirectory());

if (folders.length === 0) {
  console.log(" No song folders found in public/music/.");
  process.exit(0);
}

const newPlaylist: Song[] = [];
let idx = 0;

for (const folder of folders) {
  const folderPath = path.join(MUSIC_DIR, folder);

  // Load metadata.json
  let meta: SongMeta = {
    title: folder,
    artist: "Unknown",
    cover: "cover.jpg",
  };
  const metaPath = path.join(folderPath, "metadata.json");
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch {
      console.warn(` Failed to parse metadata.json for "${folder}"`);
    }
  }

  // Find cover image
  let cover = "";
  const coverCandidates = [
    meta.cover,
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
    "cover.webp",
  ];
  for (const c of coverCandidates) {
    if (!c) continue;
    const coverPath = path.join(folderPath, c);
    if (fs.existsSync(coverPath)) {
      cover = `music/${folder}/${c}`;
      break;
    }
  }

  // Find lyrics
  let lyricsPath = "";
  const lyricsFile = path.join(folderPath, "lyrics.lrc");
  if (fs.existsSync(lyricsFile)) {
    lyricsPath = `music/${folder}/lyrics.lrc`;
  }

  // Find audio file
  const audioFile = findAudioFile(folder);
  if (!audioFile) {
    console.warn(` No audio file found for "${folder}" – skipping.`);
    continue;
  }

  const fullAudioPath = path.resolve(
    import.meta.dirname,
    "../public",
    audioFile,
  );
  const duration = getDurationSec(fullAudioPath) || 194;

  newPlaylist.push({
    id: String(idx + 1),
    title: meta.title,
    artist: meta.artist,
    file: audioFile,
    duration,
    cover,
    folder: `music/${folder}`,
    lyricsPath,
    meta,
  });
  idx++;
}

savePlaylist(newPlaylist);
console.log(` Regenerated playlist: ${newPlaylist.length} song(s).`);
newPlaylist.forEach((s) =>
  console.log(`   ${s.artist} - ${s.title}  (${s.duration}s)`),
);
