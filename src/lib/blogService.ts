import fm from "front-matter";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
}

// 1. 批量导入所有 .md 文件原始内容
const modules = import.meta.glob("../../public/posts/*.md", {
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

const presetData: Record<string, any> = {
  "anime.png": {
    title: "动漫壁纸",
    description: "好看的动漫壁纸",
    category: "壁纸",
  },
  "54b782fe885972003ca2b0e507564c3b3493137316055761.jpg": {
    title: "Второй этаж поражает1",
    description: "Второй этаж поражает",
    category: "「从一个极端走向另一个极端」",
  },

  "83a1395a4fffff5fae0967b3ce8744273493137316055761.jpg": {
    title: "Второй этаж поражает2",
    description: "Второй этаж поражает",
    category: "「从一个极端走向另一个极端」",
  },
  "297bbf4879a480fed54efbc6d9ab27e03493137316055761.jpg": {
    title: "Второй этаж поражает3",
    description: "Второй этаж поражает",
    category: "「从一个极端走向另一个极端」",
  },
  "1634dc90042857abf346b742701cee223493137316055761.jpg": {
    title: "Второй этаж поражает4",
    description: "Второй этаж поражает",
    category: "「从一个极端走向另一个极端」",
  },
};
export const galleryImages: GalleryImage[] = Object.keys(galleryFiles).map(
  (path, index) => {
    const filename = path.split("/").pop() || "";
    const viteUrl = galleryFiles[path] as string; //vite处理后的本地路径

    const preset = presetData[filename];

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
  if (staticPosts.length>0) {
    //使用打包的静态内容
    return staticPosts;
  }
  return [];
}
