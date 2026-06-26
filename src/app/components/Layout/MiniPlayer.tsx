import { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Pause,
  PlayArrow,
  SkipPrevious,
  SkipNext,
  MusicNote,
  QueueMusic,
  Close,
  Check,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { useAudio } from "../../service/AudioContext";

interface MiniPlayerProps {
  onOpenDetail: () => void;
}

export default function MiniPlayer({ onOpenDetail }: MiniPlayerProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    songs,
    currentIdx,
    song,
    isPlaying,
    progressPct,
    togglePlay,
    prevSong,
    nextSong,
    setCurrentIdx,
  } = useAudio();

  const [playlistOpen, setPlaylistOpen] = useState(false);

  // ── Swipe to change song ──
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) prevSong();
      else nextSong();
    }
  };

  if (!song || songs.length === 0) return null;

  const accentColor = isDark
    ? theme.palette.primary.light || "#a8c7fa"
    : theme.palette.primary.dark || "#005faf";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: { xs: 0.8, sm: 1.5 },
        }}
      >
        {/* Left: cover icon + track info (click to open detail, swipe to change song) */}
        <Box
          onClick={onOpenDetail}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
            flex: 1,
            touchAction: "pan-y",
            cursor: "pointer",
            "&:hover": {
              "& .mini-cover": {
                transform: "scale(1.05)",
              },
            },
          }}
        >
              <Box
                className="mini-cover"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: alpha(accentColor, isDark ? 0.15 : 0.1),
                  border: `1.5px solid ${alpha(accentColor, 0.25)}`,
                  transition: "transform 0.2s ease",
                  overflow: "hidden",
                }}
              >
                {song.cover ? (
                  <Box
                    component="img"
                    src={`${import.meta.env.BASE_URL}${song.cover}`}
                    alt={song.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <MusicNote sx={{ fontSize: 18, color: accentColor }} />
                )}
              </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.82rem",
                lineHeight: 1.3,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {song.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.68rem",
                color: "text.secondary",
                lineHeight: 1.2,
              }}
            >
              {song.artist}
              {songs.length > 1 ? ` · ${currentIdx + 1}/${songs.length}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Right: controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          {songs.length > 1 && (
            <IconButton
              onClick={prevSong}
              size="small"
              sx={{
                p: 0.5,
                borderRadius: "10px",
                color: "text.secondary",
                "&:hover": { color: "text.primary", backgroundColor: alpha(accentColor, 0.1) },
              }}
            >
              <SkipPrevious sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {songs.length > 1 && (
            <IconButton
              onClick={nextSong}
              size="small"
              sx={{
                p: 0.5,
                borderRadius: "10px",
                color: "text.secondary",
                "&:hover": { color: "text.primary", backgroundColor: alpha(accentColor, 0.1) },
              }}
            >
              <SkipNext sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          <IconButton
            onClick={() => setPlaylistOpen(true)}
            size="small"
            sx={{
              p: 0.5,
              borderRadius: "10px",
              color: "text.secondary",
              "&:hover": { color: "text.primary", backgroundColor: alpha(accentColor, 0.1) },
            }}
          >
            <QueueMusic sx={{ fontSize: 20 }} />
          </IconButton>

          <Box
            onClick={togglePlay}
            component={motion.div}
            whileTap={{ scale: 0.9 }}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: accentColor,
              color: isDark ? alpha(theme.palette.primary.dark || "#0c315a", 0.9) : "#fff",
              flexShrink: 0,
              boxShadow: `0 2px 8px ${alpha(accentColor, 0.35)}`,
            }}
          >
            {isPlaying ? (
              <Pause sx={{ fontSize: 18 }} />
            ) : (
              <PlayArrow sx={{ fontSize: 18, ml: 0.2 }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Playlist Dialog */}
      <Dialog
        open={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "24px",
              backgroundColor: isDark
                ? "rgba(22, 22, 28, 0.96)"
                : "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(24px)",
              border: "1px solid",
              borderColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(103,80,164,0.06)",
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              播放列表
            </Typography>
            <IconButton onClick={() => setPlaylistOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
          <List sx={{ py: 0 }}>
            {songs.map((s, idx) => {
              const isActive = idx === currentIdx;
              return (
                <ListItemButton
                  key={s.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setPlaylistOpen(false);
                  }}
                  sx={{
                    borderRadius: "14px",
                    mb: 0.5,
                    backgroundColor: isActive
                      ? alpha(accentColor, isDark ? 0.15 : 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha(accentColor, isDark ? 0.08 : 0.04),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {isActive ? (
                      <Check sx={{ fontSize: 18, color: accentColor }} />
                    ) : (
                      <MusicNote sx={{ fontSize: 18, color: "text.disabled" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={s.title}
                    secondary={s.artist}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.85rem",
                      color: isActive ? accentColor : "text.primary",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.72rem",
                    }}
                  />
                  <Chip
                    label={fmtDuration(s.duration)}
                    size="small"
                    sx={{
                      borderRadius: "8px",
                      fontSize: "0.65rem",
                      height: 22,
                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        isDark ? 0.08 : 0.06,
                      ),
                      color: "text.secondary",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Dialog>
    </>
  );
}

function fmtDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
