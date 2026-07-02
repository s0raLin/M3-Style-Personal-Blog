import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { createDynamicM3Theme } from "./theme/dynamicTheme";
import { generateThemeFromColor } from "./utils/themeGenerator";
import { loadThemeSettings, saveThemeSettings, loadThemeSync, saveThemeSync } from "./utils/storage";
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
      posts={posts}
      onBack={() => navigate("/blog")}
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
  // 同步初始化 —— 阻止亮→暗闪烁
  const savedTheme = loadThemeSync();
  const [isDarkMode, setIsDarkMode] = useState(savedTheme.isDarkMode);
  const [sourceColor, setSourceColor] = useState(savedTheme.sourceColor);

  const posts = getBlogPosts();
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(staticPosts.map((post) => post.category)),
    );
    return ["全部", ...uniqueCategories];
  }, [staticPosts]);

  const images = galleryImages;

  // 首次迁移：若 localforage 有数据但 localStorage 为空，则同步到 localStorage
  useEffect(() => {
    loadThemeSettings().then((settings) => {
      const cur = loadThemeSync();
      if (
        cur.isDarkMode === false &&
        cur.sourceColor === "#6750A4" &&
        (settings.isDarkMode !== false || settings.sourceColor !== "#6750A4")
      ) {
        // localforage 中有非默认数据，但 localStorage 中只有默认值 → 迁移
        saveThemeSync(settings);
        setIsDarkMode(settings.isDarkMode);
        setSourceColor(settings.sourceColor);
      }
    });
  }, []);

  useEffect(() => {
    saveThemeSettings({ isDarkMode, sourceColor });
  }, [isDarkMode, sourceColor]);

  // 同步 data-theme-dark 属性 —— 确保切换回浅色模式时移除该属性，避免页面标题等继承 body 灰色
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme-dark', '');
    } else {
      document.documentElement.removeAttribute('data-theme-dark');
    }
  }, [isDarkMode]);

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
