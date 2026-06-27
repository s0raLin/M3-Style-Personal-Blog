import localforage from 'localforage';

// 配置 localforage (IndexedDB, 异步)
localforage.config({
  name: 'MaterialBlog',
  storeName: 'settings',
  description: 'Material Design 3 博客系统设置',
});

export interface ThemeSettings {
  sourceColor: string;
  isDarkMode: boolean;
}

export interface BlogSettings {
  themeSettings: ThemeSettings;
}

const DEFAULT_SETTINGS: BlogSettings = {
  themeSettings: {
    sourceColor: '#6750A4',
    isDarkMode: false,
  },
};

const LS_THEME_KEY = 'm3blog_theme';

// ── 同步读写 (localStorage) —— 阻止页面刷新闪烁 ──

export function loadThemeSync(): ThemeSettings {
  try {
    const raw = localStorage.getItem(LS_THEME_KEY);
    if (raw) return JSON.parse(raw) as ThemeSettings;
  } catch {}
  return DEFAULT_SETTINGS.themeSettings;
}

export function saveThemeSync(settings: ThemeSettings): void {
  try {
    localStorage.setItem(LS_THEME_KEY, JSON.stringify(settings));
  } catch {}
}

// ── 异步读写 (localforage) —— 主存储 ──

export async function saveThemeSettings(settings: ThemeSettings): Promise<void> {
  saveThemeSync(settings); // 同时写 localStorage
  try {
    await localforage.setItem('themeSettings', settings);
  } catch (error) {
    console.error('保存主题设置失败:', error);
  }
}

export async function loadThemeSettings(): Promise<ThemeSettings> {
  try {
    const settings = await localforage.getItem<ThemeSettings>('themeSettings');
    return settings || DEFAULT_SETTINGS.themeSettings;
  } catch (error) {
    console.error('加载主题设置失败:', error);
    return DEFAULT_SETTINGS.themeSettings;
  }
}

// export async function saveBlogPost(id: string, content: string): Promise<void> {
//   try {
//     await localforage.setItem(`blog_${id}`, content);
//   } catch (error) {
//     console.error('保存博客文章失败:', error);
//   }
// }

// export async function loadBlogPost(id: string): Promise<string | null> {
//   try {
//     return await localforage.getItem<string>(`blog_${id}`);
//   } catch (error) {
//     console.error('加载博客文章失败:', error);
//     return null;
//   }
// }



export async function clearAllData(): Promise<void> {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('清除数据失败:', error);
  }
}
