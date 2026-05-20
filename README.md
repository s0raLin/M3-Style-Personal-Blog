# M3 Style Personal Blog

> 基于 Material Design 3 的个人博客系统

---

## 功能特性

### 核心功能

- **M3 动态取色系统** — 基于 `@material/material-color-utilities`，从任意主色调自动生成完整的 M3 配色（primary、secondary、tertiary、surface、background、error 等及其 `on-` 变体）
- **8 种预设主题色 + 自定义 HEX + 图片取色** — 通过右上角调色板面板可一键切换，或从本地上传图片智能提取主色调
- **深色 / 浅色模式** — 基于 LocalForage 持久化选择，刷新不丢失
- **Markdown 文章系统** — 通过 `import.meta.glob` 批量加载 `public/posts/*.md`，解析 front-matter 提取元数据，按日期降序排列
- **Shiki 语法高亮** — 内置 `github-light` / `github-dark` 双主题，支持 Kotlin、Java、TypeScript、JavaScript、TSX 等语言
- **搜索 + 分类 + 标签三级过滤** — 博客列表页同时支持关键字搜索、分类 Tab、标签 Chip 联动筛选
- **图库瀑布流** — 通过 `react-responsive-masonry` 渲染，图片元数据由 `public/gallery/gallery.json` 驱动，支持按分类 Tab 筛选
- **Giscus 评论** — 每篇文章独立 GitHub Discussions 主题，深色 / 浅色自动适配
- **社交分享** — 文章详情页支持分享到 Twitter / Facebook / LinkedIn / 复制链接
- **回到顶部 FAB** — 滚动超过 400px 后自动出现 M3 风格悬浮按钮
- **滚动到顶部** — 路由切换时自动回滚到页面顶部

### M3 设计规范

严格遵循 Material Design 3 规范：

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

| 技术                       | 版本 / 说明                                     |
| -------------------------- | ----------------------------------------------- |
| React                      | 18.x（入口 `src/main.tsx` → `src/app/App.tsx`） |
| TypeScript                 | 严格模式                                        |
| Vite                       | 6.x，构建输出至 `docs/`                         |
| Material-UI                | 7.x（`@mui/material` + `@mui/icons-material`）  |
| Motion                     | 12.x，声明式动画                                |
| React Markdown             | 10.x + `remark-gfm`，渲染 Markdown              |
| Shiki                      | 4.x，语法高亮                                   |
| react-responsive-masonry   | 2.x，图库瀑布流                                 |
| Radix UI                   | 全部 `@radix-ui/react-*` 包，辅助组件           |
| Lucide React               | 0.48.x，图标                                    |
| LocalForage                | 1.10.x，IndexedDB 持久化                        |
| Gray Matter / front-matter | 4.x，解析 Markdown front-matter                 |
| Sonner                     | 2.x，Toast 通知                                 |
| Giscus                     | 3.x，GitHub Discussions 评论                    |
| React Router               | 7.x                                             |
| Tailwind CSS v4            | + `@tailwindcss/vite` 插件                      |
| PostCSS                    | 配置见 `postcss.config.mjs`                     |

### 后端 (可选)

