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

type Metadata = {
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  date: string;
  readTime: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  description: string;
};

const emptyMetadata = (): Metadata => ({
  title: "",
  excerpt: "",
  category: "",
  tags: "",
  date: new Date().toISOString().split("T")[0],
  readTime: "",
  coverImage: "",
  author: {
    name: "",
    avatar: "",
  },
  description: "",
});

export default function FileUpload({ type, onUploadSuccess }: FileUploadProps) {
  const theme = useTheme();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState<Metadata>(emptyMetadata());

  const reset = () => {
    setSelectedFile(null);
    setMetadata(emptyMetadata());
  };

  const safe = (v: any) => (v === undefined || v === null ? "" : v);

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
    if (files.length > 0) handleFileSelect(files[0]);
  }, []);

  const handleFileSelect = (file: File) => {
    const ok =
      type === "post"
        ? file.name.endsWith(".md")
        : file.type.startsWith("image/");

    if (!ok) {
      toast.error(type === "post" ? "请选择 Markdown" : "请选择图片");
      return;
    }

    setSelectedFile(file);

    setMetadata((prev) => ({
      ...prev,
      title: file.name.replace(/\.(md|jpg|jpeg|png|webp)$/i, ""),
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("请选择文件");

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      // 🔥 防炸关键：全部 safe()
      formData.append("title", safe(metadata.title));
      formData.append("excerpt", safe(metadata.excerpt));
      formData.append("category", safe(metadata.category));
      formData.append("tags", safe(metadata.tags));
      formData.append("date", safe(metadata.date));
      formData.append("readTime", safe(metadata.readTime));
      formData.append("coverImage", safe(metadata.coverImage));

      formData.append("authorName", safe(metadata.author?.name));
      formData.append("authorAvatar", safe(metadata.author?.avatar));

      if (type === "gallery") {
        formData.append("description", safe(metadata.description));
      }

      const endpoint =
        type === "post" ? "/api/posts/upload" : "/api/gallery/upload";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "上传失败");
        return;
      }

      toast.success("上传成功");
      reset();
      onUploadSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("上传失败（后端异常）");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => reset();

  return (
    <Box>
      {/* 上传区 */}
      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-${type}`)?.click()}
        sx={{
          p: 4,
          textAlign: "center",
          border: `2px dashed ${
            isDragging ? theme.palette.primary.main : theme.palette.divider
          }`,
          backgroundColor: isDragging
            ? alpha(theme.palette.primary.main, 0.05)
            : "transparent",
          cursor: "pointer",
        }}
      >
        {type === "post" ? (
          <InsertDriveFile sx={{ fontSize: 60 }} />
        ) : (
          <ImageIcon sx={{ fontSize: 60 }} />
        )}

        <Typography sx={{ mt: 1 }}>
          {type === "post" ? "拖拽 Markdown" : "拖拽图片"}
        </Typography>

        <input
          id={`file-${type}`}
          type="file"
          hidden
          accept={type === "post" ? ".md" : "image/*"}
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
        />
      </Paper>

      {/* 表单 */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
          >
            <Paper sx={{ mt: 2, p: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography>编辑元数据</Typography>
                <IconButton onClick={handleCancel}>
                  <Close />
                </IconButton>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="标题"
                    value={metadata.title}
                    onChange={(e) =>
                      setMetadata({ ...metadata, title: e.target.value })
                    }
                  />
                </Grid>

                {type === "post" && (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="封面图 URL"
                      value={metadata.coverImage}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          coverImage: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="分类"
                    value={metadata.category}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        category: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="标签"
                    value={metadata.tags}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        tags: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="作者"
                    value={metadata.author.name}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        author: {
                          ...metadata.author,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="作者头像"
                    value={metadata.author.avatar}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        author: {
                          ...metadata.author,
                          avatar: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>

                {type === "post" && (
                  <>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="摘要"
                        value={metadata.excerpt}
                        onChange={(e) =>
                          setMetadata({
                            ...metadata,
                            excerpt: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="阅读时间"
                        value={metadata.readTime}
                        onChange={(e) =>
                          setMetadata({
                            ...metadata,
                            readTime: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </>
                )}

                {type === "gallery" && (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="描述"
                      value={metadata.description}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          description: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}
              </Grid>

              {uploading && <LinearProgress sx={{ mt: 2 }} />}

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button onClick={handleCancel}>取消</Button>
                <Button variant="contained" fullWidth onClick={handleUpload}>
                  上传
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
