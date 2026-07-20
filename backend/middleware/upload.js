import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedImageTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"));
  },
});

export default upload;
