import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Dialog,
  IconButton,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import Masonry from "react-responsive-masonry";
import { GalleryImage } from "../../types/blog";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const categories = [
    "全部",
    ...Array.from(new Set(images.map((img) => img.category))),
  ];

  const filteredImages =
    selectedCategory === "全部"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 5,
              height: 32,
              borderRadius: "4px",
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            图库
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, ml: 7 }}>
          记录生活中的美好瞬间
        </Typography>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 4,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: "12px 12px 0 0",
              minWidth: "auto",
              px: 2.5,
              py: 1.5,
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </motion.div>

      {/* Masonry Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Masonry columnsCount={3} gutter="16px">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedImage(image)}
            >
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.12)"
                      : alpha(theme.palette.primary.main, 0.15),
                    boxShadow: isDarkMode
                      ? "0 8px 32px rgba(0,0,0,0.4)"
                      : `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
                  },
                  "&:hover .gallery-overlay": {
                    opacity: 1,
                  },
                }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: 16,
                  }}
                  loading="lazy"
                />
                {/* Glass Overlay */}
                <Box
                  className="gallery-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to top, ${alpha("#000", 0.7)} 0%, ${alpha("#000", 0.15)} 50%, transparent 100%)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 2.5,
                    opacity: 0,
                    transition: "opacity 0.35s ease",
                    borderRadius: "16px",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {image.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.5,
                    }}
                  >
                    {image.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Masonry>
      </motion.div>

      {/* Lightbox Modal */}
      <Dialog
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Fade}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(20px)",
              backgroundColor: isDarkMode
                ? "rgba(10, 10, 15, 0.75)"
                : "rgba(255, 255, 255, 0.6)",
            },
          },
        }}
      >
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => setSelectedImage(null)}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                    zIndex: 1,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "90vh",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
                <Box
                  sx={{
                    background: `linear-gradient(to top, ${alpha("#000", 0.85)}, ${alpha("#000", 0.5)})`,
                    backdropFilter: "blur(12px)",
                    color: "white",
                    p: 3,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                  >
                    {selectedImage.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {selectedImage.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Container>
  );
}
