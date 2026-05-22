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
  Fab,
  Zoom,
  Alert,
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
  KeyboardArrowUp,
  ErrorOutline,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "../../types/blog";
import { useState, useEffect, memo, useMemo } from "react";
import { toast } from "sonner";
import ImagePlaceholder from "../Common/ImagePlaceholder";
import Giscus from "@giscus/react";
import { createHighlighter } from "shiki";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  isDarkMode: boolean;
}

// ─────────────────────────────────────────────
// 1. Shiki 代码块：骨架屏 + 错误回退
// ─────────────────────────────────────────────
const ShikiCodeBlock = memo(
  function ({
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
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    const normalizedLang =
      language === "kt" ? "kotlin" : language || "plaintext";

    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(false);

      async function highlight() {
        try {
          const highlighter = await createHighlighter({
            themes: ["github-light", "github-dark"],
            langs: [
              "kotlin",
              "java",
              "typescript",
              "tsx",
              "javascript",
              "plaintext",
              "xml",
              "rust",
              "scala",
              "go",
              "python",
              "bash",
              "json",
              "css",
              "html",
            ],
          });
          if (isMounted) {
            const highlighted = highlighter.codeToHtml(code, {
              lang: normalizedLang,
              theme: isDarkMode ? "github-dark" : "github-light",
            });
            setHtml(highlighted);
            setLoading(false);
          }
        } catch (err) {
          console.error("Shiki 渲染失败:", err);
          if (isMounted) {
            setError(true);
            setLoading(false);
          }
        }
      }

      highlight();
      return () => {
        isMounted = false;
      };
    }, [code, normalizedLang, isDarkMode]);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // ── 骨架屏 ──
    if (loading) {
      return (
        <Box
          sx={{
            mb: 2,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          }}
        >
          {/* 顶部语言标签骨架 */}
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.03)",
              borderBottom: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Skeleton
              variant="rounded"
              width={60}
              height={20}
              sx={{ borderRadius: "6px" }}
            />
            <Skeleton
              variant="rounded"
              width={28}
              height={28}
              sx={{ borderRadius: "8px" }}
            />
          </Box>
          {/* 代码行骨架 */}
          <Box
            sx={{
              p: 2,
              bgcolor: isDarkMode
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.015)",
            }}
          >
            {[100, 75, 88, 55, 92, 68].map((w, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={`${w}%`}
                height={20}
                sx={{
                  mb: 0.5,
                  borderRadius: "4px",
                  animationDelay: `${i * 0.08}s`,
                  bgcolor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                }}
              />
            ))}
          </Box>
        </Box>
      );
    }

    // ── 渲染失败的 Fallback UI ──
    if (error) {
      return (
        <Box
          sx={{
            mb: 2,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,100,100,0.25)"
              : "rgba(211,47,47,0.15)",
          }}
        >
          {/* 错误顶栏 */}
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: isDarkMode
                ? "rgba(255,100,100,0.08)"
                : "rgba(211,47,47,0.05)",
              borderBottom: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,100,100,0.15)"
                : "rgba(211,47,47,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorOutline
                sx={{ fontSize: 14, color: "error.main", opacity: 0.8 }}
              />
              <Typography
                variant="caption"
                sx={{ color: "error.main", fontWeight: 600, opacity: 0.9 }}
              >
                {normalizedLang}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontSize: "0.7rem" }}
              >
                · 高亮渲染失败
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ borderRadius: "8px" }}
            >
              <CopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          {/* 纯文本降级显示 */}
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              overflowX: "auto",
              fontSize: "0.875rem",
              lineHeight: 1.7,
              fontFamily: "'Fira Code', Consolas, Monaco, monospace",
              bgcolor: isDarkMode
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.02)",
              color: "text.secondary",
              whiteSpace: "pre",
            }}
          >
            {code}
          </Box>
        </Box>
      );
    }

    // ── 正常渲染：带语言标签 + 复制按钮 ──
    return (
      <Box
        sx={{
          mb: 2,
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
          transition: "border-color 0.2s",
          "&:hover": {
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)",
          },
          "&:hover .code-copy-btn": { opacity: 1 },
        }}
      >
        {/* 顶部栏：语言标签 + 复制 */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            borderBottom: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontFamily: "monospace",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "lowercase",
              fontSize: "0.72rem",
            }}
          >
            {normalizedLang}
          </Typography>
          <IconButton
            className="code-copy-btn"
            size="small"
            onClick={handleCopy}
            sx={{
              opacity: 0,
              transition: "opacity 0.15s, background-color 0.15s",
              borderRadius: "8px",
              p: "4px",
              "&:hover": {
                bgcolor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.06)",
              },
            }}
          >
            {copied ? (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  color: "success.main",
                  fontWeight: 700,
                  px: 0.5,
                }}
              >
                已复制
              </Typography>
            ) : (
              <CopyIcon sx={{ fontSize: 13, color: "text.disabled" }} />
            )}
          </IconButton>
        </Box>

        <Box
          dangerouslySetInnerHTML={{ __html: html }}
          sx={{
            "& pre": {
              padding: "16px !important",
              borderRadius: "0 !important",
              overflowX: "auto",
              fontSize: "0.875rem",
              fontFamily: "'Fira Code', Consolas, Monaco, monospace",
              margin: "0 !important",
              lineHeight: "1.7 !important",
            },
          }}
        />
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.code === nextProps.code &&
      prevProps.language === nextProps.language &&
      prevProps.isDarkMode === nextProps.isDarkMode
    );
  },
);

