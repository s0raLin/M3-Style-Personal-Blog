import matter from 'gray-matter';

export interface MarkdownPost {
  slug: string;
  frontMatter: {
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    date: string;
    readTime: string;
    author: string;
    coverImage?: string;
  };
  content: string;
}

export async function loadMarkdownPost(slug: string): Promise<MarkdownPost | null> {
  try {
    const response = await fetch(`/posts/${slug}.md`);
    if (!response.ok) {
      throw new Error('文章未找到');
    }

    const markdown = await response.text();
    const { data, content } = matter(markdown);

    return {
      slug,
      frontMatter: {
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || '未分类',
        tags: data.tags || [],
        date: data.date || new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 分钟',
        author: data.author || '匿名',
        coverImage: data.coverImage,
      },
      content,
    };
  } catch (error) {
    console.error('加载 Markdown 文章失败:', error);
    return null;
  }
}

export async function listMarkdownPosts(): Promise<string[]> {
  // 这里返回可用的文章列表
  // 在实际应用中，你可能需要一个 manifest 文件来列出所有文章
  return [
    'material-design-3-guide',
    // 添加更多文章 slug
  ];
}
