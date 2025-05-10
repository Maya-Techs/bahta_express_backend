const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.mimetype.startsWith("image/")) {
      if (file.fieldname === "blog_image") {
        uploadPath = path.join(__dirname, "../public/uploads/images/blog");
      } else if (file.fieldname === "portfolio_image") {
        uploadPath = path.join(__dirname, "../public/uploads/images/portfolio");
      } else if (file.fieldname === "client_logo") {
        uploadPath = path.join(
          __dirname,
          "../public/uploads/images/ClientLogos"
        );
      }
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const imageTypes = /jpeg|jpg|png/; // Excluding GIF

  const isImage =
    imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    imageTypes.test(file.mimetype);

  if (!isImage) {
    return cb(
      new Error("Only image files (JPEG, JPG, PNG) are allowed!"),
      false
    );
  }

  cb(null, true);
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "blog_image", maxCount: 1 },
  { name: "portfolio_image", maxCount: 1 },
  { name: "client_logo", maxCount: 1 }, // Handling client logo uploads
]);

module.exports = upload;
