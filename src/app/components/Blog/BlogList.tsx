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

export default function BlogList({
  onSelectPost,
  posts,
  categories,
}: BlogListProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

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
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "24px",
                      backgroundColor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      boxShadow: "none",
                      overflow: "hidden",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.14)"
                          : alpha(theme.palette.primary.main, 0.2),
                        boxShadow: isDarkMode
                          ? "0 8px 32px rgba(0,0,0,0.35)"
                          : `0 8px 32px ${alpha(theme.palette.primary.main, 0.06)}`,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => onSelectPost(post)}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={200}
                          category={post.category}
                        />
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            backdropFilter: "blur(16px) saturate(1.8)",
                            WebkitBackdropFilter: "blur(16px) saturate(1.8)",
                            backgroundColor: isDarkMode
                              ? "rgba(30,30,35,0.7)"
                              : "rgba(255,255,255,0.8)",
                            color: "text.primary",
                            fontWeight: 600,
                            border: "1px solid",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,255,255,0.6)",
                            borderRadius: "12px",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: 3,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.4,
                            mb: 1.5,
                            color: "text.primary",
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2.5,
                            lineHeight: 1.65,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        {/* Tags */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.75,
                            flexWrap: "wrap",
                            mb: 2.5,
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
                                borderRadius: "7px",
                                fontSize: "0.72rem",
                                fontWeight: 500,
                                borderColor: isDarkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.06)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.08,
                                  ),
                                  borderColor: theme.palette.primary.main,
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          ))}
                        </Box>

                        {/* Author + Meta */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                            pt: 1.5,
                            borderTop: "1px solid",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.04)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.2,
                            }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{ width: 26, height: 26 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {post.author.name}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              color: "text.secondary",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4,
                              }}
                            >
                              <CalendarToday sx={{ fontSize: 12 }} />
                              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                                {post.date}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4,
                              }}
                            >
                              <AccessTime sx={{ fontSize: 12 }} />
                              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
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
