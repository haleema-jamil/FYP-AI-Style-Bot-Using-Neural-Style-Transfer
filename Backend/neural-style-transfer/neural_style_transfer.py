import sys
import tensorflow as tf
import tensorflow_hub as hub
import random
import json
import numpy as np
from skimage.metrics import structural_similarity as ssim

"""TO CROP IMAGE"""
def crop_center(image):
    shape = image.shape
    new_shape = min(shape[1], shape[2])
    offset_y = max(shape[1] - shape[2], 0) // 2
    offset_x = max(shape[2] - shape[1], 0) // 2
    image = tf.image.crop_to_bounding_box(image, offset_y, offset_x, new_shape, new_shape)
    return image

"""FOR LOADING AND PROCESSING IMAGE"""
def load_image(image_path, image_size=(256, 256), preserve_aspect_ratio=True):
    img = tf.io.decode_image(tf.io.read_file(image_path), channels=3, dtype=tf.float32)[tf.newaxis, ...]
    img = crop_center(img)
    img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)
    return img

"""TO FLIP AND ROTATE IMAGE FOR MULTIPLE IMAGES GENERATION"""
def random_transform(image):
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_flip_up_down(image)
    angles = [0, 90, 180, 270]
    angle = random.choice(angles)
    image = tf.image.rot90(image, k=angle // 90)
    return image

def output_random_number(min_value=1, max_value=10000000):
    """
    Generates and returns a random number between min_value and max_value.

    Args:
    - min_value (int): The minimum value for the random number.
    - max_value (int): The maximum value for the random number.

    Returns:
    - int: A random number between min_value and max_value.
    """
    return random.randint(min_value, max_value)

def apply_color_filter(image, color_hex):
    color_rgb = [int(color_hex[i:i+2], 16) / 255.0 for i in (1, 3, 5)]
    color_rgb = tf.constant(color_rgb, shape=[1, 1, 1, 3], dtype=tf.float32)
    color_mask = tf.ones_like(image) * color_rgb
    return image * color_mask

def stylize_image(content_image, style_image, alpha, preserve_color=True, color_hex=None):
    hub_handle = 'https://kaggle.com/models/google/arbitrary-image-stylization-v1/frameworks/TensorFlow1/variations/256/versions/1'
    hub_module = hub.load(hub_handle)
    stylized_image = hub_module(tf.constant(content_image), tf.constant(style_image))[0]
    if preserve_color:
        stylized_image = tf.image.adjust_hue(stylized_image, 0.1)
    if color_hex:
        stylized_image = apply_color_filter(stylized_image, color_hex)
    return alpha * stylized_image + (1 - alpha) * content_image

def calculate_similarity(image1, image2):
    image1_np = image1.numpy().squeeze()
    image2_np = image2.numpy().squeeze()
    similarity_score, _ = ssim(image1_np, image2_np, full=True, multichannel=True, win_size=3, channel_axis=-1, data_range=image1_np.max() - image1_np.min())
    return similarity_score * 100  # Convert to percentage

if __name__ == "__main__":
    content_image_path = sys.argv[1]
    style_image_path = sys.argv[2]
    alpha = float(sys.argv[3])
    color_hex = sys.argv[4] if len(sys.argv) > 4 else None
    num_images = int(sys.argv[5]) if len(sys.argv) > 5 else 4

    content_image = load_image(content_image_path, (384, 384))
    style_image = load_image(style_image_path, (256, 256))
    style_image = tf.nn.avg_pool(style_image, ksize=[3, 3], strides=[1, 1], padding='SAME')

    alphas = np.linspace(0.3, 0.9, num_images)  # Generate alpha values based on the number of images
    output_images = []

    for i, alpha in enumerate(alphas):
        transformed_style_image = random_transform(style_image)
        stylized_image = stylize_image(content_image, transformed_style_image, alpha, color_hex=color_hex)
        similarity_score = calculate_similarity(content_image, stylized_image)
        random_number = output_random_number()
        output_image_path = f'uploads/output_{i + random_number + 1}.png'
        tf.keras.preprocessing.image.save_img(output_image_path, stylized_image[0])
        output_images.append({'image_path': output_image_path, 'similarity': similarity_score})

    print(json.dumps(output_images))
