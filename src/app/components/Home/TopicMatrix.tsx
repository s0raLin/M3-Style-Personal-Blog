import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  alpha,
  Card,
  CardMedia,
  CardContent,
  ButtonBase,
  Avatar,
  Stack,
} from '@mui/material';
import {
  CalendarToday,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, GalleryImage } from '../../types/blog';
import { staticPosts, galleryImages } from '../../service/blogService';

// ═══════════════════════════════════════════
// 1. Unified schema
// ═══════════════════════════════════════════
interface ContentItem {
  id: string;
  type: 'post' | 'photo';
  title: string;
  coverImage?: string;
  tags: string[];
  date: string;
  excerpt: string;
  link?: string;
  author?: { name: string; avatar: string };
}

// ═══════════════════════════════════════════
// 2. Build unified data from real blog + gallery
// ═══════════════════════════════════════════
function buildUnifiedItems(): ContentItem[] {
  const posts: ContentItem[] = (staticPosts ?? []).slice(0, 5).map((p: BlogPost) => ({
    id: `post-${p.id}`,
    type: 'post',
    title: p.title,
    coverImage: p.coverImage,
    tags: p.tags ?? [],
    date: p.date,
    excerpt: p.excerpt ?? '',
    author: p.author,
  }));

  const photos: ContentItem[] = (galleryImages ?? []).slice(0, 5).map((img: GalleryImage, idx: number) => ({
    id: `photo-${img.id}`,
    type: 'photo',
    title: img.title ?? img.description ?? 'Gallery photo',
    coverImage: img.url,
    tags: img.category ? [img.category] : [],
    date: '',
    excerpt: img.description ?? '',
  }));

  return [...posts, ...photos];
}

const ALL_ITEMS = buildUnifiedItems();

// ═══════════════════════════════════════════
// 3. Helper – compute weighted tag cloud
// ═══════════════════════════════════════════
function useTagCloud(items: ContentItem[]) {
  return useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => {
      it.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
    });
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const maxCount = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([tag, count]) => ({ tag, count, weight: count / maxCount }));
  }, [items]);
}

// ═══════════════════════════════════════════
// 4. TopicMatrix component
// ═══════════════════════════════════════════
interface TopicMatrixProps {
  onSelectItem?: (item: ContentItem) => void;
}

export default function TopicMatrix({ onSelectItem }: TopicMatrixProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCloud = useTagCloud(ALL_ITEMS);

  const filteredItems = useMemo(
    () => (activeTag ? ALL_ITEMS.filter((it) => it.tags.includes(activeTag)) : ALL_ITEMS),
    [activeTag],
  );

  const handleTagToggle = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  // ── Surface tokens ──
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(103,80,164,0.06)';
  const cardHoverElevation = isDark
    ? '0 8px 32px rgba(0,0,0,0.45)'
    : `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`;

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 0 } }}>
      {/* ═══ Title ═══ */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 4,
              height: 24,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            内容探索
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          按标签浏览文章与摄影作品
        </Typography>
      </Box>

      {/* ═══ A — Tag Cloud (heat‑map style) ═══ */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 0.8, sm: 1.2 },
          mb: 4,
        }}
      >
        {/* All-tag chip */}
        <Chip
          label="All"
          onClick={() => setActiveTag(null)}
          variant={activeTag === null ? 'filled' : 'outlined'}
          color="primary"
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.78rem',
            height: 32,
            transition: 'all 0.3s cubic-bezier(0.2,0.8,0.2,1)',
            '& .MuiChip-label': { px: 1.2 },
          }}
        />

        {tagCloud.map(({ tag, count, weight }) => {
          const isActive = activeTag === tag;
          const size = 0.75 + weight * 0.45; // scale 0.75 – 1.2
          const bgOpacity = 0.06 + weight * 0.16;
          return (
            <Chip
              key={tag}
              icon={<TagIcon sx={{ fontSize: 14 }} />}
              label={`${tag} ${count}`}
              onClick={() => handleTagToggle(tag)}
              sx={{
                borderRadius: '12px',
                fontWeight: isActive ? 700 : 500,
                fontSize: `${size}rem`,
                height: 32,
                backgroundColor: isActive
                  ? alpha(theme.palette.primary.main, 0.22)
                  : alpha(theme.palette.primary.main, bgOpacity),
                color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                border: isActive
                  ? `1.5px solid ${alpha(theme.palette.primary.main, 0.45)}`
                  : `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s cubic-bezier(0.2,0.8,0.2,1)',
                '& .MuiChip-label': { px: 1 },
                '& .MuiChip-icon': {
                  ml: 0.8,
                  mr: -0.3,
                  fontSize: 14,
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.disabled,
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  borderColor: alpha(theme.palette.primary.main, 0.35),
                },
              }}
            />
          );
        })}
      </Box>

      {/* ═══ B — Dynamic Result Grid ═══ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2.5,
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <ButtonBase
                onClick={() => onSelectItem?.(item)}
                sx={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'left',
                  display: 'block',
                  borderRadius: '18px',
                }}
              >
                {item.type === 'post' ? (
                  /* ── Post-style card (text-dominant) ── */
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '18px',
                      backgroundColor: theme.palette.background.paper,
                      transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                      '&:hover': {
                        boxShadow: cardHoverElevation,
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : alpha(theme.palette.primary.main, 0.15),
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.4 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', flex: 1 }}>
                        {item.excerpt}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.author && (
                          <Avatar src={item.author.avatar} sx={{ width: 20, height: 20 }} />
                        )}
                        <Typography variant="caption" color="text.disabled">
                          {item.date}
                        </Typography>
                      </Stack>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                        {item.tags.map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" sx={{ borderRadius: '7px', height: 20, fontSize: '0.62rem' }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  /* ── Photo-style card (image-first) ── */
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '18px',
                      backgroundColor: theme.palette.background.paper,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                      '&:hover': {
                        boxShadow: cardHoverElevation,
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : alpha(theme.palette.primary.main, 0.15),
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.coverImage}
                      alt={item.title}
                      sx={{ height: 140, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 'auto' }}>
                        {item.tags.map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" sx={{ borderRadius: '7px', height: 20, fontSize: '0.62rem' }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </ButtonBase>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
