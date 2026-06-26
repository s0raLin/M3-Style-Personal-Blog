import { useRef, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Hero from "./Hero";
import TopicMatrix from "./TopicMatrix";
import ContentPreviewModal from "./ContentPreviewModal";

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectPost: (post: any) => void;
  posts: any[];
  categories: string[];
}

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

export default function Home({
  onNavigate,
  onSelectPost,
  posts,
  categories,
}: HomeProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const heroRef = useRef<HTMLDivElement>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const totalWords = posts.reduce(
    (sum: number, p: any) => sum + (p.content?.length || 0),
    0,
  );
  const estimatedReadingWords = Math.round(totalWords / 400);

  // Expose scroll-to-top for AppLayout logo click
  useEffect(() => {
    (window as any).__scrollToHero = () => {
      heroRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    return () => {
      delete (window as any).__scrollToHero;
    };
  }, []);

  const handleSelectItem = (item: ContentItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewItem(null);
  };

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Box ref={heroRef}>
        <Hero
          onNavigate={onNavigate}
          posts={posts}
          categories={categories}
          totalReadingMinutes={estimatedReadingWords}
        />
      </Box>
      <Box sx={{ maxWidth: "lg", mx: "auto", minHeight: "100vh" }}>
        <TopicMatrix onSelectItem={handleSelectItem} />
      </Box>

      <ContentPreviewModal
        open={previewOpen}
        item={previewItem}
        isDarkMode={isDarkMode}
        onClose={handleClosePreview}
      />
    </Box>
  );
}
