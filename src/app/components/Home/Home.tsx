import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ArrowForward,
  Article,
  PhotoLibrary,
  Person,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";

function createM3SurfaceTokens(surfaceHex: string, mode: "light" | "dark") {
  const isDark = mode === "dark";
  const r = parseInt(surfaceHex.slice(1, 3), 16);
  const g = parseInt(surfaceHex.slice(3, 5), 16);
  const b = parseInt(surfaceHex.slice(5, 7), 16);
  const tint = (factor: number) => {
    const num = Math.round(factor * 255);
    return isDark
      ? `rgb(${Math.min(r + num, 255)}, ${Math.min(g + num, 255)}, ${Math.min(b + num, 255)})`
      : `rgb(${Math.max(r - num, 0)}, ${Math.max(g - num, 0)}, ${Math.max(b - num, 0)})`;
  };
  return {
    surfaceContainerLow: tint(isDark ? 0.06 : 0.04),
    surfaceContainerHigh: tint(isDark ? 0.18 : 0.12),
    onSurface: isDark ? "rgb(230, 225, 229)" : "rgb(28, 27, 31)",
    onSurfaceVariant: isDark ? "rgb(202, 196, 208)" : "rgb(73, 69, 79)",
    outlineVariant: isDark ? "rgb(73, 69, 79)" : "rgb(202, 196, 208)",
    shadowColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
  };
}

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectPost: (post: BlogPost) => void;
  posts: BlogPost[];
  categories: string[];
}

