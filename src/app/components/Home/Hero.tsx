import { useState, useEffect, useRef, ReactNode } from "react";
import { Box, useTheme, alpha } from "@mui/material";
import { motion } from "motion/react";
import {
  MusicNote,
  Pause,
  PlayArrow,
  ArticleOutlined,
  CategoryOutlined,
  TimerOutlined,
} from "@mui/icons-material";

// ── Pure CSS keyframes ──
const md3eKeyframes = `
@keyframes aura-flow {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(30px, -40px) scale(1.12) rotate(120deg); }
  66% { transform: translate(-20px, 20px) scale(0.92) rotate(240deg); }
}
@keyframes bar-pulse {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
@keyframes blob-morph-1 {
  0%, 100% { transform: translate(0, 0) scale(1); border-radius: 48% 52% 62% 38% / 43% 57% 43% 57%; }
  25% { transform: translate(55px, -35px) scale(1.07); border-radius: 38% 62% 34% 66% / 56% 44% 56% 44%; }
  50% { transform: translate(-18px, -60px) scale(0.94); border-radius: 58% 42% 63% 37% / 38% 62% 38% 62%; }
  75% { transform: translate(-40px, 18px) scale(1.04); border-radius: 33% 67% 48% 52% / 62% 38% 62% 38%; }
}
@keyframes blob-morph-2 {
  0%, 100% { transform: translate(0, 0) scale(1); border-radius: 52% 48% 55% 45% / 52% 48% 52% 48%; }
  25% { transform: translate(-40px, 45px) scale(0.94); border-radius: 63% 37% 42% 58% / 38% 62% 38% 62%; }
  50% { transform: translate(25px, -40px) scale(1.06); border-radius: 33% 67% 58% 42% / 62% 38% 62% 38%; }
  75% { transform: translate(35px, 22px) scale(0.97); border-radius: 48% 52% 33% 67% / 48% 52% 48% 52%; }
}
@keyframes blob-morph-3 {
  0%, 100% { transform: translate(0, 0) scale(1); border-radius: 55% 45% 42% 58% / 48% 52% 42% 58%; }
  33% { transform: translate(-45px, -22px) scale(1.05); border-radius: 36% 64% 57% 43% / 62% 38% 58% 42%; }
  66% { transform: translate(28px, 35px) scale(0.96); border-radius: 62% 38% 36% 64% / 33% 67% 52% 48%; }
}
`;

// ── Theme-aware StatPill with proper high-contrast text ──
function StatPill({
  icon,
  label,
  value,
  isDarkMode,
  accentColor,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  isDarkMode: boolean;
  accentColor: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2.2,
        py: 0.8,
        borderRadius: "16px",
        backgroundColor: isDarkMode
          ? alpha(accentColor, 0.06)
          : alpha(accentColor, 0.08),
        border: "1px solid",
        borderColor: isDarkMode
          ? alpha(accentColor, 0.12)
          : alpha(accentColor, 0.15),
        backdropFilter: "blur(8px)",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "&:hover": {
          backgroundColor: isDarkMode
            ? alpha(accentColor, 0.12)
            : alpha(accentColor, 0.16),
          borderColor: alpha(accentColor, 0.35),
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          color: accentColor,
          display: "flex",
          fontSize: 18,
          opacity: 0.9,
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          fontWeight: 700,
          fontSize: "0.9rem",
          fontFamily: "Google Sans, Inter, sans-serif",
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.92)"
            : "rgba(0, 0, 0, 0.88)",
        }}
      >
        {value}
      </Box>
      <Box
        sx={{
          fontWeight: 500,
          fontSize: "0.75rem",
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.62)"
            : "rgba(0, 0, 0, 0.6)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Box>
    </Box>
  );
}

interface HeroProps {
  onNavigate: (page: string) => void;
  posts?: { length: number };
  categories?: string[];
  totalReadingMinutes?: number;
}

