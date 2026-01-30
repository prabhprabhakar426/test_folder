const multer = require('multer');
const fs = require('fs');
const path = require('path');

const BASE_UPLOAD_DIR = path.join(__dirname,'..', 'uploads');

// helper: create folder if not exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  // choose directory dynamically
  destination: function (req, file, cb) {
    let folderName;

    // decide folder based on request
    if (req.baseUrl.includes('user')) {
      folderName = 'profilephotos';
    } else if (req.baseUrl.includes('inventory')) {
      folderName = 'productphotos';
    } else {
      folderName = 'others';
    }

    const uploadPath = path.join(BASE_UPLOAD_DIR, folderName);
    ensureDir(uploadPath);

    cb(null, uploadPath);
  },

  // custom filename
  filename: function (req, file, cb) {
    cb(null, `productImage_${Date.now()}${path.extname(file.originalname)}`);
  }
});



const upload = multer({ storage });

module.exports = upload;
