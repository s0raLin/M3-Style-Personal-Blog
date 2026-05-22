---
title: css-flex-layout-guide
excerpt: ''
category: 前端
tags:
  - html
  - css
date: '2026-05-22'
readTime: 3分钟
coverImage: ''
author:
  name: 蒼璃
  avatar: ''
---

# CSS Flex 布局完全指南

> 从图片对齐到两端分布，彻底搞懂 Flex 布局的核心用法

---

## 一、`<img>` 与 Flex 布局

`<img>` 标签完全可以配合 Flex 使用，分两种角色：

**作为 Flex 容器**（少见）：直接在 `img` 上设置 `display: flex`，配合伪元素叠加遮罩或播放按钮。

**作为 Flex 项目**（最常见）：放进 Flex 父元素中，实现图文混排、垂直居中等效果。

```css
.card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card img {
  flex-shrink: 0;      /* 防止图片被挤压变形 */
  width: 60px;
  height: 60px;
  object-fit: cover;
}
```

> ⚠️ 关键：给图片加 `flex-shrink: 0`，防止空间不足时变形；配合 `object-fit: cover` 保持比例。

---

## 二、设置图片宽高的三种方式

| 场景 | 推荐写法 |
|------|----------|
| 头像 / 固定图标 | CSS 固定宽高 + `object-fit: cover` |
| 文章插图 / Banner | `width: 100%; height: auto` |
| 性能优化（防抖动） | HTML 写原始宽高，CSS 控制显示尺寸 |

**方式一：CSS 控制（最灵活）**
```css
img {
  width: 300px;
  height: 200px;
  object-fit: cover; /* cover = 填满裁剪；contain = 完整留白 */
}
```

**方式二：HTML 属性 + CSS 响应式（性能最优）**
```html
<img src="photo.jpg" width="1200" height="800" alt="">
```
```css
img { width: 100%; height: auto; }
```
浏览器提前按比例占位，避免加载完成后页面突然跳动（CLS 问题）。

**方式三：响应式自适应**
```css
.responsive-img {
  max-width: 100%;
  height: auto;
}
```

---

## 三、垂直对齐的三种场景

### 场景 1：普通文本行内
```css
img { vertical-align: middle; } /* middle / top / bottom */
```
> 消除图片底部莫名空隙用 `vertical-align: bottom`。

### 场景 2：Flex 布局中
```css
/* 统一控制所有子元素 */
.parent { display: flex; align-items: center; }

/* 单独控制图片自己 */
img { align-self: center; }

/* 偷懒写法 */
img { margin-top: auto; margin-bottom: auto; }
```

### 场景 3：Grid 布局中
```css
.grid-parent { display: grid; align-items: center; }
img { align-self: center; }
```

---

## 四、CSS 里的 SizedBox（间距占位）

从 Flutter 迁移过来？三种替代方案：

**方案一：空 div 占位（最接近 SizedBox）**
```css
.gap { height: 16px; }
```

**方案二：`gap` 属性（最推荐 ✅）**
```css
.container {
  display: flex;
  flex-direction: column;
  gap: 16px; /* 子元素间自动隔开，首尾无多余间距 */
}
```

**方案三：限制子元素宽高（等同 SizedBox 包裹子组件）**
```css
img {
  width: 200px;
  height: 100px;
  object-fit: cover; /* 相当于 BoxFit.cover */
}
```

---

## 五、两端对齐的实现方式

实现左右两端分布，**Flex 是首选**：

```css
.title {
  display: flex;
  justify-content: space-between; /* 两端对齐核心 */
  align-items: center;
  padding: 10px 15px;
}
```

其他方案对比：

| 方法 | 缺点 | 推荐度 |
|------|------|--------|
| `float` | 父元素高度塌陷，需手动清除浮动 | ❌ 已淘汰 |
| `position: absolute` | 元素互不感知，长文本会重叠 | ⚠️ 维护成本高 |
| `display: grid` + `1fr auto` | 无明显缺点 | ✅ 可用 |
| `display: flex` + `space-between` | 无副作用 | ✅✅ 首选 |

---

## 六、`display: flex` 不会被子元素继承

> "父变 Flex，子变项目（Item）"——但不会再往下传。

```html
<div class="father" style="display: flex;">  <!-- Flex 容器 -->
  <div class="son">                           <!-- Flex 项目，内部仍是普通布局 -->
    <span>孙子辈</span>                       <!-- 完全不受影响 -->
  </div>
</div>
```

如需多层 Flex，必须逐层显式声明。

> 📝 CSS 中只有 `color`、`font-size` 等文本属性会继承，`display`、`position`、`margin` 等布局属性**绝不继承**。

---

## 七、Flex 容器 vs Flex 项目的尺寸行为

### 作为 Flex 容器时
- **宽度**：默认占满整行（块级行为）
- **高度**：被内部子元素撑开

### 作为 Flex 项目时
- **主轴（宽度）**：由内容撑开，空间不足时被挤压
- **侧轴（高度）**：默认被强行拉伸至父元素高度（`align-items: stretch`）

**两个救命属性：**
```css
.item {
  flex-shrink: 0; /* 禁止被挤压缩小 */
  flex-grow: 1;   /* 撑满剩余空间 */
}
```

---

## 八、`flex` vs `inline-flex`

| 特性 | `display: flex` | `display: inline-flex` |
|------|----------------|------------------------|
| 对外表现 | 块级，独占一行 | 行内块，可并排 |
| 默认宽度 | 100%（撑满父容器） | 由内容撑开 |
| 换行行为 | 强制前后换行 | 允许左右并排 |
| 对内部子元素 | **完全相同** | **完全相同** |

**选哪个？**
- `flex`（90%）：导航栏、列表、大框架布局
- `inline-flex`（10%）：按钮内图标对齐、标签组件等"小零件"

---

*以上内容整理自 CSS Flex 布局实战问答，适合有 Flutter 背景的开发者快速上手前端布局。*
