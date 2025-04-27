const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  similarity: { type: Number, required: true },
  userId: { type: String, required: true }, // Add userId field
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
