import {
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Button,
  Skeleton,
  Fab, // 引入 M3 核心悬浮按钮
  Zoom, // 引入优雅的缩放渐变
} from "@mui/material";
import {
  ArrowBack,
  Share,
  Facebook,
  Twitter,
  LinkedIn,
  ContentCopy,
  CalendarToday,
  AccessTime,
  KeyboardArrowUp, // 引入向上箭头图标
} from "@mui/icons-material";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "../../types/blog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImagePlaceholder from "../Common/ImagePlaceholder";

import Giscus from "@giscus/react";
// 引入 shiki 的核心单例创建方法
import { createHighlighter } from "shiki";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  isDarkMode: boolean;
}

/**
 * 专为 Shiki 高亮设计的异步渲染微组件
 * 完美支持 Kotlin 且完全杜绝 React-Markdown 的同步流崩溃错误
 */
function ShikiCodeBlock({
  code,
  language,
  isDarkMode,
}: {
  code: string;
  language: string;
  isDarkMode: boolean;
}) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const normalizedLang = language === "kt" ? "kotlin" : language || "plaintext";

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      try {
        const highlighter = await createHighlighter({
          // 修正：使用全量包中绝对存在的标准主题名称
          themes: ["github-light", "github-dark"],
          langs: [
            "kotlin",
            "java",
            "typescript",
            "tsx",
            "javascript",
            "plaintext",
          ],
        });

        if (isMounted) {
          const highlightedHtml = highlighter.codeToHtml(code, {
            lang: normalizedLang,
            // 对应上面注册的主题
            theme: isDarkMode ? "github-dark" : "github-light",
          });
          setHtml(highlightedHtml);
          setLoading(false);
        }
      } catch (error) {
        console.error("Shiki 渲染失败:", error);
        if (isMounted) setLoading(false);
      }
    }

    highlight();
    return () => {
      isMounted = false;
    };
  }, [code, normalizedLang, isDarkMode]);

  if (loading) {
    return (
      <Skeleton
        variant="rounded"
        height={120}
        sx={{
          borderRadius: "12px",
          mb: 2,
          bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        }}
      />
    );
  }

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: html }}
      sx={{
        mb: 2,
        "& pre": {
          padding: "16px",
          borderRadius: "12px",
          overflowX: "auto",
          fontSize: "0.875rem",
          fontFamily: "'Fira Code', Consolas, Monaco, monospace",
          backgroundColor: "transparent !important",
          margin: "0 !important",
        },
      }}
    />
  );
}

