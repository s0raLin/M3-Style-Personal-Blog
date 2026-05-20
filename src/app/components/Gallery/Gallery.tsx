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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import Masonry from "react-responsive-masonry";
import { GalleryImage } from "../../types/blog";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          图库
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          记录生活中的美好瞬间
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Masonry columnsCount={3} gutter="16px">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedImage(image)}
            >
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  "&:hover .overlay": {
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
                    borderRadius: 8,
                  }}
                  loading="lazy"
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 2,
                    opacity: 0,
                    transition: "opacity 0.3s",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {image.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {image.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Masonry>
      </motion.div>

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
      >
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    p: 3,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {selectedImage.title}
                  </Typography>
                  <Typography variant="body1">
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