export default function Home({
  onNavigate,
  onSelectPost,
  posts,
}: HomeProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const surfaceHex =
    theme.palette.background.paper || theme.palette.background.default;
  const m3 = createM3SurfaceTokens(surfaceHex, isDarkMode ? "dark" : "light");
  const mc = {
    ...m3,
    primary: theme.palette.primary.main,
    primaryContainer: theme.palette.primary.light || alpha(theme.palette.primary.main, 0.12),
    onPrimaryContainer: (theme.palette.primary as any)?.dark || theme.palette.primary.main,
  };

  const featuredPosts = posts.slice(0, 3);

  const features = [
    {
      icon: <Article sx={{ fontSize: 32 }} />,
      title: "技术文章",
      description: "记录开发中的思考、踩坑与实践",
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
      onClick: () => onNavigate("blog"),
    },
    {
      icon: <PhotoLibrary sx={{ fontSize: 32 }} />,
      title: "视觉影像",
      description: "一些照片、壁纸和随手记录",
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.16)}, ${alpha(theme.palette.error.main, 0.08)})`,
      onClick: () => onNavigate("gallery"),
    },
    {
      icon: <Person sx={{ fontSize: 32 }} />,
      title: "关于作者",
      description: "关于我、我的项目，还有联系方式",
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.14)}, ${alpha(theme.palette.primary.main, 0.06)})`,
      onClick: () => onNavigate("about"),
    },
  ];

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* ════════════════════════════════════════════
          HERO — MD3E Glassmorphism Blob Hero
          ════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "92vh" },
          display: "flex",
          alignItems: "center",
          pt: { xs: 10, md: 0 },
          pb: { xs: 10, md: 0 },
          overflow: "hidden",
          backgroundColor: isDarkMode
            ? "rgb(17, 16, 20)"
            : "rgb(250, 248, 254)",
        }}
      >
        {/* ── Animated Blob Background ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Blob 1 — Primary */}
          <Box
            component={motion.div}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
              rotate: [0, 15, -10, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: { xs: 300, md: 560 },
              height: { xs: 300, md: 560 },
              borderRadius: "50%",
              top: { xs: "-10%", md: "-15%" },
              right: { xs: "-20%", md: "-8%" },
              background: `radial-gradient(circle at 40% 40%, ${alpha(theme.palette.primary.main, 0.22)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 60%, transparent 100%)`,
              filter: "blur(60px)",
            }}
          />

          {/* Blob 2 — Secondary */}
          <Box
            component={motion.div}
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 30, -20, 0],
              scale: [1, 0.92, 1.06, 1],
              rotate: [0, -12, 8, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: { xs: 240, md: 440 },
              height: { xs: 240, md: 440 },
              borderRadius: "50%",
              bottom: { xs: "5%", md: "-10%" },
              left: { xs: "-15%", md: "-5%" },
              background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 50%, transparent 100%)`,
              filter: "blur(50px)",
            }}
          />

          {/* Blob 3 — Tertiary accent */}
          <Box
            component={motion.div}
            animate={{
              x: [0, 25, -25, 0],
              y: [0, -25, 25, 0],
              scale: [1, 1.08, 0.93, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: { xs: 180, md: 320 },
              height: { xs: 180, md: 320 },
              borderRadius: "50%",
              top: "35%",
              left: "50%",
              background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.error.main, 0.12)} 0%, transparent 70%)`,
              filter: "blur(45px)",
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            spacing={{ xs: 6, md: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* ── Left Content ── */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.05, 0.7, 0.1, 1],
                }}
              >
                <Box>
                  {/* Hero Headline */}
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "2.5rem",
                        sm: "3.2rem",
                        md: "4.2rem",
                      },
                      lineHeight: 1.1,
                      letterSpacing: "-0.04em",
                      mb: 3,
                    }}
                  >
                    写点代码，
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 60%, ${theme.palette.error.main} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      也写点日常
                    </Box>
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      mb: 4,
                      fontWeight: 400,
                      maxWidth: 520,
                      lineHeight: 1.8,
                      fontSize: { xs: "1rem", md: "1.08rem" },
                      opacity: 0.8,
                    }}
                  >
                    Hi，我是 Cangli。
                    这里记录一些开发、设计，还有平时折腾的东西。
                  </Typography>

                  {/* CTA Buttons */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      component={motion.button}
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => onNavigate("blog")}
                      sx={{
                        borderRadius: "999px",
                        px: 5,
                        py: 1.6,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
                        fontWeight: 700,
                        fontSize: "1rem",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        },
                      }}
                    >
                      阅读文章
                    </Button>

                    <Button
                      component={motion.button}
                      whileHover={{
                        scale: 1.04,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                      whileTap={{ scale: 0.97 }}
                      variant="outlined"
                      size="large"
                      onClick={() => onNavigate("about")}
                      sx={{
                        borderRadius: "999px",
                        px: 5,
                        py: 1.6,
                        fontWeight: 700,
                        fontSize: "1rem",
                        borderWidth: "1.5px",
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.18)"
                          : "rgba(103,80,164,0.3)",
                        backdropFilter: "blur(12px)",
                        background: isDarkMode
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(103,80,164,0.03)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: "1.5px",
                        },
                      }}
                    >
                      关于我
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* ── Right Visual — Floating Glass Card + Blob ── */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 340,
                  height: 420,
                }}
              >
                {/* Glass Card */}
                <Box
                  component={motion.div}
                  animate={{ y: [0, -12, 0], rotate: [0, 1, -0.5, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: "absolute",
                    top: 40,
                    left: 30,
                    width: 280,
                    height: 340,
                    borderRadius: "40px",
                    padding: "2px",
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.35)}, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.error.main, 0.25)})`,
                    boxShadow: `0 32px 64px ${alpha(theme.palette.primary.main, 0.18)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "38px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      backdropFilter: "blur(24px) saturate(1.8)",
                      WebkitBackdropFilter: "blur(24px) saturate(1.8)",
                      background: isDarkMode
                        ? "rgba(22, 22, 26, 0.7)"
                        : "rgba(255, 255, 255, 0.6)",
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 900,
                        fontSize: "3.5rem",
                        lineHeight: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {posts.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      篇文章
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 2,
                        borderRadius: 1,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.5,
                      }}
                    />
                    <Typography variant="caption" color="text.disabled">
                      keep building ✦ keep writing
                    </Typography>
                  </Box>
                </Box>

                {/* Floating small dot */}
                <Box
                  component={motion.div}
                  animate={{
                    y: [-6, 10, -6],
                    x: [0, 6, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.secondary.main,
                    opacity: 0.5,
                    filter: "blur(2px)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* ── Bottom Gradient Fade ── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* ════════════════════════════════════════════
          LATEST POSTS
          ════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 5,
                  height: 32,
                  borderRadius: "4px",
                  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                最新文章
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "primary.main",
                cursor: "pointer",
                transition: "gap 0.3s ease",
                "&:hover": { gap: 1 },
              }}
              onClick={() => onNavigate("blog")}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                查看全部
              </Typography>

              <ArrowForward sx={{ fontSize: 16 }} />
            </Box>
          </Box>

          <Grid container spacing={4}>
            {featuredPosts.map((post, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.5,
                    ease: [0.2, 0, 0, 1],
                  }}
                  whileHover={{ y: -8 }}
                  style={{ height: "100%" }}
                >
                  {/* ── M3 Elevated Card ── */}
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      backgroundColor: isDarkMode
                        ? `color-mix(in srgb, ${mc.surfaceContainerLow} 96%, ${mc.primary})`
                        : `color-mix(in srgb, ${mc.surfaceContainerLow} 98%, ${mc.primary})`,
                      border: `1px solid ${mc.outlineVariant}`,
                      boxShadow: isDarkMode
                        ? `0px 1px 2px ${mc.shadowColor}, 0px 1px 3px 1px ${mc.shadowColor}`
                        : `0px 1px 2px rgba(0,0,0,0.15), 0px 1px 3px 1px rgba(0,0,0,0.08)`,
                      overflow: "hidden",
                      position: "relative",
                      transition:
                        "background-color 0.25s ease, box-shadow 0.3s ease, border-color 0.25s ease",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? `color-mix(in srgb, ${mc.surfaceContainerHigh} 94%, ${mc.primary})`
                          : `color-mix(in srgb, ${mc.surfaceContainerHigh} 96%, ${mc.primary})`,
                        borderColor: mc.primary,
                        boxShadow: isDarkMode
                          ? `0px 2px 4px ${mc.shadowColor}, 0px 4px 12px ${mc.shadowColor}`
                          : `0px 2px 4px rgba(0,0,0,0.12), 0px 4px 12px rgba(0,0,0,0.06)`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        background: `radial-gradient(ellipse at 0% 0%, ${mc.primary}08 0%, transparent 70%)`,
                      }}
                    />
                    <CardActionArea
                      onClick={() => onSelectPost(post)}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        height: "100%",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={160}
                          category={post.category}
                        />
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: mc.primaryContainer,
                            color: mc.onPrimaryContainer,
                            fontWeight: 600,
                            fontSize: "0.65rem",
                            borderRadius: "6px",
                            height: 22,
                            "& .MuiChip-label": { px: 1 },
                            boxShadow: isDarkMode
                              ? "0 1px 3px rgba(0,0,0,0.3)"
                              : "0 1px 3px rgba(0,0,0,0.08)",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            lineHeight: 1.35,
                            letterSpacing: "0.1px",
                            color: mc.onSurface,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            lineHeight: 1.5,
                            color: mc.onSurfaceVariant,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            flex: 1,
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: "auto",
                            pt: 1,
                            borderTop: `1px solid ${mc.outlineVariant}`,
                          }}
                        >
                          <Avatar
                            src={post.author.avatar}
                            sx={{ width: 20, height: 20 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: mc.onSurface,
                                fontSize: "0.7rem",
                                display: "block",
                              }}
                            >
                              {post.author.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.62rem",
                                color: mc.onSurfaceVariant,
                              }}
                            >
                              {post.date} · {post.readTime}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════
          CONTENT INDEX — Refined MD3E Cards
          ════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.01)"
            : "rgba(103,80,164,0.02)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1.5, letterSpacing: "-0.01em" }}
            >
              内容索引
            </Typography>

            <Typography variant="body1" color="text.secondary">
              随便看看，也许会有你感兴趣的内容
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.2, 0, 0, 1],
                  }}
                  whileHover={{ y: -6 }}
                  style={{ height: "100%" }}
                >
                  <Card
                    onClick={feature.onClick}
                    sx={{
                      height: "100%",
                      borderRadius: "28px",
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : alpha(theme.palette.primary.main, 0.08),
                      background: feature.gradient,
                      backdropFilter: "blur(16px) saturate(1.6)",
                      WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                      boxShadow: "none",
                      cursor: "pointer",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        borderColor: feature.color,
                        boxShadow: `0 12px 40px ${alpha(feature.color, 0.12)}`,
                      },
                    }}
                  >
                    <CardActionArea sx={{ p: 4, height: "100%" }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `linear-gradient(135deg, ${alpha(feature.color, 0.18)}, ${alpha(feature.color, 0.06)})`,
                          color: feature.color,
                          mb: 3,
                          border: "1px solid",
                          borderColor: alpha(feature.color, 0.15),
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
