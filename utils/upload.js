const fs = require("fs");
const path = require("path");

function deleteFile(relativePath) {
  return new Promise((resolve, reject) => {
    const fullFilePath = path.join(
      __dirname,
      "../public/uploads/images",
      relativePath
    );

    fs.access(fullFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.warn(`File not found: ${fullFilePath}`);
          resolve();
        } else {
          reject(err);
        }
      } else {
        fs.unlink(fullFilePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

module.exports = {
  deleteFile,
};
