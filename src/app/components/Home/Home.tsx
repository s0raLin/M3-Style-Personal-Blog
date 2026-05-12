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

export default function Home({
  onNavigate,
  onSelectPost,
  posts,
  categories,
}: HomeProps) {
  const theme = useTheme();
  const featuredPosts = posts.slice(0, 3);

  // 使用动态 categories，如果没有则使用静态后备
  const displayCategories = categories.length > 0 ? categories : staticCategories;

  const categoryStats = displayCategories
    .filter((c) => c !== "全部")
    .map((category) => ({
      name: category,
      count: posts.filter((p) => p.category === category).length,
      icon:
        category === "设计" ? (
          <Palette />
        ) : category === "前端开发" ? (
          <Code />
        ) : (
          <Speed />
        ),
    }));

  const features = [
    {
      icon: <Article sx={{ fontSize: 40 }} />,
      title: "技术博客",
      description: "深度技术文章与最佳实践",
      color: theme.palette.primary.main,
      onClick: () => onNavigate("blog"),
    },
    {
      icon: <PhotoLibrary sx={{ fontSize: 40 }} />,
      title: "精美图库",
      description: "记录生活中的美好瞬间",
      color: theme.palette.secondary.main,
      onClick: () => onNavigate("gallery"),
    },
    {
      icon: <Person sx={{ fontSize: 40 }} />,
      title: "关于我",
      description: "了解更多个人信息",
      color: theme.palette.error.main,
      onClick: () => onNavigate("about"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    mb: 2,
                    opacity: 0.9,
                    fontWeight: 500,
                    letterSpacing: 2,
                  }}
                >
                  Material Design 3
                </Typography>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    mb: 2,
                  }}
                >
                  欢迎来到我的博客
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  分享技术见解、设计思考与生活感悟
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => onNavigate("blog")}
                      sx={{
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        "&:hover": {
                          backgroundColor: alpha("#ffffff", 0.9),
                        },
                      }}
                    >
                      浏览文章
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => onNavigate("about")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: alpha("#ffffff", 0.1),
                        },
                      }}
                    >
                      关于我
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 250, md: 350 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* 装饰性圆形 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      width: 300,
                      height: 300,
                      borderRadius: "40%",
                      background: alpha("#ffffff", 0.1),
                      border: `2px solid ${alpha("#ffffff", 0.2)}`,
                    }}
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      background: alpha("#ffffff", 0.15),
                      border: `2px solid ${alpha("#ffffff", 0.3)}`,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* 背景装饰 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)",
          }}
        />
      </Box>

      {/* 统计卡片 */}
      <Container maxWidth="lg" sx={{ mt: -4, position: "relative", zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={3}>
            {categoryStats.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.name}>
                <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                  <Card
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.paper
                          : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1,
                            ),
                            color: theme.palette.primary.main,
                            display: "flex",
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {stat.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.name}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* 快速导航 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            探索更多
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={feature.onClick}
                >
                  <CardActionArea sx={{ p: 3, height: "100%" }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 热门文章 */}
      <Box sx={{ backgroundColor: theme.palette.background.paper, py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <TrendingUp sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                热门文章
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <Grid container spacing={3}>
              {featuredPosts.map((post, _) => (
                <Grid size={{ xs: 12, md: 4 }} key={post.id}>
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
                        onClick={() => {
                          onSelectPost(post);
                          onNavigate("blog");
                        }}
                        sx={{ flexGrow: 1 }}
                      >
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={200}
                          category={post.category}
                        />
                        <CardContent>
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
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {post.author.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              • {post.readTime}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => onNavigate("blog")}
                sx={{ px: 4 }}
              >
                查看所有文章
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
