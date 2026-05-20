import { useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  useTheme,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  InsertDriveFile,
  Image as ImageIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface FileUploadProps {
  type: "post" | "gallery";
  onUploadSuccess?: () => void;
}

export default function FileUpload({ type, onUploadSuccess }: FileUploadProps) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    excerpt: "",
    category: "",
    tags: "",
    author: "",
    readTime: "",
    description: "",
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const isValidType =
      type === "post"
        ? file.name.endsWith(".md")
        : file.type.startsWith("image/");

    if (!isValidType) {
      toast.error(type === "post" ? "请选择 Markdown 文件" : "请选择图片文件");
      return;
    }

    setSelectedFile(file);
    setMetadata((prev) => ({
      ...prev,
      title: file.name.replace(/\.(md|jpg|jpeg|png|gif|webp)$/i, ""),
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("请先选择文件");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (type === "post") {
        formData.append("title", metadata.title);
        formData.append("excerpt", metadata.excerpt);
        formData.append("category", metadata.category);
        formData.append("tags", metadata.tags);
        formData.append("author", metadata.author);
        formData.append("readTime", metadata.readTime);
      } else {
        formData.append("title", metadata.title);
        formData.append("description", metadata.description);
        formData.append("category", metadata.category);
      }

      // 💡 顺便微调：配合全栈化，将写死的 localhost:3001 改为相对路径
      const endpoint =
        type === "post" ? "/api/posts/upload" : "/api/gallery/upload";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(type === "post" ? "文章上传成功！" : "图片上传成功！");
        setSelectedFile(null);
        setMetadata({
          title: "",
          excerpt: "",
          category: "",
          tags: "",
          author: "",
          readTime: "",
          description: "",
        });
        onUploadSuccess?.();
      } else {
        toast.error(result.error || "上传失败");
      }
    } catch (error) {
      toast.error("上传失败，请确保后台服务正在运行");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setMetadata({
      title: "",
      excerpt: "",
      category: "",
      tags: "",
      author: "",
      readTime: "",
      description: "",
    });
  };

  return (
    <Box>
      {/* 拖拽上传区域 */}
      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 4,
          textAlign: "center",
          border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
          backgroundColor: isDragging
            ? alpha(theme.palette.primary.main, 0.05)
            : "transparent",
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
        onClick={() => document.getElementById(`file-input-${type}`)?.click()}
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {type === "post" ? (
            <InsertDriveFile
              sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
            />
          ) : (
            <ImageIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          )}
          <Typography variant="h6" gutterBottom>
            {type === "post" ? "拖拽 Markdown 文件到此处" : "拖拽图片到此处"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            或点击选择文件上传
          </Typography>
          <Button variant="outlined" startIcon={<CloudUpload />}>
            选择文件
          </Button>
        </motion.div>

        <input
          id={`file-input-${type}`}
          type="file"
          accept={type === "post" ? ".md" : "image/*"}
          onChange={handleFileInput}
          style={{ display: "none" }}
        />
      </Paper>

      {/* 文件信息和元数据编辑 */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">文件信息</Typography>
                <IconButton onClick={handleCancel} size="small">
                  <Close />
                </IconButton>
              </Box>

              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>文件名:</strong> {selectedFile.name}
                </Typography>
                <Typography variant="body2">
                  <strong>大小:</strong> {(selectedFile.size / 1024).toFixed(2)}{" "}
                  KB
                </Typography>
              </Box>

              {/* ✨ Grid2 改造：不再用 item 标识，直接用 size 属性掌控全局 */}
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="标题"
                    value={metadata.title}
                    onChange={(e) =>
                      setMetadata({ ...metadata, title: e.target.value })
                    }
                    required
                  />
                </Grid>

                {type === "post" ? (
                  <>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="摘要"
                        multiline
                        rows={2}
                        value={metadata.excerpt}
                        onChange={(e) =>
                          setMetadata({ ...metadata, excerpt: e.target.value })
                        }
                      />
                    </Grid>
                    {/* 响应式断点统一作为对象传入 size 属性 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="分类"
                        value={metadata.category}
                        onChange={(e) =>
                          setMetadata({ ...metadata, category: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="标签 (逗号分隔)"
                        value={metadata.tags}
                        onChange={(e) =>
                          setMetadata({ ...metadata, tags: e.target.value })
                        }
                        placeholder="React, TypeScript, Material Design"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="作者"
                        value={metadata.author}
                        onChange={(e) =>
                          setMetadata({ ...metadata, author: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="阅读时长"
                        value={metadata.readTime}
                        onChange={(e) =>
                          setMetadata({ ...metadata, readTime: e.target.value })
                        }
                        placeholder="5 分钟"
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="描述"
                        multiline
                        rows={2}
                        value={metadata.description}
                        onChange={(e) =>
                          setMetadata({
                            ...metadata,
                            description: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="分类"
                        value={metadata.category}
                        onChange={(e) =>
                          setMetadata({ ...metadata, category: e.target.value })
                        }
                        placeholder="设计, 技术, 生活"
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {uploading && <LinearProgress sx={{ mt: 2 }} />}

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleUpload}
                  disabled={uploading || !metadata.title}
                  startIcon={<CloudUpload />}
                >
                  {uploading ? "上传中..." : "上传"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={uploading}
                >
                  取消
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
