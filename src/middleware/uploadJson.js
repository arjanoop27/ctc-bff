const multer = require('multer');

// Store file in memory (safer + simpler for prototype)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
  fileFilter: (req, file, cb) => {
    const isJson =
      file.mimetype === 'application/json' ||
      file.mimetype === 'text/json' ||
      file.originalname.toLowerCase().endsWith('.json');

    if (!isJson) {
      return cb(new Error('Only .json files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = upload;
