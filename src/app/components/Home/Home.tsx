import {
  Container,
  Typography,
  Box,
  Button,
  Grid, // 采用 MUI 最新 Grid2 规范，规避老版本断点排版警告
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
  TrendingUp,
  Code,
  Palette,
  Speed,
  Article,
  PhotoLibrary,
  Person,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { BlogPost, categories as staticCategories } from "../../data/blogData";
import ImagePlaceholder from "../Common/ImagePlaceholder";

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectPost: (post: BlogPost) => void;
  posts: BlogPost[];
  categories: string[];
}

// 编排式父容器动画动效 Token
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// 子项出场动画 Token：通过 as const 锁死字面量类型，彻底杜绝通配 string 导致的编译重载崩溃
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function Home({
  onNavigate,
  onSelectPost,
  posts,
  categories,
}: HomeProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 提取最新发布的 3 篇作为聚焦文章
  const featuredPosts = posts.slice(0, 3);
  const displayCategories =
    categories.length > 0 ? categories : staticCategories;

  // 动态分类统计看板数据映射
  const categoryStats = displayCategories
    .filter((c) => c !== "全部")
    .map((category) => ({
      name: category,
      count: posts.filter((p) => p.category === category).length,
      icon:
        category === "设计" ? (
          <Palette sx={{ fontSize: 22 }} />
        ) : category === "前端开发" ? (
          <Code sx={{ fontSize: 22 }} />
        ) : (
          <Speed sx={{ fontSize: 22 }} />
        ),
    }));

  const features = [
    {
      icon: <Article sx={{ fontSize: 32 }} />,
      title: "技术博客",
      description: "探索底层架构、设计模式与工程最佳实践",
      color: theme.palette.primary.main,
      onClick: () => onNavigate("blog"),
    },
    {
      icon: <PhotoLibrary sx={{ fontSize: 32 }} />,
      title: "精美图库",
      description: "用镜头捕捉视觉碎片，记录生活里的黄金时刻",
      color: theme.palette.secondary.main,
      onClick: () => onNavigate("gallery"),
    },
    {
      icon: <Person sx={{ fontSize: 32 }} />,
      title: "关于我",
      description: "关于我的技能栈、演进历程与联系方式",
      color: theme.palette.error.main,
      onClick: () => onNavigate("about"),
    },
  ];

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* 1. M3-Style Hero Section */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 8, md: 14 },
          pb: { xs: 12, md: 18 },
          backgroundColor: isDarkMode
            ? "rgb(20, 19, 23)"
            : "rgb(247, 242, 250)",
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
               radial-gradient(circle at 15% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 40%)`
            : `radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.light, 0.25)} 0%, transparent 50%),
               radial-gradient(circle at 15% 80%, ${alpha(theme.palette.secondary.light, 0.25)} 0%, transparent 40%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              {/* 1. 动效完全由外层的 motion.div 承担，将 cubicBezier 修正为 ease 数组 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }} // ✨ 修正：贝塞尔曲线应作为 ease 传入
              >
                {/* 2. 内部的 Box 不再写 component={motion.div}，只负责 M3 的间距和排版 */}
                <Box>
                  <Chip
                    label="Material 3 Dynamic Express"
                    size="small"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      bgcolor: "primary.container",
                      color: "primary.onContainer",
                      border: "none",
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      mb: 3,
                      color: "text.primary",
                    }}
                  >
                    构造具象的
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mx: 1,
                      }}
                    >
                      数字绿洲
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      mb: 5,
                      fontWeight: 400,
                      maxWidth: 540,
                      lineHeight: 1.6,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    这里是 Cangli
                    的个人站点。凝练后端架构的笃定，探寻前端动效的优雅，顺便用盒式未来的旧滤镜记录日常。
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      component={motion.button}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => onNavigate("blog")}
                      sx={{
                        borderRadius: "100px",
                        px: 4,
                        py: 1.8,
                        boxShadow: "none",
                        fontWeight: 600,
                      }}
                    >
                      探秘文章
                    </Button>
                    <Button
                      component={motion.button}
                      whileHover={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08,
                        ),
                      }}
                      whileTap={{ scale: 0.98 }}
                      variant="outlined"
                      size="large"
                      onClick={() => onNavigate("about")}
                      sx={{
                        borderRadius: "100px",
                        px: 4,
                        py: 1.8,
                        fontWeight: 600,
                        borderWidth: "1px",
                      }}
                    >
                      独白
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* 右侧：M3 异形几何装饰面板 */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box sx={{ position: "relative", width: "100%", height: 400 }}>
                {/* 盒式未来点阵背景 */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    opacity: isDarkMode ? 0.07 : 0.04,
                    backgroundImage:
                      "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    color: "text.primary",
                  }}
                />
                {/* 律动流光体 */}
                <Box
                  component={motion.div}
                  animate={{
                    borderRadius: [
                      "120px 40px 100px 40px",
                      "40px 120px 40px 100px",
                      "120px 40px 100px 40px",
                    ],
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    left: 40,
                    top: 40,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.75)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                    boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
                    backdropFilter: "blur(8px)",
                  }}
                />
                {/* 前置悬浮量子环 */}
                <Box
                  component={motion.div}
                  animate={{ rotate: 360, y: [-8, 8, -8] }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  }}
                  sx={{
                    position: "absolute",
                    width: 140,
                    height: 140,
                    right: 20,
                    bottom: 60,
                    borderRadius: "28px",
                    border: `3px dashed ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. 数据看板 Section (动效剥离重构，规避类型断层) */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 2 }}>
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={3}>
            {categoryStats.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.name}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{ height: "100%" }}
                >
                  <Card
                    sx={{
                      borderRadius: "20px", // M3 Medium-Large Token
                      height: "100%",
                      backgroundColor: isDarkMode
                        ? "rgba(28, 27, 31, 0.9)"
                        : "#ffffff",
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                      boxShadow: isDarkMode
                        ? "0 4px 20px rgba(0,0,0,0.4)"
                        : "0 4px 20px rgba(0,0,0,0.02)",
                    }}
                  >
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: "12px",
                              backgroundColor: "secondary.container",
                              color: "secondary.onContainer",
                              display: "flex",
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "text.secondary" }}
                          >
                            {stat.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            fontFamily: "monospace",
                            letterSpacing: "-1px",
                          }}
                        >
                          {stat.count}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* 3. 聚焦文章 Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: isDarkMode ? "transparent" : "rgb(250, 245, 252)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 4,
                  height: 28,
                  bgcolor: "primary.main",
                  borderRadius: "4px",
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                聚焦内容
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "primary.main",
                cursor: "pointer",
              }}
              onClick={() => onNavigate("blog")}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                全部发布
              </Typography>
              <ArrowForward sx={{ fontSize: 16 }} />
            </Box>
          </Box>

          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid size={{ xs: 12, md: 4 }} key={post.id}>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{ y: -8 }}
                  style={{ height: "100%" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "24px", // M3 Container Standard
                      backgroundColor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      boxShadow: "none",
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
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={220}
                          category={post.category}
                        />
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
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            src={post.author.avatar}
                            sx={{ width: 28, height: 28 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, display: "block" }}
                            >
                              {post.author.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
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

      {/* 4. 多维探索 Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
            多维探索
          </Typography>
          <Typography variant="body1" color="text.secondary">
            横向切片核心模块，直接触达你感兴趣的内容
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                style={{ height: "100%" }}
              >
                <Card
                  onClick={feature.onClick}
                  sx={{
                    height: "100%",
                    borderRadius: "28px", // M3 Extra Large Token
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(103, 80, 164, 0.08)",
                    backgroundColor: isDarkMode
                      ? "rgba(35, 34, 38, 0.4)"
                      : "rgba(254, 247, 255, 0.7)",
                    boxShadow: "none",
                    cursor: "pointer",
                  }}
                >
                  <CardActionArea sx={{ p: 4, height: "100%" }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: alpha(feature.color, 0.12),
                        color: feature.color,
                        mb: 3,
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
                      sx={{ lineHeight: 1.6 }}
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
  );
}
