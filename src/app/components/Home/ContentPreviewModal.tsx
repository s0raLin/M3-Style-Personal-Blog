import {
  Dialog,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday,
  Tag as TagIcon,
  Person,
  Email,
  LocationOn,
  GitHub,
  Twitter,
  LinkedIn,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Giscus from "@giscus/react";
import siteData from "../../data/siteData.json";

// Types matching TopicMatrix's ContentItem
interface ContentItem {
  id: string;
  type: "post" | "photo";
  title: string;
  coverImage?: string;
  tags: string[];
  date: string;
  excerpt: string;
  link?: string;
  author?: { name: string; avatar: string };
}

interface ContentPreviewModalProps {
  open: boolean;
  item: ContentItem | null;
  isDarkMode: boolean;
  onClose: () => void;
}

export default function ContentPreviewModal({
  open,
  item,
  isDarkMode,
  onClose,
}: ContentPreviewModalProps) {
  const theme = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const authorInfo = siteData.authorInfo;

  useEffect(() => {
    setShowScrollTop(false);
  }, [item]);

  if (!item) return null;

  const scrollToTop = () => {
    const content = document.getElementById("preview-modal-content");
    content?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 200);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{
        id: "preview-modal-content",
        onScroll: handleScroll,
        sx: {
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "28px",
          backgroundColor: theme.palette.background.default,
          border: "1px solid",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(103,80,164,0.1)",
          boxShadow: isDarkMode
            ? "0 24px 80px rgba(0,0,0,0.6)"
            : "0 24px 80px rgba(103,80,164,0.12)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(12px)",
            backgroundColor: isDarkMode
              ? "rgba(15, 15, 15, 0.75)"
              : "rgba(255, 255, 255, 0.6)",
          },
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ═══ Close Button ═══ */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: isDarkMode
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            color: isDarkMode ? "white" : "inherit",
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(0,0,0,0.7)"
                : "rgba(255,255,255,0.9)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* ═══ Cover Image ═══ */}
        {item.coverImage && (
          <Box
            sx={{
              width: "100%",
              height: { xs: 200, sm: 300 },
              overflow: "hidden",
              borderRadius: "28px 28px 0 0",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={item.coverImage}
              alt={item.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: isDarkMode
                  ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)"
                  : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
              }}
            />
          </Box>
        )}

        {/* ═══ Content ═══ */}
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Type badge */}
          <Chip
            label={item.type === "post" ? "文章" : "摄影"}
            size="small"
            color={item.type === "post" ? "primary" : "secondary"}
            sx={{ mb: 2, borderRadius: "10px", fontWeight: 600 }}
          />

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {item.title}
          </Typography>

          {/* Excerpt */}
          {item.excerpt && (
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 2.5,
                lineHeight: 1.8,
                fontSize: "1.05rem",
              }}
            >
              {item.excerpt}
            </Typography>
          )}

          {/* Meta row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            {item.date && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 15, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {item.date}
                </Typography>
              </Box>
            )}
            {item.author && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={item.author.avatar}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.author.name}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tags */}
          {item.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
              {item.tags.map((tag) => (
                <Chip
                  key={tag}
                  icon={<TagIcon sx={{ fontSize: 14 }} />}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 500,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.12)"
                      : alpha(theme.palette.primary.main, 0.2),
                    color: "text.secondary",
                  }}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ mb: 4, opacity: 0.5 }} />

          {/* ═══ Author Info Section ═══ */}
          <Box
            component={motion.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ mb: 4 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>👤</span>作者信息
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "20px",
                border: "1px solid",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : alpha(theme.palette.primary.main, 0.1),
                backgroundColor: isDarkMode
                  ? "rgba(22,22,28,0.5)"
                  : "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Avatar + Name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <Avatar
                  src={authorInfo.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    border: "3px solid",
                    borderColor: theme.palette.primary.main,
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                  >
                    {authorInfo.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    {authorInfo.title}
                  </Typography>
                </Box>
              </Box>

              {/* Bio */}
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.7,
                  mb: 2.5,
                }}
              >
                {authorInfo.bio}
              </Typography>

              {/* Contact Info */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1, sm: 2 },
                  mb: 2.5,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                >
                  <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {authorInfo.email}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                >
                  <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {authorInfo.location}
                  </Typography>
                </Box>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  component="a"
                  href={authorInfo.social.github}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    color: "text.secondary",
                    "&:hover": { color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <GitHub fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={authorInfo.social.twitter}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    color: "text.secondary",
                    "&:hover": { color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={authorInfo.social.linkedin}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    color: "text.secondary",
                    "&:hover": { color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </Box>

              {/* Skills */}
              {authorInfo.skills.length > 0 && (
                <Box sx={{ mt: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "text.disabled",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    技能
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}
                  >
                    {authorInfo.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 500,
                          fontSize: "0.72rem",
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: "text.secondary",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.12),
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>

          {/* ═══ Comment Section ═══ */}
          <Box
            component={motion.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Divider sx={{ mb: 4, opacity: 0.5 }} />

            <Box
              sx={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : alpha(theme.palette.primary.main, 0.1),
                backgroundColor: isDarkMode
                  ? "rgba(22, 22, 28, 0.65)"
                  : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(20px) saturate(1.8)",
                WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                transition: "all 0.4s cubic-bezier(0.2,0,0,1)",
                "&:hover": {
                  boxShadow: isDarkMode
                    ? "0 8px 40px rgba(0,0,0,0.5)"
                    : `0 8px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
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
                sx={{ minHeight: 280, px: { xs: 2, md: 4 }, pb: 4 }}
              >
                <Giscus
                  id={`home-preview-comments-${item.id}`}
                  repo="s0raLin/M3-Style-Personal-Blog"
                  repoId="R_kgDOSa2OCg"
                  category="Announcements"
                  categoryId="DIC_kwDOSa2OCs4C86-J"
                  mapping="specific"
                  term={item.title}
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
          </Box>
        </Box>
      </motion.div>
    </Dialog>
  );
}