| 技术    | 路径              |
| ------- | ----------------- |
| Express | `server/index.js` |
| multer  | 上传接口          |

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
│   ├── main.tsx                          # 入口
│   ├── app/
│   │   ├── App.tsx                       # 主应用 + 路由 + 主题逻辑
│   │   ├── types/
│   │   │   └── blog.ts                   # BlogPost / GalleryImage / AuthorInfo 类型
│   │   ├── config/
│   │   │   └── siteData.json             # 站点元数据（作者信息、分类、技能、经历、项目）
│   │   ├── components/
│   │   │   ├── Home/Home.tsx             # 首页（精选文章 + 内容索引）
│   │   │   ├── About/About.tsx           # 关于页（作者卡、技能、经历/项目 Tabs）
│   │   │   ├── Blog/BlogList.tsx         # 博客列表（搜索 + 分类 + 标签过滤）
│   │   │   ├── Blog/BlogDetail.tsx       # 博客详情（Shiki 高亮 + Giscus + 分享 + FAB）
│   │   │   ├── Gallery/Gallery.tsx       # 图库（Masonry + 全屏 Dialog）
│   │   │   ├── Layout/AppLayout.tsx      # 布局（AppBar + 侧边栏 Drawer + 深色切换）
│   │   │   ├── Settings/ThemeSettings.tsx # 主题设置面板（右侧 Drawer）
│   │   │   ├── Common/
│   │   │   │   ├── ScrollToTop.tsx       # 路由切换时滚动到顶部
│   │   │   │   └── ImagePlaceholder.tsx  # 封面图占位组件
│   │   │   └── ui/                       # 基于 Radix UI 的自定义 UI 组件（40+ 个）
│   │   │       ├── button.tsx · card.tsx · dialog.tsx · form.tsx · …
│   │   ├── theme/
│   │   │   ├── m3Theme.ts                # 静态 M3 主题（固定主色 #6750A4）
│   │   │   └── dynamicTheme.ts           # 动态 M3 主题（根据 sourceColor 生成全色板）
│   │   └── utils/
│   │       ├── themeGenerator.ts         # generateThemeFromColor / extractColorFromImage / presetColors
│   │       ├── storage.ts                # saveThemeSettings / loadThemeSettings / clearAllData
│   │       └── markdownLoader.ts
│   └── lib/
│       └── blogService.ts                # 静态加载所有文章 + 图库数据（build 时打包）
├── public/
│   ├── posts/                            # markdown 文章（.md）
│   │   ├── 修复Android Studio 内置图标库加载失败.md
│   │   ├── 使用values中的strings.xml统一管理arraylist.md
│   │   ├── libs-versions-toml-bom.md
│   │   ├── jetpack-compose-icons-vs-flutter.md
│   │   ├── Kotlin中缀表达式.md
│   │   └── IP.md
│   └── gallery/                          # 图片 + 元数据 JSON
│       ├── gallery.json                  # 图库元数据（filename / title / description / category）
│       ├── anime.png
│       ├── term.png
│       └── *.jpg
├── admin-src/                            # 后台管理端（独立入口 admin.html）
│   ├── admin-main.tsx
│   ├── AdminApp.tsx
│   └── components/
│       ├── AdminDashboard.tsx
│       └── FileUpload.tsx
├── server/                               # 后端（文章上传 / 管理 API）
│   ├── index.js
│   └── package.json
├── scripts/
│   └── new-blog.ts                       # pnpm new-post 生成文章模板
├── public/                               # Vite 静态资源挂载
├── docs/                                 # 构建输出目录（GitHub Pages 目标）
├── vite.config.ts                        # Vite + React + Tailwind + node polyfills
├── tsconfig.json                         # TS strict，@ 路径别名 -> src/
├── postcss.config.mjs
├── package.json
├── admin.html                            # 后台独立入口 HTML
├── index.html
└── .github/workflows/deploy.yml           # GitHub Actions 构建 + 部署
```

---

## 路由结构

使用 `HashRouter`（GitHub Pages 无需服务器 SPA 配置），路由定义在 `src/app/App.tsx:86-130`：

| 路径        | 组件                               | 说明                                       |
| ----------- | ---------------------------------- | ------------------------------------------ |
| `/`         | `<Navigate to="/home" />`          | 根路径重定向到首页                         |
| `/home`     | `Home`                             | 首页，展示 3 篇精选文章 + 内容索引入口     |
| `/blog`     | `BlogList`                         | 博客列表，支持搜索 / 分类 / 标签过滤       |
| `/blog/:id` | `BlogDetailWrapper` → `BlogDetail` | 博客详情，含 Shiki 高亮、Giscus、分享、FAB |
| `/gallery`  | `Gallery`                          | 图库，Masonry 瀑布流 + 详情 Dialog         |
| `/about`    | `About`                            | 关于页，个人简介 + 技能 + 经历/项目 Tabs   |
| `*`         | `<Navigate to="/home" />`          | 未匹配路由回首页                           |

---

## 使用说明

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 8

### 安装 & 启动

```bash
# 安装依赖（根目录 + server 子目录各执行一次）
pnpm install
pnpm --dir server install

# 同时启动前端开发服务器和后台 API
pnpm dev

# 仅启动前端
pnpm dev:web

