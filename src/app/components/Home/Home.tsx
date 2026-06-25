import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  ViewList,
  GridView,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../../types/blog";
import Hero from "./Hero";
import { MD3ECard } from "../Blog/BlogList";

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
  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    try {
      const saved = localStorage.getItem("m3blog_viewMode");
      if (saved === "list" || saved === "grid") return saved;
    } catch {}
    return "grid";
  });

  useEffect(() => {
    try { localStorage.setItem("m3blog_viewMode", viewMode); } catch {}
  }, [viewMode]);

  const recentPosts = posts.slice(0, 6);
  const totalWords = posts.reduce(
    (sum, p) => sum + (p.content?.length || 0),
    0,
  );
  const estimatedReadingWords = Math.round(totalWords / 400);

  const gridColumns = { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" };

  // ── MD3E surface tokens ──
  const surfaceContainer = isDarkMode
    ? alpha(theme.palette.background.paper, 0.45)
    : alpha(theme.palette.primary.main, 0.03);

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Hero
        onNavigate={onNavigate}
        posts={posts}
        categories={categories}
        totalReadingMinutes={estimatedReadingWords}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
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
                height: 24,
                borderRadius: 2,
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: "1.15rem",
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
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: surfaceContainer,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: isDarkMode
                    ? "0 1px 3px rgba(0,0,0,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {recentPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MD3ECard
                      post={post}
                      onSelectPost={onSelectPost}
                      variant="list"
                    />
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
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: gridColumns,
                  gap: 2.5,
                }}
              >
                {recentPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MD3ECard
                      post={post}
                      onSelectPost={onSelectPost}
                      variant="grid"
                    />
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
