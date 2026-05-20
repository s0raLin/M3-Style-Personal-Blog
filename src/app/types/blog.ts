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

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
}

export interface AuthorInfo {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  email: string;
  location: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  skills: string[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  projects: { name: string; description: string; tech: string[] }[];
}

// export const categories = ["全部", "设计", "前端开发", "性能优化"];
