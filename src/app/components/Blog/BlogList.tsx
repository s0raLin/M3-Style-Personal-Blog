import { useState, useMemo } from "react"; // 💡 引入 useMemo 优化性能
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState("全部"); // 💡 新增：选中的标签状态

  // 💡 当分类切换时，自动把选中的标签重置为“全部”
  const handleCategoryChange = (_: any, newValue: string) => {
    setSelectedCategory(newValue);
    setSelectedTag("全部");
  };

  // 💡 动态提取当前分类下所有可用的 Tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      // 如果是“全部”或者分类匹配，就把它的标签加进来
      if (selectedCategory === "全部" || post.category === selectedCategory) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return ["全部", ...Array.from(tagsSet)];
  }, [posts, selectedCategory]);

  // 💡 联动过滤：加入对 selectedTag 的判断
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "全部" || post.category === selectedCategory;

    // 新增：判断文章是否包含选中的标签
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
          onChange={handleCategoryChange} // 💡 使用新处理函数
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2, // 💡 缩短下边距，给下方的 Tags 腾出空间
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </motion.div>

      {/* 💡 新增：M3 风格的标签过滤按钮组 (Filter Chips) */}
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
              // 隐藏滚动条但保持可横向滚动（移动端体验更好）
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
                  // 💡 通过配置 variant 和 color 模拟 Material 3 的 Filter Chip 风格
                  variant={isSelected ? "filled" : "outlined"}
                  color={isSelected ? "secondary" : "default"}
                  sx={{
                    borderRadius: "8px", // M3 偏向于使用圆角矩形而不是完全的椭圆
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "secondary.dark"
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
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">没有找到相关文章</Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
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
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => onSelectPost(post)}
                      sx={{ flexGrow: 1 }}
                    >
                      <ImagePlaceholder
                        src={post.coverImage}
                        alt={post.title}
                        height={200}
                        category={post.category}
                      />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label={post.category}
                          size="small"
                          color="primary"
                          sx={{ mb: 1.5 }}
                        />

                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {post.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 2,
                          }}
                        >
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              // 💡 顺手做个小联动：点击卡片内部的 tag 也能直接触发过滤
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止冒泡，不触发卡片的点击事件
                                setSelectedTag(tag);
                              }}
                            />
                          ))}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{
                                width: 24,
                                height: 24,
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {post.author.name}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday sx={{ fontSize: 14 }} />

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                              <AccessTime sx={{ fontSize: 14 }} />

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
