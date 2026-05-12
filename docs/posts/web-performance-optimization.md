---
title: 现代 Web 性能优化
excerpt: 学习最新的 Web 性能优化技术，让你的网站飞起来。
category: 性能优化
tags: [性能, Web, 优化]
date: 2026-05-01
readTime: 11 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
coverImage: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop
---

# 现代 Web 性能优化

性能优化是现代 Web 开发的关键。

## 核心 Web 指标

- **LCP** (Largest Contentful Paint): 最大内容绘制
- **FID** (First Input Delay): 首次输入延迟
- **CLS** (Cumulative Layout Shift): 累积布局偏移

## 优化策略

### 1. 代码分割

```javascript
const Component = lazy(() => import('./Component'));
```

### 2. 图片优化

```html
<img
  src="image.jpg"
  loading="lazy"
  decoding="async"
/>
```

### 3. 资源预加载

```html
<link rel="preload" href="font.woff2" as="font">
```

让你的网站性能达到最佳！
