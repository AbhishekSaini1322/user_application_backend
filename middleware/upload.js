const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "items",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;




// 🔔 NOTE:
// I'm not using the below `multer.diskStorage()` configuration (for local uploads)
// because I'm using MongoDB Atlas (cloud database) in this project.

// ➤ Since MongoDB Atlas is a cloud-based service and does not support storing files directly,
// it's a better practice to upload images to a cloud file hosting service like Cloudinary.

// ➤ Cloudinary provides a public URL for each uploaded image, which I save in the MongoDB database.
// This keeps my database clean and efficient, and my app easily scalable.

// ✅ That's why I'm using `multer-storage-cloudinary` instead of saving files locally in an "uploads/" folder.




// const multer = require('multer');
// const path = require('path');

// // Helper function to derive extension from MIME type
// const getExtensionFromMimeType = (mimetype) => {
//   const mimeToExt = {
//     'image/jpeg': '.jpg',
//     'image/png': '.png',
//     'image/gif': '.gif',
//     // Add more MIME types and their corresponding extensions as needed
//   };
//   return mimeToExt[mimetype] || ''; // Default to empty string if MIME type is not mapped
// };

// // Set up storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Define the destination folder for uploads
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const extension = getExtensionFromMimeType(file.mimetype); // Derive extension from MIME type
//     cb(null, `${uniqueSuffix}${extension}`); // Save files with unique names including extensions
//   }
// });

// // Define allowed MIME types
// const allowedMimeTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif'];

// // Filter for allowed image uploads only
// const fileFilter = (req, file, cb) => {
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Only JPEG,JPG, PNG, and GIF images are allowed!'), false); // Reject the file
//   }
// };

// // Configure multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
// });

// module.exports = upload;
