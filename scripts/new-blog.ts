import fs from "node:fs";

import path from "node:path";
import process from "node:process";
function main() {
  const args = process.argv;
  if (args.length<4) {
    console.error("参数不够!");
    process.exit(1);
  }
  // 1. 从数组的第 3 个位置开始解构
  // action 对应 argv[2]，title 对应 argv[3]
  const [action, title] = args.slice(2);

  switch (action) {
    case "new":
      if (!title) {
        console.log("请输入文章标题");
        process.exit(1);
      }
      handleCreatePost(title);
      break;
    default:
      break;
  }
}

main();

function handleCreatePost(title: string) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const content = `---
title: ${title}
excerpt:
category:
tags: []
date: ${dateStr}
readTime:
authorName: 蒼璃
authorAvatar: https://avatars.githubusercontent.com/u/174418702?v=4
---

在这里开始编写你的新文章...`;

  const targetDir = path.join(process.cwd(), "public", "posts");
  const filePath = path.join(targetDir, `${title}.md`);

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      console.log("文件已存在,跳过写入!");
      process.exit(1);
    }

    fs.writeFileSync(filePath, content, "utf-8");
    console.log("文件创建成功!");
    process.exit(0);
  } catch (e) {
    console.error("发生错误:", e);
    process.exit(1);
  }
}
