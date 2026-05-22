import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Card,
  Grid,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Article, Photo, Delete, Edit, Refresh } from "@mui/icons-material";
import { toast } from "sonner";
import FileUpload from "./FileUpload";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    type: "post" | "gallery";
    item: any;
  }>({
    open: false,
    type: "post",
    item: null,
  });

  const API_BASE = "/api";

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/posts`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      toast.error("无法连接到本地管理后端");
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/gallery`);
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      toast.error("无法连接到本地管理后端");
      console.error("Fetch images error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: "post" | "gallery", identifier: string) => {
    if (!confirm(`确定要删除这个${type === "post" ? "文章" : "图片"}吗？`)) {
      return;
    }

    try {
      const endpoint =
        type === "post"
          ? `${API_BASE}/posts/${identifier}`
          : `${API_BASE}/gallery/${identifier}`;

      const response = await fetch(endpoint, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        if (type === "post") {
          fetchPosts();
        } else {
          fetchImages();
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("删除失败");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (type: "post" | "gallery", item: any) => {
    const clonedItem = JSON.parse(JSON.stringify(item));
    if (type === "post" && !clonedItem.metadata) {
      clonedItem.metadata = {};
    }
    setEditDialog({ open: true, type, item: clonedItem });
  };

  const handleUpdate = async () => {
    const { type, item } = editDialog;

    try {
      const endpoint =
        type === "post"
          ? `${API_BASE}/posts/${item.slug}`
          : `${API_BASE}/gallery/${item.filename}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === "post" ? item.metadata : item),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEditDialog({ open: false, type: "post", item: null });
        if (type === "post") {
          fetchPosts();
        } else {
          fetchImages();
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("更新失败");
      console.error("Update error:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchImages();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          博客本地管理控制台
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          💡 当前工作空间: <code>admin-src</code>
          {"(独立开发模式)"}
          此模块仅用于内部开发与调试，所有代码与数据不会参与线上 Docs 生产构建。
        </Alert>
      </Box>

      <Paper elevation={0}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<Article />} label="文章管理" />
          <Tab icon={<Photo />} label="图库管理" />
        </Tabs>

        {/* 文章管理 */}
        <TabPanel value={tabValue} index={0}>
          <FileUpload type="post" onUploadSuccess={fetchPosts} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Typography variant="h6">已解析文章 ({posts.length})</Typography>
            <Button
              startIcon={<Refresh />}
              onClick={fetchPosts}
              disabled={loading}
            >
              刷新
            </Button>
          </Box>

          {/* ✨ Grid2 改造：不再声明 container，直接用 spacing 即可，也不再有 item 子项属性 */}
          <Grid container spacing={2}>
            {posts.map((post) => (
              // 在 Grid2 中，全宽直接使用 size={12}
              <Grid size={12} key={post.slug}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {post.metadata?.title || post.filename}
                        </Typography>
                        {post.metadata?.excerpt && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {post.metadata.excerpt}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mt: 1,
                          }}
                        >
                          {post.metadata?.category && (
                            <Chip
                              label={post.metadata.category}
                              size="small"
                              color="primary"
                            />
                          )}
                          {post.metadata?.tags &&
                            Array.isArray(post.metadata.tags) &&
                            post.metadata.tags.map((tag: string) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          相对路径: src/posts/{post.filename} · 变更时间:{" "}
                          {new Date(post.modifiedAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleEdit("post", post)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete("post", post.slug)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {posts.length === 0 && !loading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                还没有扫描到本地文章，拖拽一个 .md 文件开始吧
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* 图库管理 */}
        <TabPanel value={tabValue} index={1}>
          <FileUpload type="gallery" onUploadSuccess={fetchImages} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Typography variant="h6">本地图库资源 ({images.length})</Typography>
            <Button
              startIcon={<Refresh />}
              onClick={fetchImages}
              disabled={loading}
            >
              刷新
            </Button>
          </Box>

          {/* ✨ Grid2 改造：多列卡片响应式布局 */}
          <Grid container spacing={2}>
            {images.map((image) => (
              // 旧写法：xs={12} sm={6} md={4} item
              // 新写法：移除了 item 标识，响应式断点统一整合进独立的 size 属性对象中
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.filename}>
                <Card variant="outlined">
                  <Box
                    component="img"
                    src={image.url}
                    alt={image.title}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {image.title}
                    </Typography>
                    {image.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {image.description}
                      </Typography>
                    )}
                    {image.category && (
                      <Chip
                        label={image.category}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {(image.size / 1024).toFixed(2)} KB
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit("gallery", image)}
                        fullWidth
                      >
                        编辑元数据
                      </Button>
                      <IconButton
                        onClick={() => handleDelete("gallery", image.filename)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {images.length === 0 && !loading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                暂无图片，可在文章中直接拖入或上传
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* 编辑对话框 */}
      {/* 编辑对话框 */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ ...editDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          修饰{editDialog.type === "post" ? "文章" : "图片"}元数据
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* 公共字段：标题 */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="标题"
                  value={
                    editDialog.item?.metadata?.title ||
                    editDialog.item?.title ||
                    ""
                  }
                  onChange={(e) => {
                    const newItem = { ...editDialog.item };
                    if (newItem.metadata) {
                      newItem.metadata.title = e.target.value;
                    } else {
                      newItem.title = e.target.value;
                    }
                    setEditDialog({ ...editDialog, item: newItem });
                  }}
                />
              </Grid>

              {/* 文章专属字段 */}
              {editDialog.type === "post" ? (
                <>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="封面图 URL (Cover Image)"
                      value={editDialog.item?.metadata?.coverImage || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        newItem.metadata.coverImage = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="文章摘要 (Excerpt)"
                      multiline
                      rows={2}
                      value={editDialog.item?.metadata?.excerpt || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        newItem.metadata.excerpt = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="分类 (Category)"
                      value={editDialog.item?.metadata?.category || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        newItem.metadata.category = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="标签 (Tags, 逗号或空格隔开)"
                      value={
                        Array.isArray(editDialog.item?.metadata?.tags)
                          ? editDialog.item.metadata.tags.join(", ")
                          : editDialog.item?.metadata?.tags || ""
                      }
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        // 如果后端需要数组，这里转为数组；如果需要字符串，直接传 e.target.value
                        newItem.metadata.tags = e.target.value
                          .split(/[,，\s]+/)
                          .filter(Boolean);
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="作者 (Author Name)"
                      value={
                        editDialog.item?.metadata?.author?.name ||
                        editDialog.item?.metadata?.author ||
                        ""
                      }
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        if (typeof newItem.metadata.author === "object") {
                          newItem.metadata.author.name = e.target.value;
                        } else {
                          newItem.metadata.author = {
                            name: e.target.value,
                            avatar: "",
                          };
                        }
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="作者头像 URL (Avatar)"
                      value={editDialog.item?.metadata?.author?.avatar || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        if (typeof newItem.metadata.author === "object") {
                          newItem.metadata.author.avatar = e.target.value;
                        } else {
                          newItem.metadata.author = {
                            name: "",
                            avatar: e.target.value,
                          };
                        }
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="发布日期 (Date)"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={
                        editDialog.item?.metadata?.date
                          ? editDialog.item.metadata.date.split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        newItem.metadata.date = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="阅读时间 (Read Time)"
                      value={editDialog.item?.metadata?.readTime || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        if (!newItem.metadata) newItem.metadata = {};
                        newItem.metadata.readTime = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>
                </>
              ) : (
                /* 图片专属字段 */
                <>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="图片描述"
                      multiline
                      rows={2}
                      value={editDialog.item?.description || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        newItem.description = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="图库分类"
                      value={editDialog.item?.category || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        newItem.category = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="标签 (Tags, 逗号隔开)"
                      value={editDialog.item?.tags || ""}
                      onChange={(e) => {
                        const newItem = { ...editDialog.item };
                        newItem.tags = e.target.value;
                        setEditDialog({ ...editDialog, item: newItem });
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ ...editDialog, open: false })}>
            放弃
          </Button>
          <Button onClick={handleUpdate} variant="contained">
            同步本地
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
