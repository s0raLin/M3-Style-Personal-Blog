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

import { BlogPost } from "../../data/blogData";
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          博客文章
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          分享技术见解与设计思考
        </Typography>
      </motion.div>

      {/* 搜索框 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索文章标题、内容或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </motion.div>

      {/* 分类 Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </motion.div>

      {/* M3 风格标签过滤芯片组 (Filter Chips) */}
      {availableTags.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
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
                    borderRadius: "8px",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? (theme.palette.secondary as any).container ||
                        alpha(theme.palette.secondary.main, 0.16)
                      : "transparent",
                    color: isSelected
                      ? (theme.palette.secondary as any).onContainer ||
                        theme.palette.secondary.main
                      : "text.primary",
                    border: isSelected ? "none" : "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? (theme.palette.secondary as any).container ||
                          alpha(theme.palette.secondary.main, 0.24)
                        : "action.hover",
                    },
                  }}
                />
              );
            })}
          </Box>
        </motion.div>
      )}

      {/* 空状态 */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            <Typography variant="h6">没有找到相关文章</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              尝试其他搜索关键词或分类
            </Typography>
          </Box>
        </motion.div>
      ) : (
        /* 文章网格面板 */
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
                  transition={{ duration: 0.3 }}
                  style={{ height: "100%" }}
                >
                  {/* ✨ 完美的 M3 风格卡片外层 */}
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "24px", // M3 容器标准圆角
                      backgroundColor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      boxShadow: "none", // M3 默认去阴影扁平化
                      overflow: "hidden",
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
                      {/* 封面图与悬浮分类标签 */}
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={200}
                          category={post.category}
                        />
                        {/* ✨ 绝对定位的毛玻璃分类标签 */}
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            backdropFilter: "blur(8px)",
                            backgroundColor: isDarkMode
                              ? "rgba(30,30,30,0.75)"
                              : "rgba(255,255,255,0.85)",
                            color: "text.primary",
                            fontWeight: 600,
                            border: "none",
                          }}
                        />
                      </Box>

                      {/* 卡片正文区 */}
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
                            mb: 3,
                            lineHeight: 1.6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        {/* 卡片内部的标签联动组 */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 3,
                          }}
                        >
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止冒泡，不触发卡片跳转
                                setSelectedTag(tag);
                              }}
                              sx={{
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                borderColor: isDarkMode
                                  ? "rgba(255,255,255,0.12)"
                                  : "rgba(0,0,0,0.08)",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.08,
                                  ),
                                  borderColor: theme.palette.primary.main,
                                },
                              }}
                            />
                          ))}
                        </Box>

                        {/* 元数据及作者栏 (底部对齐) */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                            pt: 1.5,
                            borderTop: "1px dashed",
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
                              gap: 2,
                              color: "text.secondary",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday sx={{ fontSize: 13 }} />
                              <Typography variant="caption">
                                {post.date}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <AccessTime sx={{ fontSize: 13 }} />
                              <Typography variant="caption">
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
