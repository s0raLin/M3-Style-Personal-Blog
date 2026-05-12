// import { useState, useEffect } from 'react';
// import { BlogPost } from '@/app/data/blogData';
// import { getAllPosts, getAllCategories } from '@/app/utils/blogLoader';

// export function useBlogPosts() {
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         setLoading(true);
//         const [postsData, categoriesData] = await Promise.all([
//           getAllPosts(),
//           getAllCategories(),
//         ]);
//         setPosts(postsData);
//         setCategories(categoriesData);
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error('加载失败'));
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   return { posts, categories, loading, error };
// }
