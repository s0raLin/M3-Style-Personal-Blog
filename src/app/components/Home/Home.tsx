import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Hero from "./Hero";
import TopicMatrix from "./TopicMatrix";

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectPost: (post: any) => void;
  posts: any[];
  categories: string[];
}

export default function Home({
  onNavigate,
  onSelectPost,
  posts,
  categories,
}: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
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
        <TopicMatrix />
      </Box>
    </Box>
  );
}