// ─────────────────────────────────────────────
// 3. Markdown 样式增强的主组件
// ─────────────────────────────────────────────
export default function BlogDetail({
  post,
  onBack,
  isDarkMode,
}: BlogDetailProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 2. 使用 useMemo 缓存 components 对象，锁定引用
  const markdownComponents = useMemo(
    () => ({
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");
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
    }),
    [isDarkMode],
  );

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
                  borderRadius: "8px",
                  fontWeight: 500,
                  // ✅ 原来硬编码 rgba(255,255,255,0.08) / rgba(0,0,0,0.05)
                  // 现在改用 action.hover，随主题自动适配
                  bgcolor: "action.hover",
                  color: "text.primary",
                  border: "none",
                }}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* ── 优化后的 Markdown 渲染容器 ── */}
          <Box
            sx={{
              // ── 标题层级 ──
              "& h1": {
                fontSize: "2rem",
                fontWeight: 800,
                mt: 5,
                mb: 2.5,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                color: "text.primary",
              },
              "& h2": {
                fontSize: "1.5rem",
                fontWeight: 700,
                mt: 4.5,
                mb: 2,
                lineHeight: 1.4,
                letterSpacing: "-0.015em",
                paddingBottom: "0.4em",
                borderBottom: "1px solid",
                // ✅ 原 rgba(255,255,255,0.1) / rgba(0,0,0,0.08) → divider
                borderColor: "divider",
              },
              "& h3": {
                fontSize: "1.2rem",
                fontWeight: 700,
                mt: 3.5,
                mb: 1.5,
                lineHeight: 1.5,
                color: "primary.main",
              },
              "& h4": {
                fontSize: "1.05rem",
                fontWeight: 600,
                mt: 2.5,
                mb: 1,
                lineHeight: 1.5,
              },

              // ── 正文 ──
              "& p": {
                mb: 2,
                lineHeight: 1.85,
                fontSize: "1rem",
                color: "text.primary",
              },

              // ── 列表 ──
              "& ul": { mb: 2, pl: 0, listStyle: "none" },
              "& ul li": {
                mb: 0.75,
                pl: "1.5em",
                position: "relative",
                lineHeight: 1.8,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "0.2em",
                  top: "0.65em",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  opacity: 0.7,
                },
              },
              "& ol": { mb: 2, pl: "1.5em" },
              "& ol li": { mb: 0.75, lineHeight: 1.8, pl: "0.4em" },

              // ── 嵌套列表 ──
              "& ul ul, & ol ul": { mt: 0.5, mb: 0 },
              "& ul ul li::before": {
                width: "4px",
                height: "4px",
                opacity: 0.45,
              },

              // ── 引用块 ──
              "& blockquote": {
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 2.5,
                py: 1,
                my: 3,
                mx: 0,
                borderRadius: "0 8px 8px 0",
                // ✅ 原 rgba(103,80,164,0.08/0.04) → 使用 theme callback 读取 primary.main
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? `${theme.palette.primary.main}14` // ~8% opacity
                    : `${theme.palette.primary.main}0a`, // ~4% opacity
                "& p": {
                  mb: 0,
                  fontStyle: "italic",
                  color: "text.secondary",
                  fontSize: "0.97rem",
                },
              },

              // ── 行内代码 ──
              "& :not(pre) > code": {
                // ✅ 原 rgba(255,255,255,0.1) / rgba(103,80,164,0.08) + #e2b1ff / #6750a4
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : `${theme.palette.primary.main}14`,
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                padding: "2px 7px",
                borderRadius: "6px",
                fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                fontSize: "0.875em",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              },

              // ── 表格 ──
              "& table": {
                width: "100%",
                mb: 3,
                borderCollapse: "collapse",
                fontSize: "0.9rem",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid",
                // ✅ 原 rgba(255,255,255,0.1) / rgba(0,0,0,0.08) → divider
                borderColor: "divider",
              },
              "& th": {
                px: 2,
                py: 1.25,
                textAlign: "left",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                // ✅ 原 rgba(103,80,164,0.2/0.07) → theme callback
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? `${theme.palette.primary.main}33` // ~20%
                    : `${theme.palette.primary.main}12`, // ~7%
                color: "primary.main",
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& td": {
                px: 2,
                py: 1.25,
                borderBottom: "1px solid",
                // ✅ 原 rgba(255,255,255,0.06) / rgba(0,0,0,0.05) → divider（透明度更低）
                borderColor: "divider",
                lineHeight: 1.6,
                verticalAlign: "top",
              },
              "& tr:last-child td": { borderBottom: "none" },
              "& tr:hover td": {
                // ✅ 原 rgba(255,255,255,0.03) / rgba(0,0,0,0.02) → action.hover
                backgroundColor: "action.hover",
              },

              // ── 分割线 ──
              "& hr": {
                border: "none",
                borderTop: "1px solid",
                // ✅ divider
                borderColor: "divider",
                my: 4,
              },

              // ── 链接 ──
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 500,
                borderBottom: "1px solid",
                borderColor: "transparent",
                transition: "border-color 0.15s",
                "&:hover": { borderColor: "primary.main" },
              },

              // ── 图片 ──
              "& img": {
                maxWidth: "100%",
                borderRadius: "10px",
                my: 2,
                display: "block",
                mx: "auto",
              },

              // ── 强调 ──
              "& strong": { fontWeight: 700, color: "text.primary" },
              "& em": { fontStyle: "italic", color: "text.secondary" },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </Box>

          {/* 评论区 */}
          <Divider sx={{ my: 6, opacity: 0.5 }} />
          <Box
            component={motion.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid",
              // ✅ 原 rgba(255,255,255,0.1) / rgba(103,80,164,0.15)
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : `${theme.palette.primary.main}26`, // ~15%
              // ✅ 原 rgba(28,27,31,0.6) / rgba(254,247,255,0.8)
              // 这两个是 MD3 surface 色，保留为 background.paper 的半透明版，无法完全泛化，保持原值
              backgroundColor: isDarkMode
                ? "rgba(28,27,31,0.6)"
                : "rgba(254,247,255,0.8)",
              backdropFilter: "blur(12px)",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                // ✅ 原 rgba(0,0,0,0.4) / rgba(103,80,164,0.08) → 用 primary 色
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0,0,0,0.4)"
                    : `0 8px 32px ${theme.palette.primary.main}14`,
              },
            }}
          >
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
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>💬</span>讨论交流
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
              sx={{ minHeight: 280, px: { xs: 2, md: 4 }, pb: 4 }}
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
        </Paper>
      </motion.div>

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
            borderRadius: "16px",
            // 原 rgba(103,80,164,0.2) → theme callback
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0,0,0,0.5)"
                : `0 4px 12px ${theme.palette.primary.main}33`,
            transition:
              "transform 0.2s cubic-bezier(0.2,0,0,1), background-color 0.2s",
            "&:hover": { transform: "scale(1.08)" },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Container>
  );
}
