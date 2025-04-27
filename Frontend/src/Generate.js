import React, { useState, useEffect } from 'react';
import Account from './Account';
import './css/generate.css';
import './css/sidebar.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Generate = () => {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ff0000'); // Default color is red
  const [showAccount, setShowAccount] = useState(false);
  const [profilePicture, setProfilePicture] = useState('/Images/Mockups-10.png');
  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility
  const [numImagesToGenerate, setNumImagesToGenerate] = useState(4); // State to track number of images to generate
  const [userId, setUserId] = useState(null); // State to store user ID
  const [selectedButton, setSelectedButton] = useState(null); // State to track selected button
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          if (data.profilePicture) {
            setProfilePicture(`data:image/png;base64,${data.profilePicture}`);
          }
          setUserId(data._id); // Store the user's _id in the state
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  
  const showPreview = (imageId, file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = document.getElementById(imageId);
      imgElement.src = e.target.result;
      imgElement.classList.add('full'); // Add the 'full' class when an image is selected
    };
    reader.readAsDataURL(file);
  };

  const handleContentImageChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setContentImage(file);
      showPreview('image-1', file);
    } else {
      alert('Please upload a valid PNG or JPG image file');
    }
  };

  const handleStyleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setStyleImage(file);
      showPreview('image-2', file);
    } else {
      alert('Please upload a valid PNG or JPG image file');
    }
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    document.getElementById('color-preview').style.backgroundColor = event.target.value;
  };

  const handleClearColor = () => {
    setSelectedColor('#FFFFFF00'); // Reset to transparent
    document.getElementById('color-preview').style.backgroundColor = '#FFFFFF00'; // Update preview
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!contentImage || !styleImage) {
      alert('Please upload both Content and Style Image.');
      return;
    }

    setIsLoading(true); // Show loading animation
    const formData = new FormData();
    formData.append('content_image', contentImage);
    formData.append('style_image', styleImage);
    formData.append('selected_color', selectedColor);
    formData.append('num_images', numImagesToGenerate); // Pass the number of images to generate
    formData.append('user_id', userId); // Pass the user_id

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Server response:', response.data);
      const images = response.data.images;
      console.log('Parsed images:', images);
      navigate('/output', { state: { images } });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleAccountClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      setShowAccount(!showAccount);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to add an ID to the button when clicked
  const handleButtonClick = (num) => {
    setNumImagesToGenerate(num); // Update state with the selected number of images
    setSelectedButton(num); // Set the selected button
  };


  return (
    <div className='Main-Body'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center', // Optional: if you want to align items vertically in the center
          paddingTop: '20px',
          paddingRight: '20px'
        }}
        
      >
        <img
          src={profilePicture}
          alt="My Account"
          title="Account"
          height="50px"
          style={{ borderRadius: '50%', width: '50px', height: '50px' }} // Circular shape
          onClick={handleAccountClick}
        />
      </div>
      {showAccount && (
        <div className="account-container">
          <Account />
        </div>
      )}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo-generate-page">
          <img style={{ marginLeft: "60px" }} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" height="100px" />
        </div>
        <a href="/Design" className="sidebar-images">
          <img src="/Images/Mockups-13.png" title="Design Icon" width="20px" height="20px" /> Designs
        </a>
        <a href="/Album" className="sidebar-images">
          <img src="/Images/Mockups-15.png" title="Albums Icon" width="20px" height="20px" /> My Albums
        </a>
        <Link to="/Favorites" className="sidebar-images">
          <img src="/Images/Mockups-14.png" title="Favourite Icon" width="20px" height="20px" /> Favourites
        </Link>
        <a href="/" className="sidebar-images">
          <img src="/Images/Mockups-13.png" title="Design Icon" width="20px" height="20px" /> Home
        </a>
        
        <div>
          <h3>Number Of Images</h3>
          <div id="imagesnum-button" className="imagesnum-button">
            <div className="imagesnum-btn-top">
              <button
                className={`imagesnum ${selectedButton === 1 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(1)}
              >
                1
              </button>
              <button
                className={`imagesnum ${selectedButton === 2 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(2)}
              >
                2
              </button>
              <button
                className={`imagesnum ${selectedButton === 3 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(3)}
              >
                3
              </button>
              <button
                className={`imagesnum ${selectedButton === 4 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(4)}
              >
                4
              </button>
              <button
                className={`imagesnum ${selectedButton === 5 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(5)}
              >
                5
              </button>
              <button
                className={`imagesnum ${selectedButton === 6 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(6)}
              >
                6
              </button>
              <button
                className={`imagesnum ${selectedButton === 7 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(7)}
              >
                7
              </button>
              <button
                className={`imagesnum ${selectedButton === 8 ? 'selected' : ''}`}
                onClick={() => handleButtonClick(8)}
              >
                8
              </button>
            </div>
          </div>
        </div>
      
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src="/Images/menu.png" alt="Menu Icon" width="30px" height="30px" />
      </div>

      <div className="logo-main-page">
          <img style={{marginLeft:"60px"}} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" height="120px" />
      </div>

      {isLoading ? (
        <div className="loading-container">
          <img src="/Images/Mockups-23.png" alt="Loading..." className="loading-static" />
          <img src="/Images/Mockups-19.png" alt="Loading spinner..." className="loading-spinner" />
        </div>
      ) : (
        <>
          <h1 style={{marginTop: '-3%'}} className='text-center_h1'>Upload Your Preferred Images</h1>
          <div className={`multiple-forms ${isSidebarOpen ? 'shifted' : ''}`}>
            <div className="form-input">
              <h5>Reference Image For Style</h5>
              <div className="preview">
                <img className="preview-img" src="/Images/Images-Icon-21.png" title="Input1" id="image-1" alt="Preview" />
              </div>
              <label htmlFor="file-ip-1">Upload Image</label>
              <input type="file" id="file-ip-1" accept="image/png, image/jpeg" onChange={handleContentImageChange} />
            </div>

            <div className="form-input">
              <h5>Reference Image For Pattern</h5>
              <div className="preview">
                <img className="preview-img" src="/Images/Images-Icon-21.png" title="Input2" id="image-2" alt="Preview" />
              </div>
              <label htmlFor="file-ip-2">Upload Image</label>
              <input type="file" id="file-ip-2" accept="image/png, image/jpeg" onChange={handleStyleImageChange} />
            </div>

            <div className="form-input-color">
              <h5>Reference For Colour</h5>
              <div id="color-preview" className="preview" style={{ backgroundColor: selectedColor, position: 'relative' }} onClick={() => document.getElementById('favcolor').click()}>
                {selectedColor !== '#FFFFFF00' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the color input click
                      handleClearColor();
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    &times;
                  </span>
                )}
              </div>
              <input type="color" id="favcolor" name="favcolor" value={selectedColor} onChange={handleColorChange} />
              <label htmlFor="favcolor">Select Color</label>
            </div>
          </div>

          <button id="generate-btn" onClick={handleSubmit}>Apply Style</button>
        </>
      )}
    </div>
  );
};

export default Generate;
