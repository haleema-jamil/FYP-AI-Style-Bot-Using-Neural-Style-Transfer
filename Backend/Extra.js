// import sys
// import tensorflow as tf
// import tensorflow_hub as hub
// import random
// import json
// import numpy as np
// from skimage.metrics import structural_similarity as ssim

// def crop_center(image):
//     shape = image.shape
//     new_shape = min(shape[1], shape[2])
//     offset_y = max(shape[1] - shape[2], 0) // 2
//     offset_x = max(shape[2] - shape[1], 0) // 2
//     image = tf.image.crop_to_bounding_box(image, offset_y, offset_x, new_shape, new_shape)
//     return image

// def load_image(image_path, image_size=(256, 256), preserve_aspect_ratio=True):
//     img = tf.io.decode_image(tf.io.read_file(image_path), channels=3, dtype=tf.float32)[tf.newaxis, ...]
//     img = crop_center(img)
//     img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)
//     return img

// def random_transform(image):
//     image = tf.image.random_flip_left_right(image)
//     image = tf.image.random_flip_up_down(image)
//     angles = [0, 90, 180, 270]
//     angle = random.choice(angles)
//     image = tf.image.rot90(image, k=angle // 90)
//     return image

// def random_scaling(image):
//     scale = random.uniform(0.8, 1.2)
//     return tf.image.resize(image, (int(image.shape[1] * scale), int(image.shape[2] * scale)))

// def random_brightness(image):
//     return tf.image.random_brightness(image, max_delta=0.3)

// def output_random_number(min_value=1, max_value=10000000):
//     return random.randint(min_value, max_value)

// def is_valid_color_hex(color_hex):
//     if not color_hex or len(color_hex) != 7 or color_hex[0] != '#':
//         return False
//     try:
//         int(color_hex[1:], 16)
//         return True
//     except ValueError:
//         return False

// def apply_color_filter(image, color_hex):
//     color_rgb = [int(color_hex[i:i+2], 16) / 255.0 for i in (1, 3, 5)]
//     color_rgb = tf.constant(color_rgb, shape=[1, 1, 1, 3], dtype=tf.float32)
//     color_mask = tf.ones_like(image) * color_rgb
//     return image * color_mask

// def stylize_image(content_image, style_image, preserve_color=True, color_hex=None):
//     hub_handle = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
//     hub_module = hub.load(hub_handle)
//     stylized_image = hub_module(tf.constant(content_image), tf.constant(style_image))[0]
//     if preserve_color:
//         stylized_image = tf.image.adjust_hue(stylized_image, 0.1)
//     if is_valid_color_hex(color_hex):
//         stylized_image = apply_color_filter(stylized_image, color_hex)
//     return stylized_image

// def calculate_similarity(image1, image2):
//     image1_np = image1.numpy().squeeze()
//     image2_np = image2.numpy().squeeze()
//     similarity_score, _ = ssim(image1_np, image2_np, full=True, multichannel=True, win_size=3, channel_axis=-1, data_range=image1_np.max() - image1_np.min())
//     return similarity_score * 100  # Convert to percentage

// if __name__ == "__main__":
//     content_image_path = sys.argv[1]
//     style_image_path = sys.argv[2]
//     color_hex = sys.argv[3] if len(sys.argv) > 3 else None
//     num_images = int(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4].isdigit() else 4

//     content_image = load_image(content_image_path, (384, 384))
//     style_image = load_image(style_image_path, (256, 256))
//     style_image = tf.nn.avg_pool(style_image, ksize=[3, 3], strides=[1, 1], padding='SAME')

//     output_images = []

//     for i in range(num_images):
//         transformed_style_image = random_transform(style_image)
//         transformed_style_image = random_scaling(transformed_style_image)
//         transformed_style_image = random_brightness(transformed_style_image)
//         stylized_image = stylize_image(content_image, transformed_style_image, color_hex=color_hex)
//         similarity_score = calculate_similarity(content_image, stylized_image)
//         random_number = output_random_number()
//         output_image_path = f'uploads/output_{i + random_number + 1}.png'
//         tf.keras.preprocessing.image.save_img(output_image_path, stylized_image[0])
//         output_images.append({'image_path': output_image_path, 'similarity': similarity_score})

//     print(json.dumps(output_images))


// app.js

// const express = require('express');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { spawn } = require('child_process');
// const authRoutes = require('./routes/auth'); // Import auth routes

