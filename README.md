# M3 Style Personal Blog

> 基于 Material Design 3 的个人博客系统，支持动态取色、Markdown 文章管理与图库展示。

---

## 目录

- [功能概览](#功能概览)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [路由结构](#路由结构)
- [快速开始](#快速开始)
- [数据格式](#数据格式)
- [数据流](#数据流)
- [常见问题](#常见问题)

---

## 功能概览

### 主题系统

基于 `@material/material-color-utilities`，从任意主色调自动生成完整 M3 配色方案（primary、secondary、tertiary、surface、background、error 及其 `on-` 变体）。

- **8 种预设主题色 + 自定义 HEX 输入 + 图片智能取色**：通过右上角调色板面板切换
- **深色 / 浅色模式**：基于 LocalForage 持久化，刷新不丢失

### 内容系统

- **Markdown 文章**：通过 `import.meta.glob` 批量加载 `public/posts/*.md`，解析 front-matter，按日期降序排列
- **Shiki 语法高亮**：内置 `github-light` / `github-dark` 双主题，支持 Kotlin、Java、TypeScript、JavaScript、TSX 等语言
- **三级过滤**：关键字搜索 + 分类 Tab + 标签 Chip 联动筛选

### 展示与互动

- **图库瀑布流**：`react-responsive-masonry` 渲染，元数据由 `public/gallery/gallery.json` 驱动，支持分类 Tab 筛选
- **Giscus 评论**：每篇文章独立 GitHub Discussions 主题，自动适配深色 / 浅色
- **社交分享**：支持分享到 Twitter / Facebook / LinkedIn / 复制链接
- **回到顶部 FAB**：滚动超过 400px 自动显示 M3 风格悬浮按钮
- **路由跳转回顶**：切换页面时自动滚动至顶部

### M3 设计规范

| 规范项     | 值                    |
| ---------- | --------------------- |
| 按钮圆角   | 20px                  |
| 卡片圆角   | 12px                  |
| 输入框圆角 | 12px                  |
| Chip 圆角  | 8px                   |
| 主题字体   | Roboto + Noto Sans SC |
| 动画库     | Motion                |

---

## 技术栈

### 前端

| 技术                     | 版本 / 说明                                     |
| ------------------------ | ----------------------------------------------- |
| React                    | 18.x（入口 `src/main.tsx` → `src/app/App.tsx`） |
| TypeScript               | 严格模式                                        |
| Vite                     | 6.x，构建输出至 `docs/`                         |
| Material-UI              | 7.x（`@mui/material` + `@mui/icons-material`）  |
| Motion                   | 12.x，声明式动画                                |
| React Markdown           | 10.x + `remark-gfm`                             |
| Shiki                    | 4.x，语法高亮                                   |
| react-responsive-masonry | 2.x，图库瀑布流                                 |
| Radix UI                 | 全部 `@radix-ui/react-*` 包                     |
| Lucide React             | 0.48.x，图标库                                  |
| LocalForage              | 1.10.x，IndexedDB 持久化                        |
| front-matter             | 4.x，解析 Markdown front-matter                 |
| Sonner                   | 2.x，Toast 通知                                 |
| Giscus                   | 3.x，GitHub Discussions 评论                    |
| React Router             | 7.x                                             |
| Tailwind CSS             | v4 + `@tailwindcss/vite` 插件                   |

### 后端（可选）

| 技术    | 路径              |
| ------- | ----------------- |
| Express | `server/index.js` |
| multer  | 文件上传接口      |

### 部署

| 平台           | 配置                             |
| -------------- | -------------------------------- |
| GitHub Pages   | `docs/` 目录推至 `gh-pages` 分支 |
| GitHub Actions | `.github/workflows/deploy.yml`   |

---

## 目录结构

```
.
├── src/
│   ├── main.tsx                           # 入口
│   ├── app/
│   │   ├── App.tsx                        # 主应用 + 路由 + 主题逻辑
│   │   ├── types/
│   │   │   └── blog.ts                    # BlogPost / GalleryImage / AuthorInfo 类型定义
│   │   ├── config/
│   │   │   └── siteData.json              # 站点元数据（作者、分类、技能、经历、项目）
│   │   ├── components/
│   │   │   ├── Home/Home.tsx              # 首页（精选文章 + 内容索引）
│   │   │   ├── About/About.tsx            # 关于页（作者卡、技能、经历/项目 Tabs）
│   │   │   ├── Blog/BlogList.tsx          # 博客列表（搜索 + 分类 + 标签过滤）
│   │   │   ├── Blog/BlogDetail.tsx        # 博客详情（Shiki + Giscus + 分享 + FAB）
│   │   │   ├── Gallery/Gallery.tsx        # 图库（Masonry + 全屏 Dialog）
│   │   │   ├── Layout/AppLayout.tsx       # 布局（AppBar + 侧边栏 Drawer + 深色切换）
│   │   │   ├── Settings/ThemeSettings.tsx # 主题设置面板（右侧 Drawer）
│   │   │   ├── Common/
│   │   │   │   ├── ScrollToTop.tsx        # 路由切换时滚动到顶部
│   │   │   │   └── ImagePlaceholder.tsx   # 封面图占位组件
│   │   │   └── ui/                        # 基于 Radix UI 的自定义组件（40+ 个）
│   │   ├── theme/
│   │   │   ├── m3Theme.ts                 # 静态 M3 主题（固定主色 #6750A4）
│   │   │   └── dynamicTheme.ts            # 动态 M3 主题（根据 sourceColor 生成全色板）
│   │   └── utils/
│   │       ├── themeGenerator.ts          # generateThemeFromColor / extractColorFromImage / presetColors
│   │       ├── storage.ts                 # saveThemeSettings / loadThemeSettings / clearAllData
│   │       └── markdownLoader.ts
│   └── lib/
│       └── blogService.ts                 # 静态加载文章 + 图库数据（build 时打包）
├── public/
│   ├── posts/                             # Markdown 文章（.md）
│   └── gallery/                           # 图片资源 + gallery.json 元数据
├── admin-src/                             # 后台管理端（独立入口 admin.html）
│   ├── admin-main.tsx
│   ├── AdminApp.tsx
│   └── components/
│       ├── AdminDashboard.tsx
│       └── FileUpload.tsx
├── server/                                # 后端（文章上传 / 管理 API）
│   ├── index.js
│   └── package.json
├── scripts/
│   └── new-blog.ts                        # pnpm new-post 生成文章模板
├── docs/                                  # 构建输出（GitHub Pages 目标目录）
├── vite.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
├── admin.html                             # 后台独立入口
├── index.html
└── .github/workflows/deploy.yml          # 自动构建 + 部署
```

---

## 路由结构

使用 `HashRouter`（GitHub Pages 无需服务器端 SPA 配置），路由定义在 `src/app/App.tsx`。

| 路径        | 组件                               | 说明                                   |
| ----------- | ---------------------------------- | -------------------------------------- |
| `/`         | `<Navigate to="/home" />`          | 根路径重定向到首页                     |
| `/home`     | `Home`                             | 首页，展示 3 篇精选文章 + 内容索引入口 |
| `/blog`     | `BlogList`                         | 博客列表，支持搜索 / 分类 / 标签过滤   |
| `/blog/:id` | `BlogDetailWrapper` → `BlogDetail` | 博客详情，含高亮、评论、分享、FAB      |
| `/gallery`  | `Gallery`                          | 图库，Masonry 瀑布流 + 详情 Dialog     |
| `/about`    | `About`                            | 关于页，个人简介 + 技能 + 经历/项目    |
| `*`         | `<Navigate to="/home" />`          | 未匹配路由回首页                       |

---

## 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 8

### 安装与启动

```bash
# 安装依赖（根目录 + server 子目录）
pnpm install
pnpm --dir server install

# 同时启动前端开发服务器和后台 API
pnpm dev

# 仅启动前端
pnpm dev:web

# 仅启动后端
pnpm dev:server
```

### 构建与预览

```bash
pnpm build     # 输出到 docs/ 目录
pnpm preview   # 预览生产构建
```

### 创建新文章

```bash
pnpm new-post "我的新文章"
# → 在 public/posts/ 生成 my-new-post.md
```

---

## 数据格式

### Markdown Front Matter

```yaml
---
title: 文章标题
excerpt: 文章摘要（显示在列表页）
category: 分类名
tags: [标签1, 标签2]
date: 2026-05-11 # 推荐使用 YYYY-MM-DD 字符串格式
readTime: "10 分钟"
coverImage: https://... # 封面图 URL
author:
  name: 作者名
  avatar: 头像URL
---
```

> `blogService.ts` 同时兼容 `author.name / author.avatar` 与 `authorName / authorAvatar` 两种格式，新文章推荐使用前者。

### gallery.json

```json
[
  {
    "filename": "image.jpg",
    "title": "标题",
    "description": "描述",
    "category": "分类"
  }
]
```

图片上传后，后端（`server/index.js`）会自动更新此文件。

---

## 数据流

```
import.meta.glob
   ├─ public/posts/*.md  ──front-matter──▶ staticPosts[]          // build 时打包
   └─ public/gallery/*.{png,jpg,jpeg,webp}
         + gallery.json  ──────────────▶ galleryImages[]          // build 时打包

App 启动
   ├─ loadThemeSettings()  ── LocalForage ──▶ 恢复 sourceColor / isDarkMode
   ├─ getBlogPosts()        ──────────────▶ staticPosts 文章列表
   └─ generateThemeFromColor(sourceColor, isDark)
         ──▶ createDynamicM3Theme()  ──▶ ThemeProvider
```

---

## 常见问题

**主题色修改后刷新丢失？**

主题色与深色模式已由 LocalForage 自动持久化，无需额外操作。如需完全重置：

```ts
import { clearAllData } from "@/app/utils/storage";
await clearAllData();
```

**如何部署到 GitHub Pages？**

每次推送到 `main` 分支，`deploy.yml` 会自动执行 `pnpm run build` 并将 `docs/` 推至 `gh-pages` 分支。确认仓库 Settings → Pages → Source 选择 `gh-pages` 分支即可。

**文章日期格式要求？**

建议在 front-matter 中统一使用 `"2026-05-11"` 字符串格式。若传入 `Date` 对象，`blogService.ts` 会自动调用 `.toISOString().split("T")[0]` 转换。

---

> 本项目完全开源，可按需修改任意组件、路由或数据加载逻辑。
