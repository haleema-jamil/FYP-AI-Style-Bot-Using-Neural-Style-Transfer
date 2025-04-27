import React, { useState, useEffect } from 'react';
import './css/home.css';
import './css/Works.css';

const Works = () => {

  return (
    <div>
      <header className="header">
        <div className="header__menu-bar">
          <div className="header__logo-box">
            <img style={{ marginLeft: "60px" }} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" />
          </div>
        </div>
      </header>
      <div className='heading'>
        <h1 id="output-heading">How It Works?</h1>
      </div>

      <div id='animatedDiv'>
        <div>
          <h1 className='step-heading'>Step 1: Upload Images</h1>
          <p className='step-text'>Start by uploading two images: one for style and one for content. The style image defines the artistic elements such as textures, colors, and patterns you wish to apply to the content image.
          </p>
        </div>
        <div>
          <h1 className='step-heading'>Step 2: Customize Your Design</h1>
          <p className='step-text'>Choose your preferred color scheme and specify the number of variations you want to generate based on the uploaded images. This customization allows you to tailor the output to meet your specific design needs and preferences.</p>
        </div>
        <div>
          <h1 className='step-heading'>Step 3: Generation Process</h1>
          <p className='step-text'>After submitting your preferences, the system processes your request. Depending on the complexity and number of variations requested, this step may take a few minutes. Our advanced algorithms leverage Generative AI to combine the style and content images seamlessly, producing multiple unique designs.
          </p>
        </div>
        <div>
          <h1 className='step-heading'>Step 4: Download Your Designs</h1>
          <p className='step-text'>Once the designs are generated, you can preview them and select your favorites. Download the designs in your preferred format, whether it's JPG, PNG, PDF, or SVG, ensuring compatibility with various applications and printing requirements.
          </p>
        </div>
        <div>
          <h1 className='step-heading'>Step 5: Save and Organize</h1>
          <p className='step-text'>Keep track of your favorite designs by saving them to your personal album. This feature allows you to revisit and manage your designs conveniently, ensuring easy access for future projects or inspirations.
          </p>
        </div>
        <div>
          <h1 className='step-heading'>Step 6: Explore</h1>
          <p className='step-text'>Explore a gallery showcasing all your generated designs. Download your creations with others and use them as inspiration for future projects. Our platform empowers you to unleash your creativity and explore endless design possibilities effortlessly.
          </p>
        </div>
        <div>
          <br></br>
          <p className='step-text'>Experience the Future of Fashion Design</p>
          <p className='step-text'>With our intuitive interface and powerful AI technology, designing unique and visually captivating fashion pieces has never been easier. Embrace innovation and transform your creative process with our AI Web Tool. Start creating today and discover the limitless potential of automated design generation in the fashion industry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Works;
