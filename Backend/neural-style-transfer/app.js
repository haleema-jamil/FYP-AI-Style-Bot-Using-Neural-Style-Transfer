const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const authRoutes = require('./routes/auth'); // Import auth routes
const Image = require('./models/Image'); // Import the Image model
const Favorite = require('./models/Favorite'); // Import the Favorite model
const favoriteRoutes = require('./routes/favorites'); // Import favorite routes
const albumRoutes = require('./routes/album'); // Import favorite routes

const app = express();

// MongoDB connection
const mongoURI = 'mongodb+srv://marwafyp2024:ZMv53tce856lvGgx@cluster0.e5qzpva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the uploads, favorites, and designs directories exist
const uploadDir = path.join(__dirname, 'uploads');
const favoritesDir = path.join(__dirname, 'favorites');
const designsDir = path.join(__dirname, 'designs');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(favoritesDir)) {
  fs.mkdirSync(favoritesDir);
}

if (!fs.existsSync(designsDir)) {
  fs.mkdirSync(designsDir);
}

// Serve static files from the uploads, favorites, and designs directories
app.use('/uploads', express.static(uploadDir));
app.use('/favorites', express.static(favoritesDir));
app.use('/designs', express.static(designsDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const designStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'designs/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const designUpload = multer({ storage: designStorage });

//getting data from front end and applying model
app.post('/upload', upload.fields([{ name: 'content_image' }, { name: 'style_image' }]), (req, res) => {
    const contentImagePath = req.files['content_image'][0].path;
    const styleImagePath = req.files['style_image'][0].path;
    const alpha = req.body.alpha || 0.5;
    const selectedColor = req.body.selected_color || '#ff0000';
    const numImages = parseInt(req.body.num_images, 10) || 4; // Default to 4 images if not specified
    const userId = req.body.user_id; // Extract userId from request body
  
    const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
    const pythonProcess = spawn(pythonExecutable, ['neural_style_transfer.py', contentImagePath, styleImagePath, alpha, selectedColor, numImages]);
  
    let stdoutData = '';
  
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Failed to process image' });
      }
  
      try {
        const outputData = JSON.parse(stdoutData.trim());
  
        // Save each generated image to MongoDB with userId
        const savePromises = outputData.map(imageData => {
          const newImage = new Image({
            imagePath: imageData.image_path,
            similarity: imageData.similarity,
            userId: userId // Save the userId
          });
          return newImage.save();
        });
  
        await Promise.all(savePromises);
  
        res.json({ images: outputData });
      } catch (error) {
        console.error('Error parsing output data:', error);
        res.status(500).json({ error: 'Failed to parse image data' });
      }
    });
  });
  

// Endpoint to upload design images
app.post('/upload-design', designUpload.single('design_image'), (req, res) => {
  const imagePath = `/designs/${req.file.filename}`;
  res.json({ imagePath });
});

// Endpoint to get design images
app.get('/designs', (req, res) => {
  fs.readdir(designsDir, (err, files) => {
    if (err) {
      console.error(`Failed to read designs directory: ${err.message}`);
      return res.status(500).json({ error: 'Failed to retrieve design images' });
    }
    const designImages = files.map(file => `/designs/${file}`);
    res.json({ designImages });
  });
});

app.post('/add-favorite', async (req, res) => {
    const { imagePath, userId } = req.body;
    console.log('Request body:', req.body); // Log request body for debugging

    try {
        // Extract the image filename from the imagePath
        const imageName = path.basename(new URL(imagePath).pathname);
        console.log(imageName);

        // Define the source path and the destination path
        const sourcePath = path.join(__dirname, 'uploads', imageName); // Assuming the uploaded images are stored in an 'uploads' folder
        console.log('Source Path:', sourcePath);
        const destPath = path.join(__dirname, 'favorites', imageName); // Assuming you want to copy the image to a 'favorites' folder
        console.log('Destination Path:', destPath);

        console.log('UserId:', userId); // Log userId for debugging

        // Check if the favorite already exists
        const existingFavorite = await Favorite.findOne({ imagePath: path.join('favorites', imageName), userId });

        if (existingFavorite) {
            console.log('Favorite already exists, updating the existing one.');

            // Copy the image file to the favorites directory
            fs.copyFile(sourcePath, destPath, async (err) => {
                if (err) {
                    console.error(`Failed to copy image to favorites: ${err.message}`);
                    return res.status(500).json({ error: 'Failed to update favorite image' });
                }

                // Update the existing favorite entry
                existingFavorite.imagePath = path.join('favorites', imageName);
                await existingFavorite.save();
                res.json({ message: 'Favorite image updated successfully' });
            });
        } else {
            // Copy the image file to the favorites directory
            fs.copyFile(sourcePath, destPath, async (err) => {
                if (err) {
                    console.error(`Failed to copy image to favorites: ${err.message}`);
                    return res.status(500).json({ error: 'Failed to add image to favorites' });
                }

                // Create a new favorite entry
                const relativePath = path.join('favorites', imageName); // Relative path to save in the database
                const newFavorite = new Favorite({ imagePath: relativePath, userId });
                await newFavorite.save();
                res.json({ message: 'Image added to favorites' });
            });
        }
    } catch (err) {
        console.error(`Failed to save favorite image: ${err.message}`);
        res.status(500).json({ error: 'Failed to add image to favorites' });
    }
});


app.get('/favorites/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const objectId = new mongoose.Types.ObjectId(userId); // Ensure userId is an ObjectId
        const favorites = await Favorite.find({ userId: objectId });

        // Ensure the paths use forward slashes for URLs
        res.json({ favoriteImages: favorites.map(fav => fav.imagePath.replace(/\\/g, '/')) });
    } catch (err) {
        console.error(`Failed to fetch favorite images: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch favorite images' });
    }
});

app.use('/api', favoriteRoutes); // Use favorite routes with /api prefix

app.use('/api', albumRoutes); // Use favorite routes with /api prefix



// // Endpoint to get Album images
// app.get('/album', (req, res) => {
//   fs.readdir(uploadDir, (err, files) => {
//     if (err) {
//       console.error(`Failed to read uploads directory: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to retrieve album images' });
//     }
//     const AlbumImages = files.map(file => `/uploads/${file}`);
//     res.json({ AlbumImages });
//   });
// });

// // Endpoint to delete image from Album
// app.post('/delete-album', (req, res) => {
//   const { imagePath } = req.body;
//   const imageName = path.basename(imagePath);
//   const filePath = path.join(uploadDir, imageName);

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error(`Failed to delete image from album: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to delete image from album' });
//     }
//     res.json({ message: 'Image deleted from album' });
//   });
// });

// Endpoint to delete image from designs
app.post('/delete-design', (req, res) => {
  const { imagePath } = req.body;
  const imageName = path.basename(imagePath);
  const filePath = path.join(designsDir, imageName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete image from designs: ${err.message}`);
      return res.status(500).json({ error: 'Failed to delete image from designs' });
    }
    res.json({ message: 'Image deleted from designs' });
  });
});

// Use auth routes
app.use('/auth', authRoutes);

module.exports = app;
