---
title: 在 libs.versions.toml 中优雅管理 Compose 依赖版本
excerpt: 介绍如何使用 BOM 或内联版本号，在 Version Catalog 中更现代地管理 Android Compose 组件依赖
category: 编程
tags: [Android]
date: 2026-05-17
readTime: 4 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
---

# 在 libs.versions.toml 中优雅管理 Compose 依赖版本

在使用 Android 的 Version Catalog（即 `libs.versions.toml`）时，`[versions]` 模块其实并不是必须的。你完全可以把版本号直接写在 `[libraries]` 的声明里。

不过，关于"不知道该用哪个版本"的问题，有一个非常现代且优雅的解决方案。

---

## 解决方案一：完全不定义版本（交给 BOM 管理）

如果你不想在 `.toml` 文件中手动维护各种 Compose 组件（如 Navigation、Material3、Runtime 等）的具体版本号，最推荐的做法是使用 Google 官方的 **Compose BOM（Bill of Materials）**。

BOM 就像一份"版本白皮书"，你只需要指定一个 BOM 的版本，它就会自动帮你匹配所有 Compose 库中最稳定、最兼容的版本组合。

### 在 `libs.versions.toml` 中配置

```toml
[versions]
# 只需要定义一个 BOM 的版本
compose-bom = "2026.02.01"

[libraries]
# 引入 BOM
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "compose-bom" }

# 引入导航库（注意：这里完全不需要写版本号！）
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose" }
```

### 在 `build.gradle.kts` 中使用

```kotlin
dependencies {
    // 1. 先导入 BOM 平台
    implementation(platform(libs.androidx.compose.bom))

    // 2. 直接引入导航，它会自动采用 BOM 里推荐的兼容版本
    implementation(libs.androidx.navigation.compose)
}
```

> **优点**：版本统一管理，避免各组件之间版本不兼容的问题，升级时只需改一个 BOM 版本号。

---

## 解决方案二：不定义 `[versions]`，直接内联版本号

如果你不想用 BOM，也不想在 `[versions]` 里单独维护每个版本引用，可以直接把版本号写在 `[libraries]` 的声明中。

### 简写方式一：完整字符串格式

```toml
[libraries]
androidx-navigation-compose = "androidx.navigation:navigation-compose:2.8.5"
```

### 简写方式二：展开写，但内联版本号

```toml
[libraries]
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version = "2.8.5" }
```

这样 `[versions]` 节点下就不需要任何定义了，结构更加简洁。

---

## 如何查到当前最新的稳定版本？

如果你不确定目前哪个版本号是最新稳定版，可以通过以下几种方式快速获取：

### 方法一：Android Studio 自动提示

在 `build.gradle.kts` 中先随便写一个版本号（比如 `"2.8.0"`），Sync 之后，如果 Android Studio 发现有更新版本，会在版本号下方画出**黄色波浪线**。

此时按下：
- Windows/Linux：`Alt + Enter`
- macOS：`Option + Enter`

即可看到升级到最新稳定版的提示，一键更新。

### 方法二：访问官方发布页

直接访问 Android 开发者官网的版本发布页，页面顶部会始终显示当前的 **Latest Stable（最新稳定版）**：

- Navigation 发布页：[https://developer.android.com/jetpack/androidx/releases/navigation](https://developer.android.com/jetpack/androidx/releases/navigation)
- Compose BOM 发布页：[https://developer.android.com/jetpack/compose/bom/bom-mapping](https://developer.android.com/jetpack/compose/bom/bom-mapping)

---

## 总结对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **BOM 管理** | 使用多个 Compose 组件 | 自动兼容，升级方便 | 需要额外引入 BOM 依赖 |
| **内联版本号** | 依赖少，结构简单 | 直观，无需 `[versions]` | 多个库需各自手动维护版本 |
| **`[versions]` 集中管理** | 版本复用场景 | 统一引用，便于共享 | 需要维护 ref 映射 |

根据项目规模和依赖数量选择最适合你的方式即可。对于 Compose 项目，**推荐优先使用 BOM**，这是 Google 官方推荐的最佳实践。
