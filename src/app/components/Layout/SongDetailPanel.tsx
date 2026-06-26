import { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Slide,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Pause,
  PlayArrow,
  SkipPrevious,
  SkipNext,
  MusicNote,
  Album,
  CalendarToday,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { useAudio } from "../../service/AudioContext";

interface SongDetailPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SongDetailPanel({ open, onClose }: SongDetailPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
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
    lyrics,
    currentLyricIdx,
    isLyricsLoading,
    songs,
    currentIdx,
  } = useAudio();

  const lyricsScrollRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // Auto-scroll lyrics to current line
  useEffect(() => {
    if (activeLyricRef.current && lyricsScrollRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLyricIdx]);

  const accentColor = isDark
    ? theme.palette.primary.light || "#a8c7fa"
    : theme.palette.primary.dark || "#005faf";

  const coverUrl = song?.cover
    ? `${import.meta.env.BASE_URL}${song.cover}`
    : "";

  const hasCover = !!coverUrl;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  if (!song) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          transition: "opacity 0.35s ease",
          opacity: open ? 1 : 0,
        }}
      />

      {/* Panel */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit timeout={350}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 480,
            maxHeight: "88vh",
            mx: { xs: 1, sm: "auto" },
            mb: { xs: 0.5, sm: 1 },
            borderRadius: "28px 28px 16px 16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: isDark
              ? "rgba(18, 18, 24, 0.96)"
              : "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(32px)",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(103,80,164,0.08)",
            boxShadow: isDark
              ? "0 -8px 48px rgba(0,0,0,0.5)"
              : "0 -8px 48px rgba(0,0,0,0.12)",
          }}
        >
          {/* Handle bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 1.5,
              pb: 0.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 4,
                borderRadius: 2,
                bgcolor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.15)",
              }}
            />
          </Box>

          {/* Header: song title + close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              pt: 0.5,
              pb: 1,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "280px",
                }}
              >
                {song.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                {song.artist}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                borderRadius: "12px",
                color: "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: alpha(accentColor, 0.1) },
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Scrollable content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Cover art */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pt: 0.5,
              }}
            >
              <Box
                sx={{
                  width: { xs: 200, sm: 240 },
                  height: { xs: 200, sm: 240 },
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(accentColor, isDark ? 0.12 : 0.08),
                  border: `1.5px solid ${alpha(accentColor, 0.2)}`,
                  boxShadow: `0 8px 32px ${alpha(accentColor, 0.15)}`,
                  position: "relative",
                }}
              >
                {hasCover ? (
                  <Box
                    component="img"
                    src={coverUrl}
                    alt={song.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <MusicNote
                    sx={{
                      fontSize: 64,
                      color: alpha(accentColor, 0.35),
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Song metadata chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.8,
                justifyContent: "center",
              }}
            >
              {song.meta.album && (
                <Chip
                  icon={<Album sx={{ fontSize: 14 }} />}
                  label={song.meta.album}
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.7rem",
                    height: 26,
                    bgcolor: alpha(accentColor, isDark ? 0.1 : 0.06),
                    color: "text.secondary",
                    "& .MuiChip-icon": { color: accentColor, ml: 0.5 },
                  }}
                />
              )}
              {song.meta.year && (
                <Chip
                  icon={<CalendarToday sx={{ fontSize: 14 }} />}
                  label={song.meta.year}
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.7rem",
                    height: 26,
                    bgcolor: alpha(accentColor, isDark ? 0.1 : 0.06),
                    color: "text.secondary",
                    "& .MuiChip-icon": { color: accentColor, ml: 0.5 },
                  }}
                />
              )}
              {song.meta.genre && (
                <Chip
                  label={song.meta.genre}
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.7rem",
                    height: 26,
                    bgcolor: alpha(accentColor, isDark ? 0.1 : 0.06),
                    color: "text.secondary",
                  }}
                />
              )}
            </Box>

            {/* Progress bar */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box
                onClick={handleProgressClick}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(accentColor, isDark ? 0.12 : 0.08),
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    height: 8,
                  },
                  transition: "height 0.15s ease",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(progressPct, 100)}%`,
                    borderRadius: 3,
                    bgcolor: accentColor,
                    transition: "width 0.05s linear",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: accentColor,
                      boxShadow: `0 0 6px ${alpha(accentColor, 0.5)}`,
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.68rem", color: "text.disabled" }}
                >
                  {fmtTime(currentTime)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.68rem", color: "text.disabled" }}
                >
                  {fmtTime(duration)}
                </Typography>
              </Box>
            </Box>

            {/* Playback controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <IconButton
                onClick={prevSong}
                disabled={songs.length <= 1}
                sx={{
                  borderRadius: "14px",
                  color: "text.secondary",
                  "&:hover": { color: "text.primary", bgcolor: alpha(accentColor, 0.1) },
                }}
              >
                <SkipPrevious sx={{ fontSize: 28 }} />
              </IconButton>

              <Box
                onClick={togglePlay}
                component={motion.div}
                whileTap={{ scale: 0.9 }}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: accentColor,
                  color: isDark
                    ? alpha(theme.palette.primary.dark || "#0c315a", 0.9)
                    : "#fff",
                  boxShadow: `0 4px 16px ${alpha(accentColor, 0.35)}`,
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ fontSize: 26 }} />
                ) : (
                  <PlayArrow sx={{ fontSize: 26, ml: 0.3 }} />
                )}
              </Box>

              <IconButton
                onClick={nextSong}
                disabled={songs.length <= 1}
                sx={{
                  borderRadius: "14px",
                  color: "text.secondary",
                  "&:hover": { color: "text.primary", bgcolor: alpha(accentColor, 0.1) },
                }}
              >
                <SkipNext sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>

            {/* Lyrics */}
            <Box sx={{ flex: 1, minHeight: 100 }}>
              {isLyricsLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <CircularProgress size={24} sx={{ color: accentColor }} />
                </Box>
              ) : lyrics.length > 0 ? (
                <Box
                  ref={lyricsScrollRef}
                  sx={{
                    maxHeight: 220,
                    overflowY: "auto",
                    px: 1,
                    scrollBehavior: "smooth",
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: alpha(accentColor, 0.25),
                      borderRadius: 2,
                    },
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 4,
                      gap: 0.8,
                    }}
                  >
                    {lyrics.map((line, idx) => {
                      const isActive = idx === currentLyricIdx;
                      const isPast = idx < currentLyricIdx;
                      return (
                        <Box
                          key={idx}
                          ref={isActive ? activeLyricRef : undefined}
                          sx={{
                            py: 0.4,
                            px: 1.5,
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            bgcolor: isActive
                              ? alpha(accentColor, isDark ? 0.15 : 0.1)
                              : "transparent",
                            "&:hover": {
                              bgcolor: alpha(accentColor, isDark ? 0.08 : 0.04),
                            },
                          }}
                          onClick={() => seek(line.time)}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: isActive ? "0.95rem" : "0.82rem",
                              fontWeight: isActive ? 700 : isPast ? 400 : 400,
                              color: isActive
                                ? accentColor
                                : isPast
                                  ? "text.disabled"
                                  : "text.secondary",
                              textAlign: "center",
                              transition: "all 0.3s ease",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {line.text}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", fontSize: "0.78rem" }}
                  >
                    暂无歌词
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
