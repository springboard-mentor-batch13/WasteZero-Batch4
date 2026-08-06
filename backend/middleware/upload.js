import multer from "multer";

const storage = multer.memoryStorage();
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WebP, and GIF uploads are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
