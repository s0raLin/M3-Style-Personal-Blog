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

export const categories = ["全部", "设计", "前端开发", "性能优化"];

export const authorInfo = {
  name: "蒼璃",
  title: "后端 & 全栈",
  avatar: "https://avatars.githubusercontent.com/u/174418702?v=4",
  bio: "热爱技术, 热爱生活",
  email: "892581781@qq.com",
  location: "中国 · 北京",
  social: {
    github: "https://github.com/s0raLin",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  skills: [
    "React",
    "TypeScript",
    "Go",
    "Material Design",
    "UI/UX Design",
    "CSS",
    "Node.js",
    "Python",
    "Figma",
  ],
  experience: [
    {
      title: "高级前端工程师",
      company: "某科技公司",
      period: "2022 - 至今",
      description: "负责企业级 Web 应用的架构设计和开发",
    },
    {
      title: "前端工程师",
      company: "某互联网公司",
      period: "2020 - 2022",
      description: "参与多个大型项目的前端开发工作",
    },
  ],
};
