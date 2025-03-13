const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const multer = require('multer');
const path = require('path');
//const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const app = express();
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  // Looser Helmet settings for development
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
}

// Apply rate limiting
//const limiter = rateLimit({
//  windowMs: 15 * 60 * 1000, // 15 minutes
 // max: 100 // limit each IP to 100 requests per windowMs
//});
//app.use(limiter);

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Ensure the uploads folder exists (create it if missing)
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Folder for uploads
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp and original filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// === UPLOAD ENDPOINT ===
// This endpoint expects files under the key "image" (up to 5 files)
// It returns a single filePath when only one file is uploaded,
// or a files array when multiple files are sent.
app.post('/api/upload', upload.array('image', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      // Include "uploads/" in the returned path
      path: `uploads/${path.basename(file.path)}`
    }));
    if (uploadedFiles.length === 1) {
      // For single file upload, return a filePath property.
      res.status(200).json({ message: 'File uploaded successfully', filePath: uploadedFiles[0].path });
    } else {
      // For bulk upload, return the whole array.
      res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading files', 
      error: error.message,
      stack: error.stack
    });
  }
});


// Example validation endpoint (for demonstration)
app.post('/api/example', [
  body('username').isLength({ min: 5 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
});

// === MONGODB CONNECTION ===
const MONGO_URI = process.env.MONGO_URI
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Importing additional route files
const brandRoutes = require("./routes/brands");
const illustrationRoutes = require("./routes/illustrations");
const productRoutes = require("./routes/products");
const typefaceRoutes = require("./routes/typefaces");
const cartRoutes = require("./routes/cart");

app.use("/api/brands", brandRoutes);
app.use("/api/illustrations", illustrationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/typefaces", typefaceRoutes);
app.use(express.static("public"));
app.use("/api/cart", cartRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res, filePath, stat) => {
    res.set('Access-Control-Allow-Origin', allowedOrigins.join(', '));
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');
  }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.join(', '));
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