// const app = express();

// // MongoDB connection
// const mongoURI = 'mongodb+srv://marwafyp2024:ZMv53tce856lvGgx@cluster0.e5qzpva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Ensure the uploads, favorites, and designs directories exist
// const uploadDir = path.join(__dirname, 'uploads');
// const favoritesDir = path.join(__dirname, 'favorites');
// const designsDir = path.join(__dirname, 'designs');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// if (!fs.existsSync(favoritesDir)) {
//   fs.mkdirSync(favoritesDir);
// }

// if (!fs.existsSync(designsDir)) {
//   fs.mkdirSync(designsDir);
// }

// // Serve static files from the uploads, favorites, and designs directories
// app.use('/uploads', express.static(uploadDir));
// app.use('/favorites', express.static(favoritesDir));
// app.use('/designs', express.static(designsDir));

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const designStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'designs/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage });
// const designUpload = multer({ storage: designStorage });

// app.post('/upload', upload.fields([{ name: 'content_image' }, { name: 'style_image' }]), (req, res) => {
//     const contentImagePath = req.files['content_image'][0].path;
//     const styleImagePath = req.files['style_image'][0].path;
//     const selectedColor = req.body.selected_color || '#ff0000';
//     const numImages = parseInt(req.body.num_images, 10) || 4; // Default to 4 images if not specified
  
//     const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
//     const pythonProcess = spawn(pythonExecutable, ['neural_style_transfer.py', contentImagePath, styleImagePath, selectedColor, numImages]);
  
//     let stdoutData = '';
  
//     pythonProcess.stdout.on('data', (data) => {
//       stdoutData += data.toString();
//     });
  
//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     });
  
//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         return res.status(500).json({ error: 'Failed to process image' });
//       }
  
//       try {
//         const outputData = JSON.parse(stdoutData.trim());
//         res.json({ images: outputData });
//       } catch (error) {
//         console.error('Error parsing output data:', error);
//         res.status(500).json({ error: 'Failed to parse image data' });
//       }
//     });
//   });
  

// // Endpoint to upload design images
// app.post('/upload-design', designUpload.single('design_image'), (req, res) => {
//   const imagePath = `/designs/${req.file.filename}`;
//   res.json({ imagePath });
// });

// // Endpoint to get design images
// app.get('/designs', (req, res) => {
//   fs.readdir(designsDir, (err, files) => {
//     if (err) {
//       console.error(`Failed to read designs directory: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to retrieve design images' });
//     }
//     const designImages = files.map(file => `/designs/${file}`);
//     res.json({ designImages });
//   });
// });

// // Endpoint to add image to favorites
// app.post('/add-favorite', (req, res) => {
//   const { imagePath } = req.body;
//   const imageName = path.basename(imagePath);
//   const sourcePath = path.join(uploadDir, imageName);
//   const destPath = path.join(favoritesDir, imageName);

//   fs.copyFile(sourcePath, destPath, (err) => {
//     if (err) {
//       console.error(`Failed to copy image to favorites: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to add image to favorites' });
//     }
//     res.json({ message: 'Image added to favorites' });
//   });
// });

// // Endpoint to get favorite images
// app.get('/favorites', (req, res) => {
//   fs.readdir(favoritesDir, (err, files) => {
//     if (err) {
//       console.error(`Failed to read favorites directory: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to retrieve favorite images' });
//     }
//     const favoriteImages = files.map(file => `/favorites/${file}`);
//     res.json({ favoriteImages });
//   });
// });

// // Endpoint to delete image from favorites
// app.post('/delete-favorite', (req, res) => {
//   const { imagePath } = req.body;
//   const imageName = path.basename(imagePath);
//   const filePath = path.join(favoritesDir, imageName);

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error(`Failed to delete image from favorites: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to delete image from favorites' });
//     }
//     res.json({ message: 'Image deleted from favorites' });
//   });
// });

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

// // Endpoint to delete image from designs
// app.post('/delete-design', (req, res) => {
//   const { imagePath } = req.body;
//   const imageName = path.basename(imagePath);
//   const filePath = path.join(designsDir, imageName);

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error(`Failed to delete image from designs: ${err.message}`);
//       return res.status(500).json({ error: 'Failed to delete image from designs' });
//     }
//     res.json({ message: 'Image deleted from designs' });
//   });
// });

// // Use auth routes
// app.use('/auth', authRoutes);

// module.exports = app;
