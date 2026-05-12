import localforage from 'localforage';

// 配置 localforage
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

export async function saveThemeSettings(settings: ThemeSettings): Promise<void> {
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
