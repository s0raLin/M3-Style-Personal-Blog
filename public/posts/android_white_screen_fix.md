# Android Jetpack Compose 白屏问题分析与解决方案

---

## ⚠️ 根本原因

`MainActivity` 的 `setContent {}` 块**为空**，没有渲染任何 Composable 组件。

```kotlin
// ❌ 问题代码：setContent 内容为空
setContent {
    MyApplicationTheme {
        // 空的！没有任何 UI 组件
    }
}
```

`SwitchExample()` 和 `DropdownExample()` 只在 `@Preview` 里被调用，**Preview 仅用于 IDE 预览，不会在真机/模拟器上显示**。

---

## ✅ 解决方案

### 方案一：直接在 setContent 中调用组件（推荐）

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                DropdownExample()   // ← 在这里调用你的 Composable
                // 或者 SwitchExample()
            }
        }
    }
}
```

### 方案二：多个组件组合显示

```kotlin
setContent {
    MyApplicationTheme {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            SwitchExample()
            DropdownExample()
        }
    }
}
```

---

## 🔍 完整修复后的代码

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                DropdownExample()  // ✅ 正确：在此调用 Composable
            }
        }
    }
}
```

---

## 📌 关键知识点

| 概念 | 说明 |
|------|------|
| `setContent {}` | 定义 Activity 的 UI 入口，**必须在此调用 Composable** |
| `@Preview` | 仅供 Android Studio IDE 预览，不参与运行时渲染 |
| `MyApplicationTheme {}` | 只提供主题样式，自身不渲染任何可见内容 |

---

## 🚫 常见误区

> **误以为 `@Preview` 中的内容会在 App 运行时显示。**

`@Preview` 是纯粹的开发工具注解，编译到 APK 后不会自动执行。所有用户可见的 UI，**必须从 `setContent` 开始调用**。
