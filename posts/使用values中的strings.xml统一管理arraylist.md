---
title: 在res/values/strings.xml中配置并统一管理arrayList
excerpt: 在资源中配置并统一管理arrayList
category: 编程
tags: [Android]
date: 2026-05-10
readTime: 2 分钟
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
---

配置strings.xml

```xml
<resources>
    <string name="app_name">My Application</string>
    <string-array name="list">
        <item>"张三"</item>
        <item>"李四"</item>
    </string-array>
</resources>
```

通过stringArrayResource方法使用

```kotlin
val list: Array<String> = stringArrayResource(id = R.array.list)
```
