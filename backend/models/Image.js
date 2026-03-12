import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  aiDescription: {
    type: String,
  }
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
