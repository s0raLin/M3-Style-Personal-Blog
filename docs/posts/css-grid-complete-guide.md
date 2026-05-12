---
title: CSS Grid 布局完全指南
excerpt: 从基础到高级，全面掌握 CSS Grid 布局系统。
category: 前端开发
tags: [CSS, 布局, Grid]
date: 2026-05-03
readTime: 15 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
coverImage: https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop
---

# CSS Grid 布局完全指南

CSS Grid 是现代网页布局的强大工具。

## 基础网格

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## 命名网格线

```css
.container {
  grid-template-columns: [start] 1fr [middle] 1fr [end];
}
```

## 网格区域

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
```

Grid 让复杂布局变得简单！
