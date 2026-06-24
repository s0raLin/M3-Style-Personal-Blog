import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  ButtonBase,
} from "@mui/material";
import {
  CalendarToday,
  ViewList,
  GridView,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../../types/blog";
import ImagePlaceholder from "../Common/ImagePlaceholder";
import Hero from "./Hero";

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
  const isDarkMode = theme.palette.mode === "dark";
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const recentPosts = posts.slice(0, 6);
  const totalWords = posts.reduce((sum, p) => sum + (p.content?.length || 0), 0);
  const estimatedReadingWords = Math.round(totalWords / 400);

  const containerBg = isDarkMode
    ? alpha(theme.palette.primary.main, 0.03)
    : alpha(theme.palette.primary.main, 0.02);
  const itemHoverBg = isDarkMode
    ? alpha(theme.palette.primary.main, 0.06)
    : alpha(theme.palette.primary.main, 0.04);

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Hero
        onNavigate={onNavigate}
        posts={posts}
        categories={categories}
        totalReadingMinutes={estimatedReadingWords}
      />

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        {/* ── Header Row ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 4,
                height: 20,
                borderRadius: 2,
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: "1.1rem",
                color: "text.primary",
              }}
            >
              Recent Posts
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: "10px",
                px: 1,
                py: 0.5,
                border: "1px solid",
                borderColor: theme.palette.divider,
                color: "text.disabled",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                },
              },
            }}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewList fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid">
              <GridView fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Box
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  backgroundColor: containerBg,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  boxShadow: isDarkMode
                    ? "0 1px 3px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {recentPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <ButtonBase
                      onClick={() => onSelectPost(post)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2.5,
                        py: 1.8,
                        textAlign: "left",
                        width: "100%",
                        borderBottom:
                          idx < recentPosts.length - 1
                            ? `1px solid ${theme.palette.divider}`
                            : "none",
                        transition: "background-color 0.2s ease",
                        "&:hover": { backgroundColor: itemHoverBg },
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "12px",
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
                        }}
                      >
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={56}
                          category={post.category}
                        />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            lineHeight: 1.4,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.1px",
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ mt: 0.5 }}
                        >
                          <CalendarToday
                            sx={{ fontSize: 12, color: "text.disabled" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              fontWeight: 400,
                            }}
                          >
                            {post.date}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              fontSize: "0.7rem",
                              fontWeight: 400,
                            }}
                          >
                            · {post.readTime}
                          </Typography>
                        </Stack>
                      </Box>

                      {post.category && (
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            height: 24,
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.12 : 0.1),
                            color: theme.palette.primary.main,
                            border: "none",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      )}
                    </ButtonBase>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                {recentPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <ButtonBase
                      onClick={() => onSelectPost(post)}
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        borderRadius: "12px",
                        textAlign: "left",
                        border: "1px solid",
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                        width: "100%",
                        transition: "box-shadow 0.25s ease",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0px 2px 6px 2px rgba(0,0,0,0.3), 0px 1px 2px rgba(0,0,0,0.3)"
                            : "0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <ImagePlaceholder
                          src={post.coverImage}
                          alt={post.title}
                          height={140}
                          category={post.category}
                        />
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            height: 24,
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            backgroundColor: alpha(theme.palette.primary.main, 0.85),
                            color: theme.palette.primary.contrastText,
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </Box>

                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            lineHeight: 1.35,
                            letterSpacing: "0.1px",
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            mb: 0.6,
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.65rem",
                              fontWeight: 400,
                            }}
                          >
                            {post.date}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              fontSize: "0.65rem",
                              fontWeight: 400,
                            }}
                          >
                            · {post.readTime}
                          </Typography>
                        </Stack>
                      </Box>
                    </ButtonBase>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
