import { useState, useMemo } from "react";
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
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";

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

  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* ── Header Row ── */}
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.5 }}
          >
            博客
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.04 : 0.03),
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
          "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setSelectedTag(tag)}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  height: 32,
                  backgroundColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.primary.main, isDarkMode ? 0.04 : 0.03),
                  color: isSelected
                    ? theme.palette.primary.main
                    : "text.secondary",
                  border: isSelected
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : `1px solid ${theme.palette.divider}`,
                  "& .MuiChip-label": { px: 1.2 },
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
            borderRadius: "12px",
            bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.04 : 0.03),
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
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Box
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.03 : 0.02),
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: isDarkMode ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ButtonBase
                      onClick={() => onSelectPost(post)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2.5,
                        py: 1.8,
                        textAlign: "left",
                        width: "100%",
                        borderBottom: idx < filteredPosts.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
                        transition: "background-color 0.2s ease",
                        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.06 : 0.04) },
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "12px",
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        }}
                      >
                        <ImagePlaceholder src={post.coverImage} alt={post.title} height={56} category={post.category} />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            lineHeight: 1.4,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.1px",
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 12, color: "text.disabled" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 400 }}>
                            {post.date}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", fontWeight: 400 }}>
                            · {post.readTime}
                          </Typography>
                        </Stack>
                      </Box>

                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          height: 24,
                          borderRadius: "8px",
                          fontWeight: 500,
                          fontSize: "0.65rem",
                          backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.12 : 0.08),
                          color: theme.palette.primary.main,
                          border: "none",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </ButtonBase>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: gridColumns, gap: 2 }}>
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ButtonBase
                      onClick={() => onSelectPost(post)}
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        borderRadius: "12px",
                        textAlign: "left",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                        width: "100%",
                        transition: "box-shadow 0.25s ease",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0px 2px 6px 2px rgba(0,0,0,0.3), 0px 1px 2px rgba(0,0,0,0.3)"
                            : "0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px rgba(0,0,0,0.3)",
                        },
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
                            height: 24,
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            backgroundColor: alpha(theme.palette.primary.main, 0.85),
                            color: theme.palette.primary.contrastText,
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </Box>

                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            lineHeight: 1.35,
                            letterSpacing: "0.1px",
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            mb: 0.5,
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            lineHeight: 1.5,
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            mb: 0.5,
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            pt: 1,
                            borderTop: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                            <Avatar src={post.author.avatar} sx={{ width: 20, height: 20 }} />
                            <Typography variant="caption" sx={{ fontWeight: 500, color: "text.primary", fontSize: "0.7rem" }}>
                              {post.author.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                            <CalendarToday sx={{ fontSize: 10 }} />
                            <Typography variant="caption" sx={{ fontSize: "0.62rem" }}>{post.date}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ButtonBase>
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