# 仅启动后端
pnpm dev:server
```

### 构建

```bash
pnpm build     # 输出到 docs/ 目录
pnpm preview   # 预览生产构建
```

### 创建新文章

```bash
pnpm new-post "我的新文章"
# → 在 public/posts/ 生成 my-new-post.md
```

### 数据库（图库元数据）

图库图片的元数据（标题、描述、分类）维护在 `public/gallery/gallery.json`。
在图片上传时（通过后台 admin.html 或 server API），由后端（`server/index.js`）自动更新该文件。

---

## 代码一致性与已验证项

以下内容均直接与代码对照验证通过：

| 验证项                                                         | 代码来源                                                                               | 状态 |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---- | ------- |
| 8 种预设色含 `#6750A4`                                         | `src/app/utils/themeGenerator.ts:132-141`                                              | ✅   |
| 默认主色 `#6750A4`，深色默认关                                 | `src/app/utils/storage.ts:19-24`                                                       | ✅   |
| LocalForage storeName `settings`                               | `src/app/utils/storage.ts:4-8`                                                         | ✅   |
| 主题保存 key `themeSettings`                                   | `src/app/utils/storage.ts:28`                                                          | ✅   |
| HashRouter 绑定                                                | `src/app/App.tsx:185`                                                                  | ✅   |
| 博客列表 Tag 过滤只显示前 3 个                                 | `src/app/components/Blog/BlogList.tsx:343-356`                                         | ✅   |
| 博客详情 Shiki 高亮用 `github-light/github-dark`               | `src/app/components/Blog/BlogDetail.tsx:68-84`                                         | ✅   |
| Giscus repo `s0raLin/M3-Style-Personal-Blog`                   | `src/app/components/Blog/BlogDetail.tsx:536`                                           | ✅   |
| ez-back FAB 滚动阈值 400px                                     | `src/app/components/Blog/BlogDetail.tsx:147`                                           | ✅   |
| `import.meta.glob` 路径 `public/posts/*.md`                    | `src/lib/blogService.ts:51`                                                            | ✅   |
| `import.meta.glob` 路径 `public/gallery/*.{png,jpg,jpeg,webp}` | `src/lib/blogService.ts:57`                                                            | ✅   |
| 图库元数据来自 `gallery.json`                                  | `src/lib/blogService.ts:3`                                                             | ✅   |
| Markdown 解析库 `front-matter`（`fm`）                         | `src/lib/blogService.ts:67`                                                            | ✅   |
| 文章按日期降序排列                                             | `src/lib/blogService.ts:94`                                                            | ✅   |
| 作者信息源 `siteData.json`                                     | `src/app/config/siteData.json`；`src/app/components/About/About.tsx:29,86`             | ✅   |
| `createDynamicM3Theme` 接收 `DynamicTheme`                     | `src/app/theme/dynamicTheme.ts:4`                                                      | ✅   |
| 按钮圆角 20px / 卡片圆角 12px / Chip 圆角 8px                  | `src/app/theme/m3Theme.ts:179,196-197,206` `src/app/theme/dynamicTheme.ts:126,161,180` | ✅   |
| 字体 `Roboto` + `Noto Sans SC`                                 | `src/app/theme/m3Theme.ts:116`, `dynamicTheme.ts:42`                                   | ✅   |
| pnpm 工作空间根目录 + workspace 声明                           | `pnpm-workspace.yaml`                                                                  | ✅   |
| pnpm 版本范围（workflows 传 `8`；server 有独立指定 `10.33.0`） | `package.json:114-118`、`.github/workflows/deploy.yml:23`、`server/package.json:13`    | ✅   |
| devDependencies / peerDepdencies 声明正确                      | `package.json:85-113`                                                                  | ✅   |
| 构建输出目录 `docs/`                                           | `vite.config.ts:49-51`                                                                 | ✅   |
| GitHub Actions 部署分支 `gh-pages`                             | `.github/workflows/deploy.yml:43`                                                      | ✅   |
| pnpm 版本范围（workflows 传 8，pnpm-workspace.yaml 确定）      | `package.json`                                                                         | ✅   | deleted |

---

## 数据流说明

```
import.meta.glob
   ├─ public/posts/*.md  ──gray-matter(fm)───▶ staticPosts[]               // build 时打包
   └─ public/gallery/*.{png,jpg,jpeg,webp}
         + public/gallery/gallery.json ──▶ galleryImages[]                 // build 时打包

App 启动
   ├─ loadThemeSettings() ── LocalForage ──▶ 恢复 sourceColor / isDarkMode
   ├─ getBlogPosts() ──▶ staticPosts ──▶ getBlogPosts() 返回文章列表
   └─ generateThemeFromColor(sourceColor, isDark)
         ──▶ createDynamicM3Theme() ──▶ ThemeProvider
```

---

## 数据格式

### Markdown Front Matter（Markdown 文章）

```yaml
---
title: 文章标题
excerpt: 文章摘要（显示列表）
category: 分类名
tags: [标签1, 标签2]
date: 2026-05-11 # ISO 日期字符串
readTime: "10 分钟"
coverImage: https://... # 封面图 URL
author: # 可选，空则 fallback 到 front-matter 头部字段
  name: 作者名
  avatar: 头像URL
---
```

> **注意**：`scripts/new-blog.ts` 生成模板时字段为 `authorName` / `authorAvatar`，
> `blogService.ts` 解析时同时兼容 `author.name` / `author.avatar` 与 `authorName` / `authorAvatar`（`blogService.ts:89-90`）。
> 与 README 旧版示例不同，新文章推荐使用 `author.name / author.avatar` 格式。

### gallery.json（图库元数据）

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

---

## 常见问题

### 如何保持主题色修改不丢失？

主题色 + 深色模式already 由 LocalForage 自动持久化，无需额外操作。如需完全重置：

```ts
import { clearAllData } from "@/app/utils/storage";
await clearAllData();
```

### How to deploy to GitHub Pages?

`deploy.yml` 会在每次 push 到 `main` 分支时自动 `pnpm run build`，并将 `docs/` 推至 `gh-pages` 分支。
确保仓库 Settings → Pages → Source 选择 `gh-pages` 分支。

### 文章列表时间格式为何都是 YYYY-MM-DD？

`blogService.ts:84-86` 中，若 front-matter 的 `date` 为 `Date` 对象则调用 `.toISOString().split("T")[0]`，否则 `String(data.date)`。建议 front-matter 中统一使用 `"2026-05-11"` 字符串格式。

---

**提示**：本项目完全开源可定制，可按需修改任意组件、路由或数据加载逻辑。
