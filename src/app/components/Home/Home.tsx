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
  Code,
  Palette,
  Speed,
  Article,
  PhotoLibrary,
  Person,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";
import { galleryImages } from "@/app/service/blogService";

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectPost: (post: BlogPost) => void;
  posts: BlogPost[];
  categories: string[];
}

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

  const featuredPosts = posts.slice(0, 3);

  const features = [
    {
      icon: <Article sx={{ fontSize: 32 }} />,
      title: "技术文章",
      description: "记录开发中的思考、踩坑与实践",
      color: theme.palette.primary.main,
      onClick: () => onNavigate("blog"),
    },
    {
      icon: <PhotoLibrary sx={{ fontSize: 32 }} />,
      title: "视觉影像",
      description: "一些照片、壁纸和随手记录",
      color: theme.palette.secondary.main,
      onClick: () => onNavigate("gallery"),
    },
    {
      icon: <Person sx={{ fontSize: 32 }} />,
      title: "关于作者",
      description: "关于我、我的项目，还有联系方式",
      color: theme.palette.error.main,
      onClick: () => onNavigate("about"),
    },
  ];

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* Hero */}
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
            {/* 左侧 */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
              >
                <Box>
                  <Chip
                    label="Digital Garden"
                    size="small"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: "text.secondary",
                      border: "none",
                    }}
                  />

                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "2.5rem",
                        sm: "3.5rem",
                        md: "4rem",
                      },
                      lineHeight: 1.15,
                      letterSpacing: "-0.03em",
                      mb: 3,
                    }}
                  >
                    写点代码，
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mx: 1,
                      }}
                    >
                      也写点日常
                    </Box>
                  </Typography>

                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      mb: 5,
                      fontWeight: 400,
                      maxWidth: 560,
                      lineHeight: 1.8,
                      fontSize: { xs: "1rem", md: "1.08rem" },
                    }}
                  >
                    Hi，我是 Cangli。
                    这里记录一些开发、设计，还有平时折腾的东西。
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
                        borderRadius: "999px",
                        px: 4,
                        py: 1.6,
                        boxShadow: "none",
                        fontWeight: 600,
                      }}
                    >
                      阅读文章
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
                        borderRadius: "999px",
                        px: 4,
                        py: 1.6,
                        fontWeight: 600,
                        borderWidth: "1px",
                      }}
                    >
                      关于我
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* 右侧装饰 */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box sx={{ position: "relative", width: "100%", height: 400 }}>
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

                <Box
                  component={motion.div}
                  animate={{ rotate: 360, y: [-8, 8, -8] }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
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

      {/* 分类数据 */}
      <Container
        maxWidth="lg"
        sx={{
          mt: -7,
          position: "relative",
          zIndex: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            sx={{
              borderRadius: "32px",
              overflow: "hidden",
              backdropFilter: "blur(24px)",
              background: isDarkMode
                ? "rgba(24,24,28,0.72)"
                : "rgba(255,255,255,0.78)",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.9)",
              boxShadow: isDarkMode
                ? "0 10px 40px rgba(0,0,0,0.35)"
                : "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            <Grid container>
              {[
                {
                  label: "文章",
                  value: posts.length,
                  icon: <Article />,
                },
                {
                  label: "分类",
                  value: categories.filter((c) => c !== "全部").length,
                  icon: <Code />,
                },
                {
                  label: "最近更新",
                  value: "2026",
                  icon: <Speed />,
                },
                {
                  label: "照片",
                  value: galleryImages.length,
                  icon: <PhotoLibrary />,
                },
              ].map((item, index) => (
                <Grid
                  key={item.label}
                  size={{ xs: 6, md: 3 }}
                  sx={{
                    borderRight:
                      index !== 3
                        ? `1px solid ${
                            isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)"
                          }`
                        : "none",
                    borderBottom: {
                      xs:
                        index < 2
                          ? `1px solid ${
                              isDarkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.04)"
                            }`
                          : "none",
                      md: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, md: 4 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08,
                        ),
                        color: "primary.main",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "1.8rem",
                          md: "2.2rem",
                        },
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </motion.div>
      </Container>

      {/* 最新文章 */}
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
                      borderRadius: "24px",
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
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            lineHeight: 1.7,
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
                              sx={{
                                fontWeight: 600,
                                display: "block",
                              }}
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

      {/* 内容索引 */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
  );
}
