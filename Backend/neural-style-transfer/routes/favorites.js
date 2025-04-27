const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite'); // Adjust the path to your model

const router = express.Router();

router.post('/delete-favorite', async (req, res) => {
    const { imagePath, userId } = req.body;
    console.log(`Request received for deleting favorite: imagePath=${imagePath}, userId=${userId}`);

    const imageName = path.basename(imagePath.replace(/\\/g, '/')); // Normalize to forward slashes
    const filePath = path.join(__dirname, '..', 'favorites', imageName);
    console.log(`Computed filePath: ${filePath}`);

    try {
        const objectId = new mongoose.Types.ObjectId(userId); // Ensure userId is an ObjectId
        console.log(userId)
        const normalizedImagePath = imagePath.replace(/\//g, '\\');
        console.log(`Normalized imagePath for query: ${normalizedImagePath}`);
        const favorite = await Favorite.findOneAndDelete({ imagePath: normalizedImagePath, userId: objectId });
        console.log(favorite)
        if (!favorite) {
            console.log('Favorite not found in the database');
            return res.status(404).json({ error: 'Favorite not found' });
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete image from favorites: ${err.message}`);
                return res.status(500).json({ error: 'Failed to delete image from favorites' });
            }
            res.json({ message: 'Image deleted from favorites' });
        });
    } catch (err) {
        console.error(`Failed to delete favorite image: ${err.message}`);
        res.status(500).json({ error: 'Failed to delete favorite image' });
    }
});

module.exports = router;
