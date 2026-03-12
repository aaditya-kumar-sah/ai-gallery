import express from 'express';
import multer from 'multer';
import path from 'path';
import Image from '../models/Image.js';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST endpoint for image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const newImage = new Image({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET endpoint to fetch all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });
    res.status(200).json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// POST endpoint to generate AI description for a given image
router.post('/describe/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Initialize Gemini AI
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in environment' });
    }
    
    // Convert relative path to absolute file path for Gemini SDK
    const fullPath = path.join(__dirname, '../', image.path);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Read the file entirely into memory as Base64
    const fileBytes = await import('fs').then(fs => fs.promises.readFile(fullPath));

    const promptText = "Write a highly detailed image generation prompt describing this image, such that if this prompt were given to Midjourney or DALL-E, it would recreate this exact image. Focus on the subject, lighting, colors, style, texture, and mood. Provide only the prompt text.";
    
    // Get correct mime type dynamically or default to jpeg
    const mimeType = image.filename.toLowerCase().endsWith('.png') ? 'image/png' : 
                     image.filename.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                data: fileBytes.toString("base64"),
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    const descriptionText = response.text;
    
    // Save generated description to the DB for caching
    image.aiDescription = descriptionText;
    await image.save();

    res.status(200).json({ description: descriptionText, image });
  } catch (err) {
    console.error('Error describing image:', err);
    console.error('Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    res.status(500).json({ error: 'Failed to generate AI description. Make sure GOOGLE_API_KEY is set and valid.' });
  }
});

// DELETE endpoint to remove an image
router.delete('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the file from the filesystem using the exact path it was saved to
    const fullPath = path.join(__dirname, '../', image.path);
    import('fs').then(fs => {
      fs.unlink(fullPath, (err) => {
        if (err && err.code !== 'ENOENT') {
           console.error('Error deleting file:', err);
        }
      });
    });

    // Delete the document from the database
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
