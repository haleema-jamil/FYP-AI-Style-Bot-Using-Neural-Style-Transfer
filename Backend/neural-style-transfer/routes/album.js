const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Image = require('../models/Image'); // Use the Image model

const router = express.Router();

// Endpoint to get Album images for a specific user
router.get('/album/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const objectId = new mongoose.Types.ObjectId(userId); // Ensure userId is an ObjectId
        const images = await Image.find({ userId: objectId });

        // Ensure the paths use forward slashes for URLs
        res.json({ albumImages: images.map(image => image.imagePath.replace(/\\/g, '/')) });
    } catch (err) {
        console.error(`Failed to fetch album images: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch album images' });
    }
});

// Endpoint to delete image from Album for a specific user
router.post('/album/album-delete', async (req, res) => {
    const { imagePath, userId } = req.body;
    const imageName = path.basename(imagePath);
    const filePath = path.join(__dirname, '..', 'uploads', imageName);

    try {
        console.log("State gg")
        const objectId = new mongoose.Types.ObjectId(userId);
        console.log(objectId)
        console.log(imagePath)

        // Find and delete the image in the database
        const image = await Image.findOneAndDelete({ imagePath: imagePath, userId: objectId });
        console.log(image)
        if (!image) {
            return res.status(404).json({ error: 'Album image not found' });
        }

        // Delete the file from the uploads directory
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete image from album: ${err.message}`);
                return res.status(500).json({ error: 'Failed to delete image from album' });
            }
            res.json({ message: 'Image deleted from album' });
        });
    } catch (err) {
        console.error(`Failed to delete album image: ${err.message}`);
        res.status(500).json({ error: 'Failed to delete album image' });
    }
});


module.exports = router;
