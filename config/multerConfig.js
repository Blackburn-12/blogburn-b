// multerConfig.js
import multer from 'multer';

// Set storage to memory
const storage = multer.memoryStorage();

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(
    file.originalname.toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

export default upload;
