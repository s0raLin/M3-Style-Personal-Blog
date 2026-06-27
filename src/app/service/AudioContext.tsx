import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import playlist from "../data/playlist.json";

export interface SongMeta {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  genre?: string;
  cover: string;
}

export interface LyricLine {
  time: number; // seconds
  text: string;
}

export interface Song {
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

interface AudioContextType {
  songs: Song[];
  currentIdx: number;
  song: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPct: number;
  togglePlay: () => void;
  prevSong: () => void;
  nextSong: () => void;
  seek: (t: number) => void;
  fmtTime: (sec: number) => string;
  setCurrentIdx: (idx: number) => void;
  lyrics: LyricLine[];
  currentLyricIdx: number;
  isLyricsLoading: boolean;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

const STORAGE_KEY = "m3blog_audio_idx";

function loadSavedIdx(maxLen: number): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && n >= 0 && n < maxLen) return n;
    }
  } catch {}
  return 0;
}

function saveIdx(idx: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(idx));
  } catch {}
}

// ── LRC Parser ─────────────────────────────────────────────────────
function parseLRC(lrcText: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const tagRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  for (const raw of lrcText.split("\n")) {
    const line = raw.trim();
    const match = line.match(tagRegex);
    if (!match) continue;
    const min = parseInt(match[1], 10);
    const sec = parseInt(match[2], 10);
    let ms = parseInt(match[3], 10);
    if (match[3].length === 3) ms = ms / 10; // hundredths -> milliseconds, divide by 10 to get centiseconds equivalent
    const time = min * 60 + sec + ms / 100;
    const text = match[4].trim();
    if (text) {
      lines.push({ time, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const songs = (playlist && playlist.length > 0 ? playlist : []) as Song[];

  const [currentIdx, setCurrentIdx] = useState(() => loadSavedIdx(songs.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Lyrics state
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const lastSetTimeRef = useRef(0); // throttle setCurrentTime
  const playWasUserInitiated = useRef(false);

  const song = useMemo(() => songs[currentIdx] ?? null, [songs, currentIdx]);

  // ── Persist index ──
  useEffect(() => {
    saveIdx(currentIdx);
  }, [currentIdx]);

  // ── Create audio element once ──
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // ── Load source when song changes ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    const src = `${import.meta.env.BASE_URL}${song.file}`;
    audio.src = src;
    audio.load();
    lastTimeRef.current = 0;
    lastSetTimeRef.current = 0;
    setCurrentTime(0);
    setDuration(song.duration || 0);
    setIsPlaying(false);

    // Load lyrics
    if (song.lyricsPath) {
      setIsLyricsLoading(true);
      fetch(`${import.meta.env.BASE_URL}${song.lyricsPath}`)
        .then((r) => r.text())
        .then((text) => {
          const parsed = parseLRC(text);
          setLyrics(parsed);
        })
        .catch(() => {
          setLyrics([]);
        })
        .finally(() => {
          setIsLyricsLoading(false);
        });
    } else {
      setLyrics([]);
      setIsLyricsLoading(false);
    }
  }, [song]);

  // ── rAF loop: only runs when playing, throttled to ~4 updates/sec ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only run rAF loop when audio is actively playing
    if (!isPlaying) return;

    let running = true;

    const tick = () => {
      if (!running) return;
      const ct = audio.currentTime;
      // Throttle React state updates to ~250ms intervals (4 Hz)
      if (Math.abs(ct - lastSetTimeRef.current) > 0.25) {
        lastSetTimeRef.current = ct;
        setCurrentTime(ct);
      }
      lastTimeRef.current = ct;
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [isPlaying]);

  // ── Attach event listeners ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentIdx((p) => (p + 1) % songs.length || 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      if (!audio.ended) setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [songs.length]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      // Mark as user-initiated for mobile autoplay policy
      playWasUserInitiated.current = true;
      a.play().catch((err) => {
        // Mobile browsers may block play if no prior user gesture
        console.warn("Audio play failed:", err);
        playWasUserInitiated.current = false;
      });
    } else {
      a.pause();
    }
  }, []);

  const prevSong = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIdx((p) => (p - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const nextSong = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIdx((p) => (p + 1) % songs.length);
  }, [songs.length]);

  const seek = useCallback((t: number) => {
    lastTimeRef.current = t;
    lastSetTimeRef.current = t;
    setCurrentTime(t);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
    }
  }, []);

  const fmtTime = (sec: number): string => {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ── Memoized lyric index ──
  const currentLyricIdx = useMemo(() => {
    if (lyrics.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTime, lyrics]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioCtx.Provider
      value={{
        songs,
        currentIdx,
        song,
        isPlaying,
        currentTime,
        duration,
        progressPct,
        togglePlay,
        prevSong,
        nextSong,
        seek,
        fmtTime,
        setCurrentIdx,
        lyrics,
        currentLyricIdx,
        isLyricsLoading,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
