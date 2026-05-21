import fm from "front-matter";

import galleryData from "../../../public/gallery/.gallery.json";
import { BlogPost, GalleryImage } from "../types/blog";

interface GalleryJsonItem {
  filename: string;
  title?: string;
  description?: string;
  category?: string;
  size?: number;
  url?: string;
  createdAt?: string;
}

// 2. 为了提高查找性能，将 JSON 数组转换为以 filename 为 Key 的 Map 映射结构
const presetDataMap: Record<string, GalleryJsonItem> = {};
if (Array.isArray(galleryData)) {
  galleryData.forEach((item: GalleryJsonItem) => {
    // 如果本地 gallery.json 存在重复的 filename，后面的记录会覆盖前面的（使用最新更新的那条）
    if (item && item.filename) {
      presetDataMap[item.filename] = item;
    }
  });
}

// 1. 批量导入所有 .md 文件原始内容
const modules = import.meta.glob("/public/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const galleryFiles = import.meta.glob("/public/gallery/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export const staticPosts: BlogPost[] = Object.keys(modules)
  .map((path) => {
    let rawContent = modules[path] as string;

    //使用gray-matter解析Frontmatter(data)和正文(content)
    const { attributes, body } = fm<any>(rawContent);
    const data = attributes;

    // 从路径提取文件名作为 ID (例如 ../posts/my-post.md -> my-post)
    const id =
      path.split("/").pop()?.replace(".md", "") || Math.random().toString();

    // 组装需要的格式
    return {
      id,
      title: data.title || "无标题",
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || "",
      content: body, // MD正文部分
      category: data.category || "未分类",
      tags: data.tags || [],
      date:
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0] // 格式化为 2026-05-11
          : String(data.date),
      readTime: data.readTime || "",
      author: {
        name: data.author?.name || data.authorName || "匿名",
        avatar: data.author?.avatar || data.authorAvatar || "",
      },
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); //按日期时间排序

export const galleryImages: GalleryImage[] = Object.keys(galleryFiles).map(
  (path, index) => {
    const filename = path.split("/").pop() || "";
    const viteUrl = galleryFiles[path] as string; //vite处理后的本地路径

    const preset = presetDataMap[filename];

    return {
      id: String(index + 1),
      url: viteUrl,
      title: preset?.title || filename.split(".")[0],
      description: preset?.description || "暂无描述",
      category: preset?.category || "未分类",
    };
  },
);

export function getBlogPosts() {
  if (staticPosts.length > 0) {
    //使用打包的静态内容
    return staticPosts;
  }
  return [];
}