export default function Hero({
  onNavigate,
  posts,
  categories = [],
  totalReadingMinutes = 0,
}: HeroProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // ── Theme-derived accent tokens ──
  const accent = theme.palette.primary.main;
  const onAccentContainer = isDarkMode
    ? theme.palette.primary.light || "#a8c7fa"
    : theme.palette.primary.dark || "#005faf";

  // Text colors from theme
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const textTertiary = isDarkMode
    ? "rgba(255, 255, 255, 0.55)"
    : "rgba(0, 0, 0, 0.52)";

  // Accent for links — bright and visible in both modes
  const linkAccent = isDarkMode
    ? "rgba(255, 255, 255, 0.82)"
    : theme.palette.primary.dark || "rgba(0, 0, 0, 0.82)";

  // Surface tokens
  const surfaceBg = theme.palette.background.default;
  const surfaceContainer = isDarkMode
    ? alpha(theme.palette.background.paper, 0.75)
    : alpha(theme.palette.background.paper, 0.85);
  const surfaceContainerInner = isDarkMode
    ? alpha(theme.palette.background.paper, 0.5)
    : alpha(theme.palette.background.paper, 0.65);
  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(0, 0, 0, 0.06)";
  const borderInner = isDarkMode
    ? "rgba(255, 255, 255, 0.04)"
    : "rgba(0, 0, 0, 0.04)";
  const shadowCard = isDarkMode
    ? "0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)"
    : "0 24px 48px rgba(0, 0, 0, 0.08)";

  // Button colors — always high-contrast for readability
  const btnBg = isDarkMode
    ? alpha(theme.palette.primary.main, 0.25)
    : alpha(theme.palette.primary.main, 0.14);
  const btnBgHover = isDarkMode
    ? alpha(theme.palette.primary.main, 0.4)
    : alpha(theme.palette.primary.main, 0.22);
  const btnText = isDarkMode
    ? "rgba(255, 255, 255, 0.92)"
    : "rgba(0, 0, 0, 0.88)";

  // Play button colors
  const playBtnBg = isDarkMode
    ? theme.palette.primary.light || "#a8c7fa"
    : theme.palette.primary.main;
  const playBtnText = isDarkMode
    ? alpha(theme.palette.primary.dark || "#0c315a", 0.9)
    : "#ffffff";
  const playBtnHover = isDarkMode
    ? theme.palette.primary.main
    : theme.palette.primary.dark || "#1a73e8";

  // Progress bar
  const progressTrack = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforeRef = useRef<number>(0);

  const DURATION = 194;
  const togglePlay = () => {
    if (isPlaying) {
      cancelAnimationFrame(animFrameRef.current);
      elapsedBeforeRef.current = progress * DURATION;
      setIsPlaying(false);
    } else {
      startTimeRef.current = performance.now();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const tick = (now: number) => {
      const elapsed =
        elapsedBeforeRef.current + (now - startTimeRef.current) / 1000;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(0);
        elapsedBeforeRef.current = 0;
        startTimeRef.current = performance.now();
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  const fmt = (pct: number) => {
    const s = Math.floor(pct * DURATION);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: surfaceBg,
      }}
    >
      <style>{md3eKeyframes}</style>

      {/* ═══ Vibrant Liquid Blob Background (fixed iconic colors) ═══ */}
      <Box
        sx={{
          position: "absolute",
          left: "5%",
          top: "8%",
          width: { xs: 280, md: 500 },
          height: { xs: 280, md: 500 },
          filter: "blur(95px)",
          opacity: 0.38,
          animation: "blob-morph-1 18s ease-in-out infinite",
          background:
            "radial-gradient(circle at 50% 50%, #00ffcc, rgba(0,255,204,0.15) 60%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "-5%",
          width: { xs: 340, md: 580 },
          height: { xs: 340, md: 580 },
          filter: "blur(115px)",
          opacity: 0.42,
          animation: "blob-morph-2 22s ease-in-out infinite",
          background:
            "radial-gradient(circle at 50% 50%, #4a3fbf, rgba(74,63,191,0.15) 60%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "25%",
          top: "35%",
          width: { xs: 290, md: 520 },
          height: { xs: 290, md: 520 },
          filter: "blur(90px)",
          opacity: 0.32,
          animation: "blob-morph-3 20s ease-in-out infinite",
          background:
            "radial-gradient(circle at 50% 50%, #ff1493, rgba(255,20,147,0.15) 60%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Grain overlay ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.015,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ═══ Main Content ═══ */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 4, md: 5 },
          px: 3,
          width: "100%",
          maxWidth: 840,
        }}
      >
        {/* ── Stat Pills ── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <StatPill
            icon={<ArticleOutlined />}
            label="Articles"
            value={`${posts?.length ?? 0}`}
            isDarkMode={isDarkMode}
            accentColor={accent}
          />
          <StatPill
            icon={<CategoryOutlined />}
            label="Categories"
            value={`${categories.filter((c) => c !== "全部").length}`}
            isDarkMode={isDarkMode}
            accentColor={accent}
          />
          <StatPill
            icon={<TimerOutlined />}
            label="Reading Mins"
            value={`${totalReadingMinutes}`}
            isDarkMode={isDarkMode}
            accentColor={accent}
          />
        </Box>

        {/* ═══ Expressive Glass Container ═══ */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.1, 1, 0.2, 1],
          }}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 520,
            p: 3.5,
            borderRadius: "32px",
            backgroundColor: surfaceContainer,
            border: `1px solid ${borderColor}`,
            backdropFilter: "blur(24px) saturate(1.2)",
            boxShadow: shadowCard,
          }}
        >
          {/* ── Nested Audio Component ── */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: "20px",
              backgroundColor: surfaceContainerInner,
              border: `1px solid ${borderInner}`,
              mb: 3.5,
            }}
          >
            {/* Now Playing header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MusicNote
                  sx={{
                    fontSize: 16,
                    color: onAccentContainer,
                  }}
                />
                <Box
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: textTertiary,
                    letterSpacing: "0.05em",
                  }}
                >
                  NOW PLAYING
                </Box>
              </Box>

              {/* Audio visualizer bars */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0.3,
                  alignItems: "center",
                  height: 12,
                }}
              >
                {[1.2, 2.2, 1.5, 2.5].map((speed, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 2,
                      height: 12,
                      backgroundColor: isPlaying
                        ? onAccentContainer
                        : alpha(onAccentContainer, 0.15),
                      borderRadius: 1,
                      transformOrigin: "bottom",
                      animation: isPlaying
                        ? `bar-pulse ${speed}s ease-in-out infinite`
                        : "none",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Track info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                my: 1,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    color: textPrimary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  夜に駆ける
                </Box>
                <Box
                  sx={{
                    fontWeight: 400,
                    fontSize: "0.8rem",
                    color: textSecondary,
                    mt: 0.4,
                  }}
                >
                  YOASOBI
                </Box>
              </Box>

              {/* Play/Pause button */}
              <Box
                onClick={togglePlay}
                component={motion.div}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: playBtnBg,
                  color: playBtnText,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: playBtnHover,
                  },
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ fontSize: 22 }} />
                ) : (
                  <PlayArrow sx={{ fontSize: 22, ml: 0.2 }} />
                )}
              </Box>
            </Box>

            {/* Progress bar */}
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  position: "relative",
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: progressTrack,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${progress * 100}%`,
                    backgroundColor: onAccentContainer,
                    borderRadius: 2,
                    transition: "width 0.1s linear",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  px: 0.2,
                }}
              >
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: textTertiary,
                  }}
                >
                  {fmt(progress)}
                </Box>
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: textTertiary,
                  }}
                >
                  3:14
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Action Row ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => onNavigate("blog")}
              component={motion.button}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                width: "100%",
                py: 1.6,
                borderRadius: "16px",
                backgroundColor: btnBg,
                color: btnText,
                border: "none",
                fontWeight: 600,
                fontSize: "0.92rem",
                letterSpacing: "0.02em",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                "&:hover": {
                  backgroundColor: btnBgHover,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                },
              }}
            >
              Explore Articles
            </Box>

            <Box
              onClick={() => onNavigate("about")}
              component={motion.div}
              whileHover={{ x: 3 }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                mt: 1,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: linkAccent,
                letterSpacing: "0.01em",
                transition: "all 0.25s ease",
                "&:hover": {
                  opacity: 0.8,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                },
              }}
            >
              Read Profile
              <Box component="span" sx={{ fontSize: "0.9rem", lineHeight: 1 }}>
                →
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Bottom scroll indicator ── */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <Box
          component={motion.div}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            width: 32,
            height: 4,
            borderRadius: 999,
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: "100%",
              borderRadius: 999,
              backgroundColor: onAccentContainer,
              mx: "auto",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
