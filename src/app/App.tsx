import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { createDynamicM3Theme } from "./theme/dynamicTheme";
import { generateThemeFromColor } from "./utils/themeGenerator";
import { loadThemeSettings, saveThemeSettings } from "./utils/storage";
import AppLayout from "./components/Layout/AppLayout";
import Home from "./components/Home/Home";
import BlogList from "./components/Blog/BlogList";
import BlogDetail from "./components/Blog/BlogDetail";
import Gallery from "./components/Gallery/Gallery";
import About from "./components/About/About";
import ThemeSettings from "./components/Settings/ThemeSettings";
import { BlogPost } from "./types/blog";
import { AudioProvider } from "./service/AudioContext";
import ScrollToTop from "./components/Common/ScrollToTop";
import {
  staticPosts,
  galleryImages,
  getBlogPosts,
} from "@/app/service/blogService";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

const BlogDetailWrapper = ({
  posts,
  isDarkMode,
}: {
  posts: BlogPost[];
  isDarkMode: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <BlogDetail
      post={post}
      onBack={() => navigate(-1)}
      isDarkMode={isDarkMode}
    />
  );
};

function AppContent({
  posts,
  categories,
  images,
  isDarkMode,
  sourceColor,
  handleColorChange,
  handleDarkModeChange,
  handleThemeToggle,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);

  const pathname = location.pathname;

  return (
    <AppLayout
      currentPage={pathname.startsWith("/blog") ? "blog" : pathname.startsWith("/gallery") ? "gallery" : pathname.startsWith("/about") ? "about" : "home"}
      onNavigate={(page) => {
        if (page === "home") {
          // Scroll to hero if on landing, else navigate
          if (pathname === "/" || pathname === "/home") {
            (window as any).__scrollToHero?.();
            return;
          }
        }
        navigate(`/${page}`);
      }}
      onThemeToggle={handleThemeToggle}
      isDarkMode={isDarkMode}
      onOpenThemeSettings={() => setThemeSettingsOpen(true)}
    >
      <Routes>
        <Route path="/" element={
          <Home
            onNavigate={(page) => navigate(`/${page}`)}
            onSelectPost={(post: BlogPost) => navigate(`/blog/${post.id}`)}
            posts={posts}
            categories={categories}
          />
        } />
        <Route path="/home" element={
          <Home
            onNavigate={(page) => navigate(`/${page}`)}
            onSelectPost={(post: BlogPost) => navigate(`/blog/${post.id}`)}
            posts={posts}
            categories={categories}
          />
        } />
        <Route
          path="/blog"
          element={
            <BlogList
              onSelectPost={(post) => navigate(`/blog/${post.id}`)}
              posts={posts}
              categories={categories}
            />
          }
        />
        <Route
          path="/blog/:id"
          element={<BlogDetailWrapper posts={posts} isDarkMode={isDarkMode} />}
        />
        <Route path="/gallery" element={<Gallery images={images} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <ThemeSettings
        open={themeSettingsOpen}
        onClose={() => setThemeSettingsOpen(false)}
        currentColor={sourceColor}
        onColorChange={handleColorChange}
        isDarkMode={isDarkMode}
        onDarkModeChange={handleDarkModeChange}
      />
    </AppLayout>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sourceColor, setSourceColor] = useState("#6750A4");

  const posts = getBlogPosts();
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(staticPosts.map((post) => post.category)),
    );
    return ["全部", ...uniqueCategories];
  }, [staticPosts]);

  const images = galleryImages;

  useEffect(() => {
    loadThemeSettings().then((settings) => {
      setIsDarkMode(settings.isDarkMode);
      setSourceColor(settings.sourceColor);
    });
  }, []);

  useEffect(() => {
    saveThemeSettings({ isDarkMode, sourceColor });
  }, [isDarkMode, sourceColor]);

  const dynamicTheme = useMemo(
    () => generateThemeFromColor(sourceColor, isDarkMode),
    [sourceColor, isDarkMode],
  );

  const theme = useMemo(
    () => createDynamicM3Theme(dynamicTheme),
    [dynamicTheme],
  );

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleColorChange = (color: string) => {
    setSourceColor(color);
  };

  const handleDarkModeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-center" richColors />
        <AudioProvider>
          <AppContent
            posts={posts}
            categories={categories}
            images={images}
            isDarkMode={isDarkMode}
            sourceColor={sourceColor}
            handleColorChange={handleColorChange}
            handleDarkModeChange={handleDarkModeChange}
            handleThemeToggle={handleThemeToggle}
          />
        </AudioProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
