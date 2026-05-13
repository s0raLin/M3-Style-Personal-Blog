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
} from "@mui/icons-material";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { BlogPost } from "../../data/blogData";
import { useState } from "react";
import { toast } from "sonner";
import ImagePlaceholder from "../Common/ImagePlaceholder";

import Giscus from "@giscus/react";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function BlogDetail({
  post,
  onBack,
  isDarkMode,
}: BlogDetailProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

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
              <Chip key={tag} label={tag} variant="outlined" size="small" />
            ))}
          </Box>
          <Divider sx={{ mb: 4 }} />
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
              "& code": {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                padding: "2px 6px",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
              "& pre code": {
                backgroundColor: "transparent",
                padding: 0,
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={isDarkMode ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
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

              {/* 可选：添加一个小 Chip 标识当前状态 */}
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
                // 这里的选择器用于微调 Giscus 注入后的 iframe 样式
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
                // 使用更契合 M3 的主题颜色
                theme={isDarkMode ? "dark_dimmed" : "light"}
                lang="zh-CN"
                loading="lazy"
              />
            </Box>
          </Box>
          {/* --- 评论区结束 --- */}
        </Paper>
      </motion.div>
    </Container>
  );
}
