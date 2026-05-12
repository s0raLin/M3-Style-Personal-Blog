import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  hexFromArgb,
  argbFromRgb,
} from '@material/material-color-utilities';

export interface DynamicTheme {
  sourceColor: string;
  scheme: 'light' | 'dark';
  colors: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
  };
}

export function generateThemeFromColor(sourceColor: string, isDark: boolean): DynamicTheme {
  const theme = themeFromSourceColor(argbFromHex(sourceColor));
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  return {
    sourceColor,
    scheme: isDark ? 'dark' : 'light',
    colors: {
      primary: hexFromArgb(scheme.primary),
      onPrimary: hexFromArgb(scheme.onPrimary),
      primaryContainer: hexFromArgb(scheme.primaryContainer),
      onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
      secondary: hexFromArgb(scheme.secondary),
      onSecondary: hexFromArgb(scheme.onSecondary),
      secondaryContainer: hexFromArgb(scheme.secondaryContainer),
      onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
      tertiary: hexFromArgb(scheme.tertiary),
      onTertiary: hexFromArgb(scheme.onTertiary),
      tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
      onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
      error: hexFromArgb(scheme.error),
      onError: hexFromArgb(scheme.onError),
      errorContainer: hexFromArgb(scheme.errorContainer),
      onErrorContainer: hexFromArgb(scheme.onErrorContainer),
      background: hexFromArgb(scheme.background),
      onBackground: hexFromArgb(scheme.onBackground),
      surface: hexFromArgb(scheme.surface),
      onSurface: hexFromArgb(scheme.onSurface),
      surfaceVariant: hexFromArgb(scheme.surfaceVariant),
      onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
      outline: hexFromArgb(scheme.outline),
      outlineVariant: hexFromArgb(scheme.outlineVariant),
      shadow: hexFromArgb(scheme.shadow),
      scrim: hexFromArgb(scheme.scrim),
      inverseSurface: hexFromArgb(scheme.inverseSurface),
      inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
      inversePrimary: hexFromArgb(scheme.inversePrimary),
    },
  };
}

export async function extractColorFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 简单的颜色提取：从图片中心区域采样
      const imageData = ctx.getImageData(
        img.width / 4,
        img.height / 4,
        img.width / 2,
        img.height / 2
      );

      // 计算平均颜色
      let r = 0, g = 0, b = 0;
      const pixels = imageData.data.length / 4;

      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i];
        g += imageData.data[i + 1];
        b += imageData.data[i + 2];
      }

      r = Math.round(r / pixels);
      g = Math.round(g / pixels);
      b = Math.round(b / pixels);

      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      resolve(hex);
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = imageUrl;
  });
}

export const presetColors = [
  { name: 'Material 紫', color: '#6750A4' },
  { name: '天空蓝', color: '#0EA5E9' },
  { name: '翠绿', color: '#10B981' },
  { name: '橙色', color: '#F59E0B' },
  { name: '玫瑰红', color: '#E11D48' },
  { name: '靛青', color: '#6366F1' },
  { name: '青色', color: '#06B6D4' },
  { name: '粉紫', color: '#A855F7' },
];
