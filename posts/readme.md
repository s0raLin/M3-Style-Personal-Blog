# Material Design 3 博客系统使用指南

## 功能特性

### ✨ 核心功能

- **M3 动态取色系统** - 使用 Google 官方的 Material Color Utilities 库，支持从任意颜色生成完整的 M3 配色方案
- **主题自定义** - 8种预设主题色 + 自定义颜色 + 从图片提取颜色
- **深色/浅色模式** - 完整的主题切换支持
- **数据持久化** - 使用 LocalForage 保存主题设置
- **Markdown 支持** - 完整的 MD 渲染，支持 GFM 语法
- **代码高亮** - 多语言代码高亮显示
- **响应式设计** - 适配所有设备尺寸
- **流畅动画** - 基于 Motion 的过渡动画

### 🎨 设计规范

严格遵循 Material Design 3 设计规范：
- 动态色彩系统
- M3 圆角规范（12px）
- M3 阴影效果
- M3 字体规范（Roboto + Noto Sans SC）
- M3 组件样式

## 使用方法

### 1. 主题自定义

点击导航栏右上角的调色板图标打开主题设置面板：

- **切换外观模式**: 深色/浅色模式切换
- **选择预设主题色**: 8种精心设计的配色方案
- **自定义颜色**: 输入6位HEX颜色代码（如 #6750A4）
- **从图片提取**: 上传图片，系统自动提取主色调

### 2. 添加博客文章

#### 方法一：直接修改数据文件

编辑 `src/app/data/blogData.ts`，在 `blogPosts` 数组中添加新文章：

```typescript
{
  id: '7',
  title: '你的文章标题',
  excerpt: '文章摘要',
  coverImage: 'https://example.com/image.jpg', // 可选
  content: `# 文章标题

这里是文章内容，支持完整的 Markdown 语法...
`,
  category: '分类',
  tags: ['标签1', '标签2'],
  date: '2026-05-11',
  readTime: '10 分钟',
  author: {
    name: '作者名',
    avatar: 'https://example.com/avatar.jpg',
  },
}
```

#### 方法二：从 Markdown 文件读取

1. 在 `public/posts/` 目录下创建 `.md` 文件
2. 添加 Front Matter 元数据：

```markdown
---
title: 文章标题
excerpt: 文章摘要
category: 分类
tags: [标签1, 标签2]
date: 2026-05-11
readTime: 10 分钟
author: 作者名
coverImage: https://example.com/image.jpg
---

# 文章内容

这里是正文...
```

3. 使用 `loadMarkdownPost()` 函数加载文章

### 3. 自定义分类

编辑 `src/app/data/blogData.ts` 中的 `categories` 数组：

```typescript
export const categories = ['全部', '设计', '前端开发', '性能优化', '新分类'];
```

### 4. 添加图库图片

编辑 `src/app/data/blogData.ts` 中的 `galleryImages` 数组：

```typescript
{
  id: '7',
  url: 'https://images.unsplash.com/photo-xxx',
  title: '图片标题',
  description: '图片描述',
  category: '分类',
}
```

### 5. 修改个人信息

编辑 `src/app/data/blogData.ts` 中的 `authorInfo` 对象：

```typescript
export const authorInfo = {
  name: '你的名字',
  title: '你的职位',
  avatar: '头像URL',
  bio: '个人简介',
  email: '邮箱',
  location: '位置',
  social: {
    github: 'GitHub链接',
    twitter: 'Twitter链接',
    linkedin: 'LinkedIn链接',
  },
  skills: ['技能1', '技能2', ...],
  experience: [...],
};
```

## 技术栈

- **React 18** - UI 框架
- **Material-UI 7** - 组件库
- **Material Color Utilities** - M3 动态取色
- **Motion** - 动画库
- **React Markdown** - Markdown 渲染
- **React Syntax Highlighter** - 代码高亮
- **LocalForage** - 本地存储
- **Gray Matter** - Markdown Front Matter 解析
- **Tailwind CSS v4** - 样式工具
- **TypeScript** - 类型安全

## 目录结构

```
src/app/
├── components/
│   ├── About/          # 关于页面
│   ├── Blog/           # 博客列表和详情
│   ├── Common/         # 通用组件（图片占位符等）
│   ├── Gallery/        # 图库
│   ├── Home/           # 主页
│   ├── Layout/         # 布局组件
│   └── Settings/       # 主题设置
├── data/               # 数据文件
├── theme/              # 主题配置
├── utils/              # 工具函数
│   ├── themeGenerator.ts   # M3 动态取色
│   ├── storage.ts          # 本地存储
│   └── markdownLoader.ts   # MD 文件加载
└── App.tsx             # 主应用

public/posts/           # Markdown 文章目录
```

## M3 设计规范细节

### 颜色系统

系统会根据你选择的主题色自动生成：
- Primary（主色）
- Secondary（次要色）
- Tertiary（第三色）
- Error（错误色）
- Surface（表面色）
- Background（背景色）
- 以及各自的 Container 和 On- 变体

### 圆角规范

- 按钮: 20px
- 卡片: 12px
- 输入框: 12px
- Chip: 8px

### 字体规范

- Display: 3.5rem - 1.5rem
- Headline: 2.75rem - 1.25rem
- Body: 1rem - 0.875rem
- Label: 0.875rem - 0.75rem

### 动画规范

- 页面过渡: 0.5s
- 悬停效果: 0.3s
- 组件动画: Motion 标准缓动

## 数据持久化

系统使用 LocalForage 自动保存：
- 主题设置（sourceColor, isDarkMode）
- 自动在启动时加载

清除数据：
```typescript
import { clearAllData } from './utils/storage';
await clearAllData();
```

## 开发建议

1. **图片优化**: 使用 WebP 格式，建议尺寸 800x600
2. **性能**: 图片使用 lazy loading
3. **SEO**: 为文章添加有意义的标题和摘要
4. **可访问性**: 保持良好的颜色对比度（M3 自动处理）
5. **代码规范**: 遵循 TypeScript 最佳实践

## 常见问题

### 如何更改默认主题色？

编辑 `src/app/utils/storage.ts` 中的 `DEFAULT_SETTINGS`：

```typescript
const DEFAULT_SETTINGS: BlogSettings = {
  themeSettings: {
    sourceColor: '#你的颜色',
    isDarkMode: false,
  },
};
```

### 如何添加更多预设颜色？

编辑 `src/app/utils/themeGenerator.ts` 中的 `presetColors` 数组。

### 如何自定义动画？

所有动画都使用 Motion，可以在组件中自定义 `variants` 和 `transition`。

---

**提示**: 这是一个完全可定制的博客系统，你可以根据需要修改任何部分！
