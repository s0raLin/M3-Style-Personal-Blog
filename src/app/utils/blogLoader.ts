import grayMatter from 'gray-matter';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface PostMeta {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage?: string;
  author: string;
}

// 获取所有文章列表
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // 假设我们已知文章文件列表，也可以从 API 获取文件列表
    const postFiles = [
      'material-design-3-guide.md',
      'react-18-new-features.md',
      'typescript-advanced-guide.md',
      'css-grid-complete-guide.md',
      'web-performance-optimization.md',
      'accessibility-best-practices.md',
    ];

    const posts = await Promise.all(
      postFiles.map(async (filename) => fetchPost(filename))
    );

    // 按日期排序
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('加载文章列表失败:', error);
    return [];
  }
}

// 根据 ID 获取单篇文章
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const filename = `${id}.md`;
    return await fetchPost(filename);
  } catch (error) {
    console.error(`加载文章 ${id} 失败:`, error);
    return null;
  }
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  );
  return ['全部', ...categories];
}

// 内部函数：Fetch 并解析单个 Markdown 文件
async function fetchPost(filename: string): Promise<BlogPost> {
  const response = await fetch(`/posts/${filename}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }

  const markdown = await response.text();

  // 使用 gray-matter 解析 frontmatter
  const { data, content } = grayMatter(markdown);

  const meta = data as PostMeta;

  // 生成 ID（从文件名）
  const id = filename.replace('.md', '');

  return {
    id,
    title: meta.title || '无标题',
    excerpt: meta.excerpt || '',
    content,
    category: meta.category || '未分类',
    tags: meta.tags || [],
    date: meta.date || new Date().toISOString().split('T')[0],
    readTime: meta.readTime || '5 分钟',
    coverImage: meta.coverImage,
    author: {
      name: meta.author || '匿名',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
  };
}
