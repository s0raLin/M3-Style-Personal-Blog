import { useState, useMemo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  CardActionArea,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccessTime,
  CalendarToday,
} from "@mui/icons-material";
import { motion } from "motion/react";

import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";

interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
  posts: BlogPost[];
  categories: string[];
}

// M3 标高令牌 — 需与 dynamicTheme 配色体系对应
// surfaceContainerLowest → surfaceContainerHigh 由底层色叠加 white/black tint 得到
function createM3SurfaceTokens(surfaceHex: string, mode: "light" | "dark") {
  const isDark = mode === "dark";
  // 将 hex 转成 r/g/b
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
    surface: surfaceHex,
    surfaceLow: tint(isDark ? 0.03 : 0.02),
    surfaceHigh: tint(isDark ? 0.09 : 0.06),
    surfaceContainerLow: tint(isDark ? 0.06 : 0.04),
    surfaceContainer: tint(isDark ? 0.12 : 0.08),
    surfaceContainerHigh: tint(isDark ? 0.18 : 0.12),
    surfaceTint: surfaceHex,
    onSurface: isDark ? "rgb(230, 225, 229)" : "rgb(28, 27, 31)",
    onSurfaceVariant: isDark ? "rgb(202, 196, 208)" : "rgb(73, 69, 79)",
    outline: isDark ? "rgb(147, 143, 153)" : "rgb(121, 116, 126)",
    outlineVariant: isDark ? "rgb(73, 69, 79)" : "rgb(202, 196, 208)",
    shadowColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
  };
}

