---
title: Jetpack Compose 中使用图标：与 Flutter 的对比及完整解决方案
excerpt: 对比 Flutter 内置图标的便利性，深入讲解 Android Compose 中引入 material-icons-extended 的完整步骤
category: 编程
tags: [Android]
date: 2026-05-10
readTime: 6 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
---

# Jetpack Compose 中使用图标：与 Flutter 的对比及完整解决方案

如果你有 Flutter 开发经验，第一次切换到 Jetpack Compose 时，很可能会卡在一个让人迷惑的问题上——明明想写一个图标，IDE 却提示根本找不到 `Icons` 这个东西。

本文将从 Flutter 与 Compose 的横向对比出发，帮你彻底搞清楚 Android 端的图标体系，并给出完整的解决方案。

---

## Flutter vs Compose：图标体系的差异

### Flutter：开箱即用

在 Flutter 中，使用 Material 图标极其简单，框架本身已经内置了完整的图标支持：

```dart
// Flutter 中直接使用，无需任何额外依赖
import 'package:flutter/material.dart';

Icon(Icons.settings)
Icon(Icons.home)
Icon(Icons.favorite)
```

`Icons` 类是 Flutter SDK 的一部分，**无需安装任何额外依赖**，`pubspec.yaml` 里也不需要加任何东西，直接 import `flutter/material.dart` 就能用全部图标。

---

### Jetpack Compose：需要手动引入

Compose 的情况则完全不同。`Icons` **并不是 Kotlin 语言或 Android SDK 的内置类**，它属于 Jetpack Compose 的 Material 组件库，必须作为独立依赖引入才能使用。

更重要的是，即便你已经引入了基础的 Compose 依赖，能用的图标也极其有限——Compose 将图标库拆分为两个包：

| 包名 | 内容 | 是否需要额外引入 |
|---|---|---|
| `material-icons-core` | 少量核心图标（返回、关闭、搜索等约 30 个） | 通常随其他依赖自动引入 |
| `material-icons-extended` | 完整图标库（1000+ 个图标） | **必须手动添加** |

所以，如果你发现 `Icons.Default.Settings`、`Icons.Default.Home` 等无法使用，根本原因是 **`material-icons-extended` 这个依赖还没有加进来**。

> 💡 **为什么要拆分？**
>
> `material-icons-extended` 体积庞大，若默认打包会让 APK 白白增大几兆。不过 Android 的 **R8 / ProGuard** 会在构建 Release 包时自动进行 **Tree Shaking（摇树优化）**，只将代码中实际用到的图标打进 APK，其余全部剔除。所以引入完整库并不会影响最终的发布体积。

---

## 完整解决步骤

### 第一步：添加依赖

打开模块级别的 `app/build.gradle.kts`，根据项目依赖管理方式选择写法。

#### 写法 A：Version Catalog（推荐）

如果项目使用 `libs.versions.toml` 管理依赖，分两处修改：

**① 打开 `gradle/libs.versions.toml`，在 `[libraries]` 节点下添加：**

```toml
[libraries]
# 添加下面这行
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
```

**② 打开 `app/build.gradle.kts`，在 `dependencies` 中引入：**

```kotlin
dependencies {
    // ... 其他依赖
    implementation(libs.androidx.compose.material.icons.extended)
}
```

---

#### 写法 B：传统硬编码字符串写法

直接在 `app/build.gradle.kts` 的 `dependencies` 中添加：

```kotlin
dependencies {
    // ... 其他依赖
    implementation("androidx.compose.material:material-icons-extended")
}
```

> ⚠️ 添加完毕后，点击 Android Studio 右上角的 **"Sync Now"** 按钮，等待 Gradle 同步完成。

---

### 第二步：添加 Import

依赖同步完成后，在使用图标的文件顶部添加 import。你可以手动添加，也可以将光标放在 `Icons` 上按 `Alt + Enter`（Mac 为 `Option + Return`）触发自动导包：

```kotlin
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Favorite
```

---

### 第三步：在代码中使用

```kotlin
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton

@Composable
fun MyTopBar() {
    IconButton(onClick = { /* 处理点击 */ }) {
        Icon(
            imageVector = Icons.Default.Home,
            contentDescription = "主页"
        )
    }
    IconButton(onClick = { /* 处理点击 */ }) {
        Icon(
            imageVector = Icons.Default.Settings,
            contentDescription = "设置"
        )
    }
}
```

---

## 如果你在使用 Material 3（M3）

在 M3 项目中有一点值得注意：**图标库（`Icons`）依然属于 `material` 命名空间，而不是 `material3`**，但两者完全兼容，混用没有任何问题。

```kotlin
import androidx.compose.material3.Icon        // ✅ M3 的 Icon 组件
import androidx.compose.material.icons.Icons  // ✅ 图标向量依然从这里取
import androidx.compose.material.icons.filled.Home

Icon(
    imageVector = Icons.Default.Home,
    contentDescription = "主页"
)
```

这和 Flutter 中 `Icon(Icons.home)` 的写法虽然形似，但底层机制截然不同——Flutter 的 `Icons` 是常量类，Compose 的 `Icons` 是需要独立引入的库。

---

## 横向对比总结

| 对比维度 | Flutter | Jetpack Compose |
|---|---|---|
| 图标类名 | `Icons`（SDK 内置） | `Icons`（需引入依赖） |
| 完整图标是否开箱可用 | ✅ 是 | ❌ 否，需添加 `material-icons-extended` |
| 引入方式 | 无需操作 | 添加 Gradle 依赖 + Sync |
| 图标命名风格 | `Icons.settings`（小驼峰） | `Icons.Default.Settings`（大驼峰） |
| APK 体积影响 | 框架内置，按需编译 | R8 Tree Shaking 自动优化 |
| 与 UI 框架的关系 | 与 Material 组件同一包 | 图标库与 M3 组件库分属不同命名空间 |

---

## 一句话总结

> 在 Compose 里，`Icons` 不是内置的，必须手动加 `material-icons-extended` 依赖，同步 Gradle 后才能正常使用。

如果你是从 Flutter 转过来的，记住这一点就能避免大多数困惑。有问题欢迎在评论区留言！
