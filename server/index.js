import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const ROOT = path.resolve(__dirname, "..");

const POSTS_DIR = path.join(ROOT, "public/posts");
const GALLERY_DIR = path.join(ROOT, "public/gallery");
const GALLERY_META = path.join(GALLERY_DIR, ".gallery.json");

await fs.ensureDir(POSTS_DIR);
await fs.ensureDir(GALLERY_DIR);


/* =========================
   multer
========================= */

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const target =
        req.path.includes("gallery") ? GALLERY_DIR : POSTS_DIR;

      cb(null, target);
    },

    filename(req, file, cb) {
      // ✅ 修复中文文件名乱码：Latin-1 → UTF-8 重新解码
      const fixed = Buffer.from(file.originalname, "latin1").toString("utf8");
      cb(null, fixed);
    },
  }),
});

/* =========================
   上传文章
========================= */

app.post("/api/posts/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "未上传文件",
      });
    }

    // ✅ 修复：从正确的字段名读取，并重组 author 对象
    const {
      title,
      excerpt,
      category,
      tags,
      date,
      readTime,
      coverImage,
      authorName,   // FileUpload 发送的是 authorName
      authorAvatar, // FileUpload 发送的是 authorAvatar
    } = req.body;

    const filepath = path.join(POSTS_DIR, req.file.filename);

    const raw = await fs.readFile(filepath, "utf-8");

    // ✅ 修复：所有字段提供默认值，避免 undefined 导致 matter.stringify 报错
    const metadata = {
      title:      title      || "",
      excerpt:    excerpt    || "",
      category:   category   || "",
      tags:       tags ? tags.split(",").map((t) => t.trim()) : [],
      date:       date       || new Date().toISOString(),
      readTime:   readTime   || "",
      coverImage: coverImage || "",
      author: {
        name:   authorName   || "",
        avatar: authorAvatar || "",
      },
    };

    const content = matter.stringify(raw, metadata);

    await fs.writeFile(filepath, content);

    res.json({
      success: true,
      message: "文章上传成功",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   获取文章
========================= */

app.get("/api/posts", async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);

    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".md"))
        .map(async (file) => {
          const filepath = path.join(POSTS_DIR, file);

          const raw = await fs.readFile(filepath, "utf-8");

          const parsed = matter(raw);

          const stat = await fs.stat(filepath);

          return {
            filename: file,
            slug: slugify(file.replace(".md", ""), {
              lower: true,
            }),
            metadata: parsed.data,
            modifiedAt: stat.mtime,
          };
        })
    );

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   删除文章
========================= */

app.delete("/api/posts/:slug", async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);

    const target = files.find((f) => {
      const slug = slugify(f.replace(".md", ""), {
        lower: true,
      });

      return slug === req.params.slug;
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        error: "文章不存在",
      });
    }

    await fs.remove(path.join(POSTS_DIR, target));

    res.json({
      success: true,
      message: "文章已删除",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   更新文章元数据
========================= */

app.put("/api/posts/:slug", async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);

    const target = files.find((f) => {
      const slug = slugify(f.replace(".md", ""), {
        lower: true,
      });

      return slug === req.params.slug;
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        error: "文章不存在",
      });
    }

    const filepath = path.join(POSTS_DIR, target);

    const raw = await fs.readFile(filepath, "utf-8");

    const parsed = matter(raw);

    const content = matter.stringify(parsed.content, req.body);

    await fs.writeFile(filepath, content);

    res.json({
      success: true,
      message: "文章元数据已更新",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   上传图片
========================= */

app.post("/api/gallery/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "未上传图片",
      });
    }

    let metadata = [];

    if (await fs.pathExists(GALLERY_META)) {
      metadata = await fs.readJson(GALLERY_META);
    }

    metadata.push({
      filename: req.file.filename,
      title,
      description,
      category,
      size: req.file.size,
      url: `/gallery/${req.file.filename}`,
      createdAt: new Date().toISOString(),
    });

    await fs.writeJson(GALLERY_META, metadata, {
      spaces: 2,
    });

    res.json({
      success: true,
      message: "图片上传成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   获取图库
========================= */

app.get("/api/gallery", async (req, res) => {
  try {

    if (!(await fs.pathExists(GALLERY_META))) {
      return res.json({
        success: true,
        images: [],
      });
    }

    const images = await fs.readJson(GALLERY_META);

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   删除图片
========================= */

app.delete("/api/gallery/:filename", async (req, res) => {
  try {

    let images = [];

    if (await fs.pathExists(GALLERY_META)) {
      images = await fs.readJson(GALLERY_META);
    }

    const target = images.find(
      (img) => img.filename === req.params.filename
    );

    if (!target) {
      return res.status(404).json({
        success: false,
        error: "图片不存在",
      });
    }

    await fs.remove(path.join(GALLERY_DIR, target.filename));

    images = images.filter(
      (img) => img.filename !== req.params.filename
    );

    await fs.writeJson(GALLERY_META, images, {
      spaces: 2,
    });

    res.json({
      success: true,
      message: "图片已删除",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   更新图片元数据
========================= */

app.put("/api/gallery/:filename", async (req, res) => {
  try {

    let images = [];

    if (await fs.pathExists(GALLERY_META)) {
      images = await fs.readJson(GALLERY_META);
    }

    const index = images.findIndex(
      (img) => img.filename === req.params.filename
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "图片不存在",
      });
    }

    images[index] = {
      ...images[index],
      ...req.body,
    };

    await fs.writeJson(GALLERY_META, images, {
      spaces: 2,
    });

    res.json({
      success: true,
      message: "图片信息已更新",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("后台运行：http://localhost:3001");
});
