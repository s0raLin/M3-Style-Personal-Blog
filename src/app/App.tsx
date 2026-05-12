import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'sonner';
import { createDynamicM3Theme } from './theme/dynamicTheme';
import { generateThemeFromColor } from './utils/themeGenerator';
import { loadThemeSettings, saveThemeSettings } from './utils/storage';
import AppLayout from './components/Layout/AppLayout';
import Home from './components/Home/Home';
import BlogList from './components/Blog/BlogList';
import BlogDetail from './components/Blog/BlogDetail';
import Gallery from './components/Gallery/Gallery';
import About from './components/About/About';
import ThemeSettings from './components/Settings/ThemeSettings';
import { BlogPost } from './data/blogData';
import { staticPosts, galleryImages, getBlogPosts } from '@/lib/blogService';
// import { useBlogPosts } from './hooks/useBlogPosts';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sourceColor, setSourceColor] = useState('#6750A4');
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);

  // 加载博客文章数据
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
    [sourceColor, isDarkMode]
  );

  const theme = useMemo(() => createDynamicM3Theme(dynamicTheme), [dynamicTheme]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'blog') {
      setSelectedPost(null);
    }
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBackToBlogList = () => {
    setSelectedPost(null);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleColorChange = (color: string) => {
    setSourceColor(color);
  };

  const handleDarkModeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const renderContent = () => {
    if (currentPage === 'blog' && selectedPost) {
      return (
        <BlogDetail
          post={selectedPost}
          onBack={handleBackToBlogList}
          isDarkMode={isDarkMode}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onSelectPost={handleSelectPost}
            posts={posts}
            categories={categories}
          />
        );
      case 'blog':
        return (
          <BlogList
            onSelectPost={handleSelectPost}
            posts={posts}
            categories={categories}
          />
        );
      case 'gallery':
        return <Gallery images={images}/>;
      case 'about':
        return <About />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onSelectPost={handleSelectPost}
            posts={posts}
            categories={categories}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors />
      <AppLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        onOpenThemeSettings={() => setThemeSettingsOpen(true)}
      >
        {renderContent()}
      </AppLayout>

      <ThemeSettings
        open={themeSettingsOpen}
        onClose={() => setThemeSettingsOpen(false)}
        currentColor={sourceColor}
        onColorChange={handleColorChange}
        isDarkMode={isDarkMode}
        onDarkModeChange={handleDarkModeChange}
      />
    </ThemeProvider>
  );
}
