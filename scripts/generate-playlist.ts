/**
 * Build-time script: scans public/music/ folders and regenerates playlist.json.
 * Each song is a folder under public/music/ containing:
 *   - metadata.json  (title, artist, album, year, genre, cover, audio, lyrics)
 *   - lyrics.lrc     (LRC lyrics file)
 *   - cover.{jpg,png} (album art)
 *   - audio.{mp3,...} (audio file, matched by metadata.audio or audio.* convention)
 *
 * Run: npx tsx scripts/generate-playlist.ts
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MUSIC_DIR = path.resolve(import.meta.dirname, "../public/music");
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
  audio?: string;
  lyrics?: string;
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

// Find audio file in the song's music folder.
// Priority: 1) metadata.audio field  2) audio.* convention  3) any audio file
function findAudioFile(folderName: string, audioName?: string): string | null {
  const folderPath = path.join(MUSIC_DIR, folderName);
  if (!fs.existsSync(folderPath)) return null;

  const files = fs.readdirSync(folderPath);
  const isAudio = (f: string) =>
    audioExts.includes(path.extname(f).toLowerCase());

  // 1) Use the filename configured in metadata.json ("audio" field)
  if (audioName) {
    const configuredPath = path.join(folderPath, audioName);
    if (fs.existsSync(configuredPath) && isAudio(audioName)) {
      return `music/${folderName}/${audioName}`;
    }
  }

  // 2) Look for audio.* convention (audio.mp3, audio.ogg, etc.)
  const audioDot = files.find(
    (f) => f.startsWith("audio.") && isAudio(f),
  );
  if (audioDot) {
    return `music/${folderName}/${audioDot}`;
  }

  // 3) Fallback: any audio file
  const anyAudio = files.find(isAudio);
  if (anyAudio) {
    return `music/${folderName}/${anyAudio}`;
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

  // Find lyrics: 1) metadata.lyrics  2) lyrics.lrc convention
  let lyricsPath = "";
  const lyricsName = meta.lyrics || "lyrics.lrc";
  const lyricsFile = path.join(folderPath, lyricsName);
  if (fs.existsSync(lyricsFile)) {
    lyricsPath = `music/${folder}/${lyricsName}`;
  }

  // Find audio file
  const audioFile = findAudioFile(folder, meta.audio);
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
