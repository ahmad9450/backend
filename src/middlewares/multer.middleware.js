import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  './public/temp'); // Ensure this path exists
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using crypto
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

// Initialize multer with storage
const upload = multer({ storage: storage });

export default upload;