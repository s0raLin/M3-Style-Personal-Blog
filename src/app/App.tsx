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
import { BlogPost } from "./data/blogData";
import { staticPosts, galleryImages, getBlogPosts } from "@/lib/blogService";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import ScrollToTop from "./components/Common/ScrollToTop";

/**
 * Hook to clean up URL after Giscus OAuth redirect.
 * When Giscus redirects back with query params like ?giscus=xxx,
 * we need to remove them while preserving the hash router path.
 */
const useGiscusRedirectCleanup = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasGiscusParam = url.searchParams.has("giscus");

    if (hasGiscusParam) {
      // Remove all query params, keep the hash router path
      const hash = window.location.hash;
      const cleanUrl = hash ? `${window.location.pathname}${hash}` : `${window.location.pathname}`;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Force router to re-evaluate the current hash
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);
};

/**
 * BlogDetailWrapper 的作用：
 * 1. 从 URL 中获取 :id 参数
 * 2. 根据 id 从 posts 列表中查找具体文章数据
 * 3. 渲染 BlogDetail 页面，或者在找不到文章时跳转回列表
 */
const BlogDetailWrapper = ({
  posts,
  isDarkMode,
}: {
  posts: BlogPost[];
  isDarkMode: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 查找对应的文章
  const post = posts.find((p) => p.id === id);

  // 如果 ID 无效或文章不存在，重定向回博客列表
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <BlogDetail
      post={post}
      onBack={() => navigate(-1)} //使用浏览器历史返回
      isDarkMode={isDarkMode}
    />
  );
};

// 创建一个内容包装组件，以便使用 useNavigate
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
  // 控制侧边栏显隐的状态依然留在 AppContent 或 App 中
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);

  // Clean up Giscus OAuth redirect URL
  useGiscusRedirectCleanup();

  return (
    <AppLayout
      // 这里可以根据 location.pathname 来判断当前高亮菜单
      currentPage={location.pathname.split("/")[1] || "home"}
      onNavigate={(page) => navigate(`/${page}`)}
      onThemeToggle={handleThemeToggle}
      isDarkMode={isDarkMode}
      onOpenThemeSettings={() => setThemeSettingsOpen(true)}
    >
      {/* 1. 路由控制的主体内容 */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <Home
              onNavigate={(page) => navigate(`/${page}`)}
              onSelectPost={(post) => navigate(`/blog/${post.id}`)}
              posts={posts}
              categories={categories}
            />
          }
        />
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

      {/* 2. 独立于路由的侧边栏组件 */}
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
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);

  // Load blog post data
  // const { posts, categories, loading, error } = useBlogPosts();
  const posts = getBlogPosts();
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(staticPosts.map((post) => post.category)),
    );
    return ["全部", ...uniqueCategories];
  }, [staticPosts]);

  const images = galleryImages;

  // 加载保存的主题设置
  useEffect(() => {
    loadThemeSettings().then((settings) => {
      setIsDarkMode(settings.isDarkMode);
      setSourceColor(settings.sourceColor);
    });
  }, []);

  // 保存主题设置
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
        <AppContent
          posts={posts}
          categories={categories}
          images={images}
          isDarkMode={isDarkMode}
          themeSettingsOpen={themeSettingsOpen}
          setThemeSettingsOpen={setThemeSettingsOpen}
          sourceColor={sourceColor}
          handleColorChange={handleColorChange}
          handleDarkModeChange={handleDarkModeChange}
          handleThemeToggle={handleThemeToggle}
        />
      </ThemeProvider>
    </HashRouter>
  );
}
