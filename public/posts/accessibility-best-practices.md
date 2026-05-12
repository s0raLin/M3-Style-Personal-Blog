---
title: 无障碍设计最佳实践
excerpt: 创建包容性的 Web 体验，让每个人都能访问你的网站。
category: 设计
tags: [无障碍, A11y, 用户体验]
date: 2026-04-28
readTime: 9 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
coverImage: https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop
---

# 无障碍设计最佳实践

无障碍设计不是可选项，而是必需品。

## ARIA 属性

```html
<button
  aria-label="关闭对话框"
  aria-pressed="false"
>
  <CloseIcon />
</button>
```

## 键盘导航

确保所有交互元素都可以通过键盘访问。

```javascript
const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};
```

## 色彩对比

确保文本和背景之间有足够的对比度：
- 正常文本: 至少 4.5:1
- 大文本: 至少 3:1

让 Web 对每个人都友好！
