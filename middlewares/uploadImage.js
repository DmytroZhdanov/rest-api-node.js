// Multer middleware configuration for uploading images
const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
});

const uploadImage = multer({
  storage: multerConfig,
});

module.exports = uploadImage;
