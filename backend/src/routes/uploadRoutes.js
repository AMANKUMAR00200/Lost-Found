const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

console.log("Cloud Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  secretLoaded: !!process.env.CLOUDINARY_API_SECRET,
});

// ==============================
// Image Upload
// ==============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("========== IMAGE UPLOAD ==========");
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64);

    console.log("UPLOAD SUCCESS:", result.secure_url);

    return res.json({
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.log("========== CLOUDINARY ERROR ==========");
    console.dir(error, { depth: null });

    console.log("Message:", error.message);
    console.log("Name:", error.name);
    console.log("HTTP Code:", error.http_code);

    return res.status(500).json({
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
  }
});

// ==============================
// Voice Upload
// ==============================
router.post("/voice", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No audio uploaded",
      });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "voice_messages",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.json({
      audioUrl: result.secure_url,
    });

  } catch (error) {
    console.log("VOICE ERROR:");
    console.dir(error, { depth: null });

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;