import {
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Button,
  Skeleton,
  Fab,
  Zoom,
  Fade,
  Dialog,
  Drawer,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  Share,
  Facebook,
  Twitter,
  LinkedIn,
  ContentCopy,
  CalendarToday,
  AccessTime,
  KeyboardArrowUp,
  ErrorOutline,
  ContentCopy as CopyIcon,
  ImageNotSupported,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ArticleOutlined,
  FiberManualRecord,
  MenuBook,
} from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "../../types/blog";
import { useState, useEffect, memo, useMemo } from "react";
import { toast } from "sonner";
import ImagePlaceholder from "../Common/ImagePlaceholder";
import Giscus from "@giscus/react";
import { createHighlighter } from "shiki";

interface BlogDetailProps {
  post: BlogPost;
  posts: BlogPost[];
  onBack: () => void;
  isDarkMode: boolean;
}

/* ═══════════════════════════════════════════════
   1. Shiki 代码高亮
   ═══════════════════════════════════════════════ */
const ShikiCodeBlock = memo(function ShikiCodeBlock({
  code, language, isDarkMode,
}: { code: string; language: string; isDarkMode: boolean }) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const normalizedLang = language === "kt" ? "kotlin" : language || "plaintext";

  useEffect(() => {
    let isMounted = true;
    setLoading(true); setError(false);
    (async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-light", "github-dark"],
          langs: ["kotlin","java","typescript","tsx","javascript","plaintext","xml","rust","scala","go","python","bash","json","css","html"],
        });
        if (isMounted) { setHtml(highlighter.codeToHtml(code, { lang: normalizedLang, theme: isDarkMode ? "github-dark" : "github-light" })); setLoading(false); }
      } catch { if (isMounted) { setError(true); setLoading(false); } }
    })();
    return () => { isMounted = false; };
  }, [code, normalizedLang, isDarkMode]);

  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return (
    <Box sx={{ mb:2, borderRadius:"12px", overflow:"hidden", border:"1px solid", borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
      <Box sx={{ px:2, py:1, display:"flex", alignItems:"center", justifyContent:"space-between", bgcolor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderBottom:"1px solid", borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}>
        <Skeleton variant="rounded" width={60} height={20} sx={{ borderRadius:"6px" }} />
        <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius:"8px" }} />
      </Box>
      <Box sx={{ p:2, bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)" }}>
        {[100,75,88,55,92,68].map((w,i)=><Skeleton key={i} variant="text" width={`${w}%`} height={20} sx={{ mb:0.5, borderRadius:"4px", bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }} />)}
      </Box>
    </Box>
  );

  if (error) return (
    <Box sx={{ mb:2, borderRadius:"12px", overflow:"hidden", border:"1px solid", borderColor: isDarkMode ? "rgba(255,100,100,0.25)" : "rgba(211,47,47,0.15)" }}>
      <Box sx={{ px:2, py:1, display:"flex", alignItems:"center", justifyContent:"space-between", bgcolor: isDarkMode ? "rgba(255,100,100,0.08)" : "rgba(211,47,47,0.05)", borderBottom:"1px solid", borderColor: isDarkMode ? "rgba(255,100,100,0.15)" : "rgba(211,47,47,0.1)" }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1 }}><ErrorOutline sx={{ fontSize:14, color:"error.main", opacity:0.8 }} /><Typography variant="caption" sx={{ color:"error.main", fontWeight:600 }}>{normalizedLang}</Typography><Typography variant="caption" sx={{ color:"text.disabled", fontSize:"0.7rem" }}>· 高亮失败</Typography></Box>
        <IconButton size="small" onClick={handleCopy}><CopyIcon sx={{ fontSize:14 }} /></IconButton>
      </Box>
      <Box component="pre" sx={{ m:0, p:2, overflowX:"auto", fontSize:"0.8rem", lineHeight:1.7, fontFamily:"'Fira Code',Consolas,Monaco,monospace", bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", color:"text.secondary", whiteSpace:"pre" }}>{code}</Box>
    </Box>
  );

  return (
    <Box sx={{ mb:2, borderRadius:"12px", overflow:"hidden", border:"1px solid", borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", "&:hover":{ borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }, "&:hover .code-copy-btn":{ opacity:1 } }}>
      <Box sx={{ px:2, py:0.75, display:"flex", alignItems:"center", justifyContent:"space-between", bgcolor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderBottom:"1px solid", borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}>
        <Typography variant="caption" sx={{ color:"text.disabled", fontFamily:"monospace", fontWeight:600, letterSpacing:"0.05em", textTransform:"lowercase", fontSize:"0.7rem" }}>{normalizedLang}</Typography>
        <IconButton className="code-copy-btn" size="small" onClick={handleCopy} sx={{ opacity:0, transition:"opacity 0.15s", borderRadius:"8px", p:"4px", "&:hover":{ bgcolor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" } }}>
          {copied ? <Typography variant="caption" sx={{ fontSize:"0.6rem", color:"success.main", fontWeight:700, px:0.5 }}>已复制</Typography> : <CopyIcon sx={{ fontSize:13, color:"text.disabled" }} />}
        </IconButton>
      </Box>
      <Box dangerouslySetInnerHTML={{ __html: html }} sx={{ overflowX:"auto", "& pre": { padding:"12px !important", borderRadius:"0 !important", overflowX:"auto", fontSize:"0.8rem", fontFamily:"'Fira Code',Consolas,Monaco,monospace", margin:"0 !important", lineHeight:"1.6 !important", WebkitOverflowScrolling:"touch" } }} />
    </Box>
  );
});

/* ═══════════════════════════════════════════════
   2. Markdown 图片
   ═══════════════════════════════════════════════ */
const MarkdownImage = memo(function MarkdownImage({ src, alt, isDarkMode }: { src: string; alt?: string; isDarkMode: boolean }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  if (error) return (
    <Box sx={{ width:"100%", height:{ xs:150, sm:220 }, my:2, borderRadius:"12px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1, border:"1px dashed", borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)", bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", color:"text.disabled" }}>
      <ImageNotSupported sx={{ fontSize:32, opacity:0.6, color:"error.main" }} />
      <Typography variant="body2" sx={{ fontSize:"0.8rem", opacity:0.8 }}>图片加载失败 {alt ? `(${alt})` : ""}</Typography>
    </Box>
  );
  return (
    <Box sx={{ position:"relative", my:2, width:"100%", textAlign:"center" }}>
      {loading && <Skeleton variant="rounded" animation="wave" sx={{ width:"100%", height:{ xs:150, sm:220 }, borderRadius:"8px" }} />}
      <Box component="img" src={src} alt={alt} onLoad={()=>setLoading(false)} onError={()=>{setLoading(false);setError(true)}}
        onClick={() => { if(!loading&&!error) setOpenPreview(true); }}
        sx={{ maxWidth:"100%", maxHeight:{ xs:"300px", md:"450px" }, borderRadius:"8px", display:loading?"none":"block", mx:"auto", cursor:loading?"default":"zoom-in", boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.06)", transition:"transform 0.3s", "&:hover":loading?{}:{ transform:"scale(1.015)" } }} />
      <Dialog open={openPreview} onClose={()=>setOpenPreview(false)} maxWidth="lg" TransitionComponent={Fade}
        slotProps={{ backdrop:{ sx:{ backdropFilter:"blur(16px)", bgcolor: isDarkMode ? "rgba(15,15,15,0.75)" : "rgba(255,255,255,0.65)" } } }}>
        <Box sx={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <Box sx={{ position:"relative", maxWidth:"100%" }}>
            <IconButton onClick={()=>setOpenPreview(false)} sx={{ position:"absolute", top:8, right:8, bgcolor:"rgba(0,0,0,0.5)", color:"white", "&:hover":{bgcolor:"rgba(0,0,0,0.7)"}, zIndex:1 }}><CloseIcon /></IconButton>
            <Box component="img" src={src} alt={alt} onClick={()=>setOpenPreview(false)}
              sx={{ display:"block", maxWidth:"100%", maxHeight:{ xs:"80vh", md:"75vh" }, objectFit:"contain", borderRadius:"12px", cursor:"zoom-out", boxShadow: isDarkMode ? "0 24px 60px rgba(0,0,0,0.8)" : "0 24px 60px rgba(0,0,0,0.15)" }} />
          </Box>
          {alt && <Box sx={{ width:"100%", textAlign:"center", mt:1.5, px:2, color: isDarkMode ? "text.primary" : "text.secondary" }}><Typography variant="body2" sx={{ fontWeight:500, opacity:0.8, fontSize:"0.85rem" }}>{alt}</Typography></Box>}
        </Box>
      </Dialog>
    </Box>
  );
});

/* ═══════════════════════════════════════════════
   3. 文章列表 + 阅读小地图
   ═══════════════════════════════════════════════ */
function ArticleListSidebar({ posts, currentId, isDarkMode, onSelect }: {
  posts: BlogPost[]; currentId: string; isDarkMode: boolean; onSelect?: () => void;
}) {
  const theme = useTheme();
  const surfBg = isDarkMode ? "rgba(22,22,28,0.72)" : "rgba(255,255,255,0.72)";
  const surfBorder = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(103,80,164,0.08)";
  return (
    <Box sx={{
      borderRadius:"16px", border:"1px solid", borderColor: surfBorder,
      backgroundColor: surfBg, backdropFilter:"blur(18px) saturate(1.6)", WebkitBackdropFilter:"blur(18px) saturate(1.6)",
      p:2, transition:"box-shadow 0.35s cubic-bezier(0.2,0.8,0.2,1)",
      "&:hover":{ boxShadow: isDarkMode ? "0 4px 24px rgba(0,0,0,0.3)" : `0 4px 24px ${alpha(theme.palette.primary.main,0.05)}` },
    }}>
      <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2 }}>
        <ArticleOutlined sx={{ fontSize:15, color:"text.disabled" }} />
        <Typography variant="overline" sx={{ fontWeight:700, letterSpacing:"0.08em", color:"text.disabled", lineHeight:1 }}>文章列表</Typography>
      </Box>
      <Box component="nav" sx={{ display:"flex", flexDirection:"column", gap:0.1 }}>
        {posts.map((p) => {
          const isActive = p.id === currentId;
          return (
            <Box key={p.id} component="a" href={`#/blog/${p.id}`}
              onClick={(e:any)=>{e.preventDefault();window.location.hash=`#/blog/${p.id}`;onSelect?.();}}
              sx={{ display:"flex", alignItems:"center", gap:1, px:1.2, py:0.9, borderRadius:"10px", textDecoration:"none", cursor:"pointer",
                transition:"all 0.2s cubic-bezier(0.2,0.8,0.2,1)",
                backgroundColor: isActive ? alpha(theme.palette.primary.main, isDarkMode ? 0.18 : 0.10) : "transparent",
                "&:hover":{ backgroundColor: isActive ? alpha(theme.palette.primary.main, isDarkMode ? 0.22 : 0.14) : alpha(theme.palette.primary.main,0.06) } }}>
              <FiberManualRecord sx={{ fontSize:8, color: isActive ? "primary.main" : "transparent", flexShrink:0, transition:"color 0.2s ease" }} />
              <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400, fontSize:"0.8rem", lineHeight:1.35, color: isActive ? "primary.main" : "text.secondary",
                overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", transition:"color 0.2s ease" }}>{p.title}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function ReadingMiniMap({ progress, isDarkMode }: { progress: number; isDarkMode: boolean }) {
  const theme = useTheme();
  const surfBg = isDarkMode ? "rgba(22,22,28,0.72)" : "rgba(255,255,255,0.72)";
  const surfBorder = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(103,80,164,0.08)";
  return (
    <Box sx={{
      borderRadius:"16px", border:"1px solid", borderColor: surfBorder,
      backgroundColor: surfBg, backdropFilter:"blur(18px) saturate(1.6)", WebkitBackdropFilter:"blur(18px) saturate(1.6)",
      p:1.5, display:"flex", flexDirection:"column", alignItems:"center", gap:1.5, width:52,
      transition:"box-shadow 0.35s cubic-bezier(0.2,0.8,0.2,1)",
      "&:hover":{ boxShadow: isDarkMode ? "0 4px 24px rgba(0,0,0,0.3)" : `0 4px 24px ${alpha(theme.palette.primary.main,0.05)}` },
    }}>
      <Box sx={{ position:"relative", width:3, height:150, borderRadius:2, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", overflow:"hidden" }}>
        <Box sx={{ position:"absolute", bottom:0, left:0, right:0, height:`${Math.min(progress,100)}%`,
          background:`linear-gradient(to top, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, borderRadius:2, transition:"height 0.15s ease-out" }} />
      </Box>
      <Typography variant="caption" sx={{ fontWeight:700, fontSize:"0.65rem", color:"text.disabled", letterSpacing:"0.04em" }}>{Math.round(progress)}%</Typography>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   4. BlogDetail 主组件
   ═══════════════════════════════════════════════ */
export default function BlogDetail({ post, posts, onBack, isDarkMode }: BlogDetailProps) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = !isLgUp;
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { prevPost, nextPost } = useMemo(() => {
    const idx = posts.findIndex((p) => p.id === post.id);
    return { prevPost: idx > 0 ? posts[idx - 1] : null, nextPost: idx < posts.length - 1 ? posts[idx + 1] : null };
  }, [posts, post.id]);

  const markdownComponents = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? <ShikiCodeBlock code={String(children).replace(/\n$/,"")} language={match[1]} isDarkMode={isDarkMode} /> : <code className={className} {...props}>{children}</code>;
    },
    img({ src, alt }: any) { return <MarkdownImage src={src||""} alt={alt} isDarkMode={isDarkMode} />; },
  }), [isDarkMode]);

  useEffect(() => { window.scrollTo({ top:0, behavior:"instant" }); }, [post.id]);

  useEffect(() => {
    const handleScroll = () => {
      const docH = document.body.scrollHeight - window.innerHeight;
      setReadProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
      setShowScrollTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top:0, behavior:"smooth" });
  const handleShare = (platform: string) => {
    const url = window.location.href; const text = `${post.title} - ${post.excerpt}`;
    const map: Record<string,string> = { twitter:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, facebook:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` };
    if (platform==="copy") { navigator.clipboard.writeText(url); toast.success("链接已复制到剪贴板"); setShowShareMenu(false); return; }
    if (map[platform]) { window.open(map[platform],"_blank","width=600,height=400"); setShowShareMenu(false); }
  };

  const glassBg = isDarkMode ? "rgba(22,22,28,0.65)" : "rgba(255,255,255,0.65)";
  const glassBorder = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(103,80,164,0.06)";
  const navBg = isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(103,80,164,0.02)";
  const navBorder = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(103,80,164,0.08)";

  return (
    <Box sx={{ minHeight:"100vh", position:"relative" }}>
      {/* Mobile progress bar — 置顶 */}
      {isMobile && (
        <Box sx={{ position:"sticky", top:0, zIndex:1200 }}>
          <Box sx={{ height:3, backgroundColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", position:"relative" }}>
            <Box sx={{ position:"absolute", top:0, left:0, height:"100%", width:`${Math.min(readProgress,100)}%`,
              background:`linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, borderRadius:2, transition:"width 0.15s ease-out" }} />
          </Box>
        </Box>
      )}

      <Box sx={{ position:"relative", px:{ xs:1, sm:2, lg:3 }, pb:{ xs:8, md:6 } }}>
        {/* ── LEFT FLOATING SIDEBAR ── */}
        <Box sx={{ display:{ xs:"none", lg:"block" }, position:"fixed", left:{ lg:16, xl:32 }, top:96, width:220, zIndex:5 }}>
          <ArticleListSidebar posts={posts} currentId={post.id} isDarkMode={isDarkMode} />
        </Box>

        {/* ── RIGHT FLOATING SIDEBAR ── */}
        <Box sx={{ display:{ xs:"none", lg:"block" }, position:"fixed", right:{ lg:16, xl:32 }, top:96, zIndex:5 }}>
          <ReadingMiniMap progress={readProgress} isDarkMode={isDarkMode} />
        </Box>

        {/* ── CENTER: always centered ── */}
        <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          {/* Back + Mobile menu */}
          <Box sx={{ width:"100%", maxWidth:760, display:"flex", justifyContent:"space-between", alignItems:"center", py:1 }}>
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}>
              <IconButton onClick={onBack} size="small"
                sx={{ backgroundColor: isDarkMode ? "rgba(22,22,28,0.75)" : "rgba(255,255,255,0.7)", backdropFilter:"blur(16px)", border:"1px solid", borderColor: glassBorder, borderRadius:"12px" }}>
                <ArrowBack fontSize="small" />
              </IconButton>
            </motion.div>
            {isMobile && (
              <IconButton onClick={()=>setMobileDrawerOpen(true)} size="small"
                sx={{ backgroundColor: isDarkMode ? "rgba(22,22,28,0.75)" : "rgba(255,255,255,0.7)", backdropFilter:"blur(16px)", border:"1px solid", borderColor: glassBorder, borderRadius:"12px" }}>
                <MenuBook fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Article card */}
          <Box sx={{ width:"100%", maxWidth:760 }}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}>
              <Paper elevation={0} sx={{
                p:{ xs:2.5, sm:3, md:5 }, mb:4, borderRadius:{ xs:"20px", md:"24px" },
                backgroundColor: glassBg, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                border:"1px solid", borderColor: glassBorder,
                transition:"box-shadow 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                "&:hover":{ boxShadow: isDarkMode ? "0 4px 32px rgba(0,0,0,0.3)" : `0 4px 32px ${alpha(theme.palette.primary.main,0.06)}` },
              }}>
                {post.coverImage && (
                  <Box sx={{ mx:{ xs:-2.5, sm:-3, md:-5 }, mt:{ xs:-2.5, sm:-3, md:-5 }, mb:3, borderRadius:{ xs:"16px 16px 0 0", md:"20px 20px 0 0" }, overflow:"hidden" }}>
                    <ImagePlaceholder src={post.coverImage} alt={post.title} height={360} category={post.category} />
                  </Box>
                )}
                <Chip label={post.category} color="primary" size="small" sx={{ mb:1.5, borderRadius:"12px" }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight:700, mb:1, fontSize:{ xs:"1.3rem", sm:"1.6rem", md:"2rem" }, letterSpacing:"-0.02em" }}>{post.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb:2.5, lineHeight:1.7, fontSize:{ xs:"0.88rem", sm:"0.95rem" } }}>{post.excerpt}</Typography>

                <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:1.5, mb:2.5 }}>
                  <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                    <Avatar src={post.author.avatar} sx={{ width:{ xs:36, sm:44 }, height:{ xs:36, sm:44 } }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight:600, fontSize:{ xs:"0.82rem", sm:"0.9rem" } }}>{post.author.name}</Typography>
                      <Box sx={{ display:"flex", gap:1.5, alignItems:"center", flexWrap:"wrap" }}>
                        <Box sx={{ display:"flex", alignItems:"center", gap:0.3 }}><CalendarToday sx={{ fontSize:12 }} /><Typography variant="caption" color="text.secondary" sx={{ fontSize:"0.7rem" }}>{post.date}</Typography></Box>
                        <Box sx={{ display:"flex", alignItems:"center", gap:0.3 }}><AccessTime sx={{ fontSize:12 }} /><Typography variant="caption" color="text.secondary" sx={{ fontSize:"0.7rem" }}>{post.readTime}</Typography></Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ position:"relative" }}>
                    <IconButton size="small" onClick={()=>setShowShareMenu(!showShareMenu)} sx={{ borderRadius:"10px" }}><Share fontSize="small" /></IconButton>
                    {showShareMenu && (
                      <motion.div initial={{ opacity:0, scale:0.9, y:-10 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ duration:0.2 }}>
                        <Paper elevation={4} sx={{ position:"absolute", right:0, top:"100%", mt:1, p:1, zIndex:10, minWidth:200, borderRadius:"14px" }}>
                          <Button fullWidth startIcon={<Twitter />} onClick={()=>handleShare("twitter")} sx={{ justifyContent:"flex-start", mb:0.5 }}>分享到 Twitter</Button>
                          <Button fullWidth startIcon={<Facebook />} onClick={()=>handleShare("facebook")} sx={{ justifyContent:"flex-start", mb:0.5 }}>分享到 Facebook</Button>
                          <Button fullWidth startIcon={<LinkedIn />} onClick={()=>handleShare("linkedin")} sx={{ justifyContent:"flex-start", mb:0.5 }}>分享到 LinkedIn</Button>
                          <Divider sx={{ my:1 }} />
                          <Button fullWidth startIcon={<ContentCopy />} onClick={()=>handleShare("copy")} sx={{ justifyContent:"flex-start" }}>复制链接</Button>
                        </Paper>
                      </motion.div>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display:"flex", gap:0.75, flexWrap:"wrap", mb:3 }}>
                  {post.tags.map((tag:string)=><Chip key={tag} label={tag} size="small" sx={{ borderRadius:"10px", fontWeight:500, bgcolor:"action.hover", color:"text.primary", border:"none", fontSize:"0.72rem" }} />)}
                </Box>

                <Divider sx={{ mb:3 }} />

                <Box sx={{
                  "& h1":{ fontSize:{ xs:"1.4rem", md:"1.8rem" }, fontWeight:800, mt:4, mb:2, lineHeight:1.3, letterSpacing:"-0.02em", color:"text.primary" },
                  "& h2":{ fontSize:{ xs:"1.15rem", md:"1.35rem" }, fontWeight:700, mt:3.5, mb:1.5, lineHeight:1.4, letterSpacing:"-0.015em", paddingBottom:"0.3em", borderBottom:"1px solid", borderColor:"divider" },
                  "& h3":{ fontSize:{ xs:"1rem", md:"1.1rem" }, fontWeight:700, mt:2.5, mb:1, lineHeight:1.5, color:"primary.main" },
                  "& h4":{ fontSize:"0.95rem", fontWeight:600, mt:2, mb:0.75, lineHeight:1.5 },
                  "& p":{ mb:1.5, lineHeight:1.8, fontSize:{ xs:"0.9rem", sm:"0.95rem" }, color:"text.primary" },
                  "& ul":{ mb:1.5, pl:0, listStyle:"none" },
                  "& ul li":{ mb:0.5, pl:"1.4em", position:"relative", lineHeight:1.75, fontSize:{ xs:"0.9rem", sm:"0.95rem" }, "&::before":{ content:'""', position:"absolute", left:"0.15em", top:"0.6em", width:"5px", height:"5px", borderRadius:"50%", backgroundColor:"primary.main", opacity:0.7 } },
                  "& ol":{ mb:1.5, pl:"1.8em", listStyleType:"decimal", color:"text.primary" },
                  "& ol li":{ mb:0.5, lineHeight:1.75, pl:"0.2em", fontSize:{ xs:"0.9rem", sm:"0.95rem" }, "&::marker":{ color:"primary.main", fontWeight:700 } },
                  "& ul ul, & ol ul":{ mt:0.4, mb:0, pl:"1em" }, "& ul ul li::before":{ width:"4px", height:"4px", opacity:0.45 },
                  "& ul ol, & ol ol":{ mt:0.4, mb:0, pl:"1.3em", listStyleType:"decimal" },
                  "& blockquote":{ borderLeft:"3px solid", borderColor:"primary.main", pl:2, py:0.75, my:2, mx:0, borderRadius:"0 8px 8px 0", backgroundColor: isDarkMode ? `${theme.palette.primary.main}14` : `${theme.palette.primary.main}0a`, "& p":{ mb:0, fontStyle:"italic", color:"text.secondary", fontSize:"0.9rem" } },
                  "& :not(pre) > code":{ backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : `${theme.palette.primary.main}14`, color:"primary.main", padding:"2px 4px", borderRadius:"4px", fontFamily:"'Fira Code',Consolas,Monaco,monospace", fontSize:"0.8em", fontWeight:600, letterSpacing:"0.01em", filter: isDarkMode ? "brightness(1.3)" : "none" },
                  "& table":{ width:"100%", mb:2, borderCollapse:"collapse", fontSize:"0.8rem", borderRadius:"8px", overflow:"hidden", border:"1px solid", borderColor:"divider", display:"block", overflowX:"auto", WebkitOverflowScrolling:"touch" },
                  "& th":{ px:1.5, py:0.8, textAlign:"left", fontWeight:700, fontSize:"0.72rem", letterSpacing:"0.04em", textTransform:"uppercase", backgroundColor: isDarkMode ? `${theme.palette.primary.main}33` : `${theme.palette.primary.main}12`, color:"primary.main", borderBottom:"1px solid", borderColor:"divider" },
                  "& td":{ px:1.5, py:0.8, borderBottom:"1px solid", borderColor:"divider", lineHeight:1.5, verticalAlign:"top" },
                  "& tr:last-child td":{ borderBottom:"none" }, "& tr:hover td":{ backgroundColor:"action.hover" },
                  "& hr":{ border:"none", borderTop:"1px solid", borderColor:"divider", my:3 },
                  "& a":{ color:"primary.main", textDecoration:"none", fontWeight:500, borderBottom:"1px solid transparent", transition:"border-color 0.15s", "&:hover":{ borderColor:"primary.main" } },
                  "& img":{ maxWidth:"100%", height:"auto" }, "& strong":{ fontWeight:700, color:"text.primary" }, "& em":{ fontStyle:"italic", color:"text.secondary" },
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{post.content}</ReactMarkdown>
                </Box>

                <Divider sx={{ my:4 }} />

                {/* ══════════════════════════════════════════
                    PREV / NEXT
                    ══════════════════════════════════════════ */}
                <Box sx={{ display:"flex", justifyContent:"space-between", gap:1.5, flexWrap:"wrap" }}>
                  {prevPost ? (
                    <Box component="a" href={`#/blog/${prevPost.id}`} onClick={(e:any)=>{e.preventDefault();window.location.hash=`#/blog/${prevPost.id}`}}
                      sx={{ flex:1, minWidth:{ xs:120, sm:160 }, p:1.5, borderRadius:"14px", textDecoration:"none", border:"1px solid", borderColor: navBorder, backgroundColor: navBg,
                        transition:"all 0.3s cubic-bezier(0.2,0.8,0.2,1)",
                        "&:hover":{ borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main,0.06), transform:"translateX(-2px)" } }}>
                      <Typography variant="caption" sx={{ color:"text.disabled", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", mb:0.3, display:"flex", alignItems:"center", gap:0.3, fontSize:"0.65rem" }}>
                        <KeyboardArrowLeft sx={{ fontSize:14 }} />上一篇</Typography>
                      <Typography variant="body2" sx={{ fontWeight:600, color:"text.primary", lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:"0.78rem" }}>{prevPost.title}</Typography>
                    </Box>
                  ) : <Box sx={{ flex:1, minWidth:{ xs:120, sm:160 } }} />}
                  {nextPost ? (
                    <Box component="a" href={`#/blog/${nextPost.id}`} onClick={(e:any)=>{e.preventDefault();window.location.hash=`#/blog/${nextPost.id}`}}
                      sx={{ flex:1, minWidth:{ xs:120, sm:160 }, p:1.5, borderRadius:"14px", textDecoration:"none", textAlign:"right", border:"1px solid", borderColor: navBorder, backgroundColor: navBg,
                        transition:"all 0.3s cubic-bezier(0.2,0.8,0.2,1)",
                        "&:hover":{ borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main,0.06), transform:"translateX(2px)" } }}>
                      <Typography variant="caption" sx={{ color:"text.disabled", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", mb:0.3, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:0.3, fontSize:"0.65rem" }}>
                        下一篇<KeyboardArrowRight sx={{ fontSize:14 }} /></Typography>
                      <Typography variant="body2" sx={{ fontWeight:600, color:"text.primary", lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:"0.78rem" }}>{nextPost.title}</Typography>
                    </Box>
                  ) : <Box sx={{ flex:1, minWidth:{ xs:120, sm:160 } }} />}
                </Box>

                {/* Comments */}
                <Divider sx={{ my:5, opacity:0.5 }} />
                <Box component={motion.section} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  sx={{ borderRadius:"24px", overflow:"hidden", border:"1px solid", borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : `${theme.palette.primary.main}1e`,
                    backgroundColor: isDarkMode ? "rgba(22,22,28,0.6)" : "rgba(255,255,255,0.55)", backdropFilter:"blur(20px) saturate(1.8)",
                    transition:"box-shadow 0.4s", "&:hover":{ boxShadow: isDarkMode ? "0 8px 40px rgba(0,0,0,0.5)" : `0 8px 40px ${theme.palette.primary.main}14` } }}>
                  <Box sx={{ height:5, width:36, backgroundColor:"primary.main", borderRadius:"0 0 4px 4px", mx:"auto", mb:-1, opacity:0.8 }} />
                  <Box sx={{ px:{ xs:2.5, md:4 }, pt:3, pb:1.5, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight:700, display:"flex", alignItems:"center", gap:1, fontSize:{ xs:"1rem", md:"1.25rem" } }}><span style={{ fontSize:"1.3rem" }}>💬</span>讨论交流</Typography>
                      <Typography variant="caption" sx={{ color:"primary.main", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", mt:0.3, display:"block", opacity:0.8, fontSize:"0.65rem" }}>Powered by GitHub Discussions</Typography>
                    </Box>
                    <Chip label="Open" size="small" sx={{ bgcolor:"success.container", color:"success.onContainer", fontWeight:600, borderRadius:"8px" }} />
                  </Box>
                  <Box key={post.title} sx={{ minHeight:280, px:{ xs:0.3, md:1 }, pb:3 }}>
                    <Giscus id="comments" repo="s0raLin/M3-Style-Personal-Blog" repoId="R_kgDOSa2OCg" category="Announcements" categoryId="DIC_kwDOSa2OCs4C86-J"
                      mapping="specific" term={post.title} strict="0" reactionsEnabled="1" emitMetadata="1" inputPosition="top" theme={isDarkMode ? "dark_dimmed" : "light"} lang="zh-CN" loading="lazy" />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer anchor="right" open={mobileDrawerOpen} onClose={()=>setMobileDrawerOpen(false)}
          PaperProps={{ sx: { width:280, backgroundColor: isDarkMode ? "rgba(18,18,24,0.98)" : "rgba(255,255,255,0.98)", backdropFilter:"blur(24px)", borderLeft:"1px solid", borderColor: glassBorder, borderRadius:"16px 0 0 16px" } }}>
          <Box sx={{ pt:7 }}><ArticleListSidebar posts={posts} currentId={post.id} isDarkMode={isDarkMode} onSelect={()=>setMobileDrawerOpen(false)} /></Box>
        </Drawer>
      )}

      {/* FAB */}
      <Zoom in={showScrollTop}>
        <Fab color="primary" size="medium" onClick={scrollToTop}
          sx={{ position:"fixed", bottom:{ xs:70, md:80 }, right:{ xs:16, md:32 }, borderRadius:"16px",
            boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.5)" : `0 4px 12px ${theme.palette.primary.main}33`,
            transition:"transform 0.2s cubic-bezier(0.2,0,0,1)", "&:hover":{ transform:"scale(1.08)" } }}>
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
}
