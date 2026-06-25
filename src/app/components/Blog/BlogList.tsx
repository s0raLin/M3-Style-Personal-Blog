import { useState, useMemo, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  ButtonBase,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday,
  ViewList,
  GridView,
  LocalOffer as TagIcon,
  ChevronRight,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";

// ═══════════════════════════════════════════
// MD3E Blog Card — reusable card component
// ═══════════════════════════════════════════
export function MD3ECard({
  post,
  onSelectPost,
  variant,
}: {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
  variant: "grid" | "list";
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ── MD3E surface tokens ──
  const cardBg = theme.palette.background.paper;
  const cardBorder = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(103,80,164,0.06)";
  const cardHoverElevation = isDark
    ? "0 8px 32px rgba(0,0,0,0.45)"
    : `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`;

  // ── Category chip colors (primary container) ──
  const catBg = alpha(theme.palette.primary.main, 0.85);
  const catColor = theme.palette.primary.contrastText;

  // ── Tag chip colors (primary container) ──
  const tagBg = isDark
    ? alpha(theme.palette.primary.main, 0.28)
    : alpha(theme.palette.primary.main, 0.1);
  const tagColor = isDark
    ? "#ffffff"
    : theme.palette.primary.dark;

  if (variant === "list") {
    return (
      <ButtonBase
        onClick={() => onSelectPost(post)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          px: 3,
          py: 2,
          textAlign: "left",
          width: "100%",
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: "background-color 0.25s cubic-bezier(0.2,0.8,0.2,1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.04),
          },
        }}
      >
        {/* Thumbnail */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          }}
        >
          <ImagePlaceholder
            src={post.coverImage}
            alt={post.title}
            height={64}
            category={post.category}
          />
        </Box>

        {/* Text body */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.92rem",
              lineHeight: 1.4,
              color: "text.primary",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.4,
              color: "text.secondary",
              fontSize: "0.78rem",
              lineHeight: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {post.excerpt}
          </Typography>
          {/* Meta row: date + readTime + category */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mt: 0.8 }}
          >
            <CalendarToday sx={{ fontSize: 12, color: "text.disabled" }} />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.7rem" }}
            >
              {post.date}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: "0.7rem" }}
            >
              · {post.readTime}
            </Typography>
            <Chip
              label={post.category}
              size="small"
              sx={{
                height: 22,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.64rem",
                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.1),
                color: theme.palette.primary.main,
                border: "none",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Stack>
        </Box>
        <ChevronRight
          sx={{
            fontSize: 20,
            color: "text.disabled",
            flexShrink: 0,
          }}
        />
      </ButtonBase>
    );
  }

  // ── Grid card ──
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      sx={{ height: "100%" }}
    >
      <ButtonBase
        onClick={() => onSelectPost(post)}
        disableRipple
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100%",
          overflow: "hidden",
          borderRadius: "20px",
          textAlign: "left",
          border: "1px solid",
          borderColor: cardBorder,
          backgroundColor: cardBg,
          width: "100%",
          transition:
            "box-shadow 0.35s cubic-bezier(0.2,0.8,0.2,1), border-color 0.35s ease",
          "&:hover": {
            boxShadow: cardHoverElevation,
            borderColor: isDark
              ? "rgba(255,255,255,0.12)"
              : alpha(theme.palette.primary.main, 0.15),
          },
        }}
      >
        {/* Media */}
        <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <ImagePlaceholder
            src={post.coverImage}
            alt={post.title}
            height={180}
            category={post.category}
          />
          {/* Category pill overlay */}
          <Chip
            label={post.category}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              height: 26,
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.7rem",
              backgroundColor: catBg,
              color: catColor,
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
              "& .MuiChip-label": { px: 1.2 },
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 0.8,
            }}
          >
            {post.title}
          </Typography>

          {/* Excerpt */}
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.55,
              color: "text.secondary",
              fontSize: "0.8rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1.5,
              flex: 1,
            }}
          >
            {post.excerpt}
          </Typography>

          {/* Tags row */}
          {post.tags && post.tags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mb: 1.5,
              }}
            >
              {post.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    height: 22,
                    borderRadius: "7px",
                    fontWeight: 500,
                    fontSize: "0.66rem",
                    backgroundColor: tagBg,
                    color: tagColor,
                    border: "none",
                    "& .MuiChip-label": { px: 0.8 },
                  }}
                />
              ))}
              {post.tags.length > 3 && (
                <Chip
                  label={`+${post.tags.length - 3}`}
                  size="small"
                  sx={{
                    height: 22,
                    borderRadius: "7px",
                    fontWeight: 500,
                    fontSize: "0.66rem",
                    backgroundColor: alpha(theme.palette.secondary.main, isDark ? 0.05 : 0.04),
                    color: "text.disabled",
                    border: "none",
                    "& .MuiChip-label": { px: 0.8 },
                  }}
                />
              )}
            </Box>
          )}

          {/* Footer: author + date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 1.5,
              mt: "auto",
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Avatar
                src={post.author.avatar}
                sx={{ width: 22, height: 22 }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
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
                gap: 0.6,
                color: "text.secondary",
              }}
            >
              <CalendarToday sx={{ fontSize: 11 }} />
              <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                {post.date}
              </Typography>
            </Box>
          </Box>
        </Box>
      </ButtonBase>
    </Box>
  );
}

// ═══════════════════════════════════════════
// BlogList
// ═══════════════════════════════════════════
interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
  posts: BlogPost[];
  categories: string[];
}

export default function BlogList({
  onSelectPost,
  posts,
  categories,
}: BlogListProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    try {
      const saved = localStorage.getItem("m3blog_viewMode");
      if (saved === "list" || saved === "grid") return saved;
    } catch {}
    return "grid";
  });

  useEffect(() => {
    try { localStorage.setItem("m3blog_viewMode", viewMode); } catch {}
  }, [viewMode]);
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

  const gridColumns = { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" };

  // ── MD3E surface tokens ──
  const surfaceContainer = isDarkMode
    ? alpha(theme.palette.background.paper, 0.45)
    : alpha(theme.palette.primary.main, 0.03);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              博客
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 2.8 }}>
            探索技术文章与设计思考
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: "10px",
              px: 1,
              py: 0.5,
              border: "1px solid",
              borderColor: theme.palette.divider,
              color: "text.disabled",
              "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.25),
              },
            },
          }}
        >
          <ToggleButton value="list" aria-label="list">
            <ViewList fontSize="small" />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid">
            <GridView fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ── Search Bar ── */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索文章..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: alpha(
              theme.palette.primary.main,
              isDarkMode ? 0.04 : 0.03,
            ),
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* ── Category Tabs ── */}
      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          minHeight: 40,
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "8px 8px 0 0",
            minWidth: "auto",
            px: 2,
            py: 1,
            minHeight: 40,
          },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} value={cat} />
        ))}
      </Tabs>

      {/* ── Tag Chips ── */}
      {availableTags.length > 1 && (
        <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 3.5 }}>
          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setSelectedTag(tag)}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  height: 30,
                  backgroundColor: isSelected
                    ? alpha(theme.palette.secondary.main, 0.15)
                    : alpha(
                        theme.palette.primary.main,
                        isDarkMode ? 0.04 : 0.03,
                      ),
                  color: isSelected
                    ? theme.palette.secondary.main
                    : "text.secondary",
                  border: isSelected
                    ? `1.5px solid ${alpha(theme.palette.secondary.main, 0.35)}`
                    : `1px solid ${theme.palette.divider}`,
                  "& .MuiChip-label": { px: 1 },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* ── Content ── */}
      {filteredPosts.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            borderRadius: "20px",
            bgcolor: surfaceContainer,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No posts found
          </Typography>
        </Box>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: surfaceContainer,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: isDarkMode
                    ? "0 1px 3px rgba(0,0,0,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MD3ECard
                      post={post}
                      onSelectPost={onSelectPost}
                      variant="list"
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: gridColumns,
                  gap: 2.5,
                }}
              >
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MD3ECard
                      post={post}
                      onSelectPost={onSelectPost}
                      variant="grid"
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Container>
  );
}
