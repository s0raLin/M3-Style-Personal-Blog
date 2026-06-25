import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import playlist from "../data/playlist.json";

export interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number;
  cover: string;
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

export function AudioProvider({ children }: { children: ReactNode }) {
  const songs = (playlist && playlist.length > 0 ? playlist : []) as Song[];

  const [currentIdx, setCurrentIdx] = useState(() => loadSavedIdx(songs.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const song = songs[currentIdx] ?? null;

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
    setCurrentTime(0);
    setDuration(song.duration || 0);
    setIsPlaying(false);
  }, [song]);

  // ── rAF loop replaces timeupdate event (avoids excessive re-renders) ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let running = true;

    const tick = () => {
      if (!running) return;
      const ct = audio.currentTime;
      if (Math.abs(ct - lastTimeRef.current) > 0.05) {
        lastTimeRef.current = ct;
        setCurrentTime(ct);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [songs.length, isSeeking]);

  // ── Attach event listeners (no timeupdate) ──
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
  }, [songs.length, isSeeking]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
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
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