export default function BlogDetail({
  post,
  onBack,
  isDarkMode,
}: BlogDetailProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false); // 控制回到顶部按钮显隐

  // 监听页面滚动
  useEffect(() => {
    const handleScroll = () => {
      // 当页面向下滚动超过 400 像素时显示按钮
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 回到顶部的平滑滚动逻辑
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滚动效果
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${post.title} - ${post.excerpt}`;

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("链接已复制到剪贴板");
        setShowShareMenu(false);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconButton onClick={onBack} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
          {post.coverImage && (
            <Box
              sx={{
                mx: -5,
                mt: -5,
                mb: 4,
                borderRadius: "12px 12px 0 0",
                overflow: "hidden",
              }}
            >
              <ImagePlaceholder
                src={post.coverImage}
                alt={post.title}
                height={400}
                category={post.category}
              />
            </Box>
          )}
          <Chip label={post.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            {post.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {post.excerpt}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={post.author.avatar} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {post.author.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 14 }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 14 }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.readTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ position: "relative" }}>
              <IconButton
                color="primary"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share />
              </IconButton>

              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      mt: 1,
                      p: 1,
                      zIndex: 10,
                      minWidth: 200,
                    }}
                  >
                    <Button
                      fullWidth
                      startIcon={<Twitter />}
                      onClick={() => handleShare("twitter")}
                      sx={{ justifyContent: "flex-start", mb: 0.5 }}
                    >
                      分享到 Twitter
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<Facebook />}
                      onClick={() => handleShare("facebook")}
                      sx={{ justifyContent: "flex-start", mb: 0.5 }}
                    >
                      分享到 Facebook
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<LinkedIn />}
                      onClick={() => handleShare("linkedin")}
                      sx={{ justifyContent: "flex-start", mb: 0.5 }}
                    >
                      分享到 LinkedIn
                    </Button>
                    <Divider sx={{ my: 1 }} />
                    <Button
                      fullWidth
                      startIcon={<ContentCopy />}
                      onClick={() => handleShare("copy")}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      复制链接
                    </Button>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  borderRadius: "8px", // M3 规定的标准小组件圆角
                  fontWeight: 500,
                  // 采用类似 M3 Surface Variant / On Surface Variant 的配色
                  bgcolor: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.05)",
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.87)"
                    : "rgba(0, 0, 0, 0.87)",
                  border: "none", // 彻底抛弃边框，告别锯齿
                }}
              />
            ))}
          </Box>
          <Divider sx={{ mb: 4 }} />

          {/* 文章正文包裹容器 */}
          <Box
            sx={{
              "& h1, & h2, & h3": {
                fontWeight: 600,
                mt: 4,
                mb: 2,
              },
              "& p": {
                mb: 2,
                lineHeight: 1.8,
              },
              "& ul, & ol": {
                mb: 2,
                pl: 3,
              },
              "& li": {
                mb: 1,
              },
              "& blockquote": {
                borderLeft: "4px solid",
                borderColor: "primary.main",
                pl: 2,
                py: 1,
                my: 3,
                backgroundColor: isDarkMode
                  ? "rgba(103, 80, 164, 0.1)"
                  : "rgba(103, 80, 164, 0.05)",
                fontStyle: "italic",
              },
              // 仅对行内代码块（`code`）生效的样式
              "& :not(pre) > code": {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                padding: "2px 6px",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  // 如果不是行内代码且匹配到了语言，则转交给安全的 Shiki 渲染块
                  return !inline && match ? (
                    <ShikiCodeBlock
                      code={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      isDarkMode={isDarkMode}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </Box>

          {/* --- M3 评论区开始 --- */}
          <Divider sx={{ my: 6, opacity: 0.5 }} />

          <Box
            component={motion.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{
              position: "relative",
              borderRadius: "28px", // M3 Extra Large Rounding
              overflow: "hidden",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(103, 80, 164, 0.15)",

              // M3 Surface Container styling
              backgroundColor: isDarkMode
                ? "rgba(28, 27, 31, 0.6)" // Surface Container Low
                : "rgba(254, 247, 255, 0.8)", // Surface Container High

              backdropFilter: "blur(12px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

              "&:hover": {
                borderColor: "primary.outline",
                boxShadow: isDarkMode
                  ? "0 8px 32px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(103, 80, 164, 0.08)",
              },
            }}
          >
            {/* 头部装饰条 (Primary Indicator) */}
            <Box
              sx={{
                height: 6,
                width: "40px",
                backgroundColor: "primary.main",
                borderRadius: "0 0 4px 4px",
                mx: "auto",
                mb: -1,
                opacity: 0.8,
              }}
            />

            <Box
              sx={{
                px: { xs: 3, md: 4 },
                pt: 4,
                pb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>💬</span>
                  讨论交流
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mt: 0.5,
                    display: "block",
                    opacity: 0.8,
                  }}
                >
                  Powered by GitHub Discussions
                </Typography>
              </Box>

              <Chip
                label="Open"
                size="small"
                sx={{
                  bgcolor: "success.container",
                  color: "success.onContainer",
                  fontWeight: 600,
                  borderRadius: "8px",
                }}
              />
            </Box>

            <Box
              key={post.title}
              sx={{
                minHeight: 280,
                px: { xs: 2, md: 4 },
                pb: 4,
                "& iframe": {
                  transition: "opacity 0.3s ease",
                },
              }}
            >
              <Giscus
                id="comments"
                repo="s0raLin/M3-Style-Personal-Blog"
                repoId="R_kgDOSa2OCg"
                category="Announcements"
                categoryId="DIC_kwDOSa2OCs4C86-J"
                mapping="specific"
                term={post.title}
                strict="0"
                reactionsEnabled="1"
                emitMetadata="1"
                inputPosition="top"
                theme={isDarkMode ? "dark_dimmed" : "light"}
                lang="zh-CN"
                loading="lazy"
              />
            </Box>
          </Box>
          {/* --- 评论区结束 --- */}
        </Paper>
      </motion.div>

      {/* --- M3 回到顶部悬浮组件开始 --- */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: 24, md: 32 },
            right: { xs: 24, md: 32 },
            borderRadius: "16px", // M3 规范中 Small/Medium FAB 使用的圆角大小
            boxShadow: isDarkMode
              ? "0 4px 12px rgba(0,0,0,0.5)"
              : "0 4px 12px rgba(103, 80, 164, 0.2)",
            // 顺滑的过渡动效
            transition:
              "transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s",
            "&:hover": {
              transform: "scale(1.08)",
            },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
      {/* --- M3 回到顶部悬浮组件结束 --- */}
    </Container>
  );
}
