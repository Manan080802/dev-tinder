const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // fallback name if req.body is not ready yet
    let customName = "profile";

    if (req.body && req.body.firstName) {
      customName = req.body.firstName.toLowerCase().replace(/\s+/g, "-");
    }

    // Example: manan-1693939292021.png
    cb(null, `${customName}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
});

module.exports = upload;