export default function BlogList({
  onSelectPost,
  posts,
  categories,
}: BlogListProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 从 MUI 主题提取 M3 令牌
  const m3 = (() => {
    const surfaceHex =
      theme.palette.background.paper || theme.palette.background.default;
    const surfaceTokens = createM3SurfaceTokens(surfaceHex, isDarkMode ? "dark" : "light");
    return {
      ...surfaceTokens,
      primary: theme.palette.primary.main,
      onPrimary: theme.palette.primary.contrastText,
      primaryContainer: theme.palette.primary.light || alpha(theme.palette.primary.main, 0.12),
      onPrimaryContainer:
        (theme.palette.primary as any)?.dark || theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      secondaryContainer: theme.palette.secondary.light || alpha(theme.palette.secondary.main, 0.12),
      onSecondaryContainer:
        (theme.palette.secondary as any)?.dark || theme.palette.secondary.main,
      tertiary: (theme.palette as any)?.tertiary?.main || theme.palette.secondary.main,
      tertiaryContainer:
        (theme.palette as any)?.tertiary?.light || alpha(theme.palette.secondary.main, 0.10),
      onTertiaryContainer:
        (theme.palette as any)?.tertiary?.dark || theme.palette.secondary.main,
      divider: theme.palette.divider || surfaceTokens.outlineVariant,
    };
  })();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState("全部");

  const handleCategoryChange = (_: any, newValue: string) => {
    setSelectedCategory(newValue);
    setSelectedTag("全部");
  };

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      if (selectedCategory === "全部" || post.category === selectedCategory) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return ["全部", ...Array.from(tagsSet)];
  }, [posts, selectedCategory]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "全部" || post.category === selectedCategory;

    const matchesTag =
      selectedTag === "全部" || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 5,
              height: 32,
              borderRadius: "4px",
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            博客文章
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, ml: 7 }}>
          分享技术见解与设计思考
        </Typography>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0, 0, 1] }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索文章标题、内容或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(103,80,164,0.02)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(103,80,164,0.04)",
              },
              "&.Mui-focused": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: "12px 12px 0 0",
              minWidth: "auto",
              px: 2.5,
              py: 1.5,
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </motion.div>

      {/* Tag Filter Chips */}
      {availableTags.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 4,
              overflowX: "auto",
              py: 0.5,
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {availableTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => setSelectedTag(tag)}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.12)
                      : "transparent",
                    color: isSelected
                      ? theme.palette.primary.main
                      : "text.secondary",
                    border: isSelected
                      ? `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      : "1.5px solid",
                    borderColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.3)
                      : isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                    transition: "all 0.2s ease",
                    backdropFilter: isSelected ? "blur(8px)" : "none",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? alpha(theme.palette.primary.main, 0.18)
                        : alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                />
              );
            })}
          </Box>
        </motion.div>
      )}

      {/* Posts Grid or Empty State */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              color: "text.secondary",
              borderRadius: "28px",
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.02)"
                : "rgba(103,80,164,0.02)",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(103,80,164,0.05)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              没有找到相关文章
            </Typography>
            <Typography variant="body2">
              尝试其他搜索关键词或分类
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={3}>
            {filteredPosts.map((post) => (
              <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                  style={{ height: "100%" }}
                >
                  {/* ── M3 Elevated Card ── */}
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      // M3 card – 12dp radius
                      borderRadius: "12px",
                      // surfaceContainerLow 作为默认背景，带 primary tint
                      backgroundColor: isDarkMode
                        ? `color-mix(in srgb, ${m3.surfaceContainerLow} 96%, ${m3.primary})`
                        : `color-mix(in srgb, ${m3.surfaceContainerLow} 98%, ${m3.primary})`,
                      // outlineVariant 边框
                      border: `1px solid ${m3.outlineVariant}`,
                      // M3 Elevation Level 1
                      boxShadow: isDarkMode
                        ? `0px 1px 2px ${m3.shadowColor}, 0px 1px 3px 1px ${m3.shadowColor}`
                        : `0px 1px 2px rgba(0,0,0,0.15), 0px 1px 3px 1px rgba(0,0,0,0.08)`,
                      overflow: "hidden",
                      position: "relative",
                      transition:
                        "background-color 0.25s ease, box-shadow 0.3s ease, border-color 0.25s ease",
                      "&:hover": {
                        // surfaceContainerHigh on hover + primary state layer
                        backgroundColor: isDarkMode
                          ? `color-mix(in srgb, ${m3.surfaceContainerHigh} 94%, ${m3.primary})`
                          : `color-mix(in srgb, ${m3.surfaceContainerHigh} 96%, ${m3.primary})`,
                        borderColor: m3.primary,
                        // M3 Elevation Level 2
                        boxShadow: isDarkMode
                          ? `0px 2px 4px ${m3.shadowColor}, 0px 4px 12px ${m3.shadowColor}`
                          : `0px 2px 4px rgba(0,0,0,0.12), 0px 4px 12px rgba(0,0,0,0.06)`,
                      },
                    }}
                  >
                    {/* M3 surface tint overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        background: `radial-gradient(ellipse at 0% 0%, ${m3.primary}08 0%, transparent 70%)`,
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
                        {/* M3 分类 Chip – primaryContainer 配色 */}
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: m3.primaryContainer,
                            color: m3.onPrimaryContainer,
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
                        {/* 标题 – M3 title small */}
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            lineHeight: 1.35,
                            letterSpacing: "0.1px",
                            color: m3.onSurface,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.title}
                        </Typography>

                        {/* 摘要 – M3 body small */}
                        <Typography
                          variant="caption"
                          sx={{
                            lineHeight: 1.5,
                            color: m3.onSurfaceVariant,
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

                        {/* Tags – M3 assist chips */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              sx={{
                                borderRadius: "6px",
                                fontSize: "0.65rem",
                                fontWeight: 500,
                                height: 22,
                                borderColor: m3.outlineVariant,
                                color: m3.onSurfaceVariant,
                                "& .MuiChip-label": { px: 0.8 },
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: m3.primaryContainer,
                                  borderColor: m3.primary,
                                  color: m3.onPrimaryContainer,
                                },
                              }}
                            />
                          ))}
                        </Box>

                        {/* Author + Meta – M3 caption */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                            pt: 1,
                            borderTop: `1px solid ${m3.outlineVariant}`,
                          }}
                        >
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 0.7 }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{ width: 20, height: 20 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: m3.onSurface,
                                fontSize: "0.7rem",
                              }}
                            >
                              {post.author.name}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: m3.onSurfaceVariant,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                              <CalendarToday sx={{ fontSize: 10 }} />
                              <Typography variant="caption" sx={{ fontSize: "0.62rem" }}>
                                {post.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                              <AccessTime sx={{ fontSize: 10 }} />
                              <Typography variant="caption" sx={{ fontSize: "0.62rem" }}>
                                {post.readTime}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Container>
  );
}
