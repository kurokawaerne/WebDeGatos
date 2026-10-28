const multer = require('multer');

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, TYPES.includes(file.mimetype)),
}).single('image');
