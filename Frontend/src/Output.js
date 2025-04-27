import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Account from './Account';
import './css/output.css';
import './css/sidebar.css';


const Sidebar = ({ isOpen, toggleSidebar, setNumImagesToShow, setSimilarityRange, setSimilarityFilterActive, setSelectedDimensions }) => {
  const [selectedButton, setSelectedButton] = useState(null); // State to track selected button

  const handleDimensionClick = (width, height) => {
    setSelectedDimensions({ width, height });
  };

  const handleButtonClick = (num) => {
    setNumImagesToShow(num); // Update state with the selected number of images
    setSelectedButton(num); // Set the selected button
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
          <h3>Image Dimensions</h3>
          <div className="dimension-button">
            <div className="dimension-btn-top">
              <button className="dimension" onClick={() => handleDimensionClick(512, 512)}>512 x 512</button>
              <button className="dimension" onClick={() => handleDimensionClick(768, 768)}>768 x 768</button>
            </div>
            <div className="dimension-btn-middle">
              <button className="dimension" onClick={() => handleDimensionClick(512, 1024)}>512 x 1024</button>
              <button className="dimension" onClick={() => handleDimensionClick(768, 1024)}>768 x 1024</button>
            </div>
            <div className="dimension-btn-bottom">
              <button className="dimension" onClick={() => handleDimensionClick(1024, 768)}>1024 x 768</button>
              <button className="dimension" onClick={() => handleDimensionClick(1024, 1024)}>1024 x 1024</button>
            </div>
          </div>
        </div>
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
        <h3>Similarity Range:</h3>
        <div className="slidercontainer">
          <input
            type="range"
            min="1"
            max="100"
            defaultValue="50"
            className="slider"
            id="myRange"
            title="Similarity Range"
            onChange={(e) => {
              setSimilarityRange(e.target.value);
              setSimilarityFilterActive(true);
            }}
          />
        </div>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src="/Images/menu.png" alt="Menu Icon" width="30px" height="30px" />
      </div>
    </>
  );
};

const Output = () => {
  const location = useLocation();
  const [images, setImages] = useState(location.state?.images || []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [numImagesToShow, setNumImagesToShow] = useState(8);
  const [similarityRange, setSimilarityRange] = useState(50);
  const [similarityFilterActive, setSimilarityFilterActive] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState({ width: 512, height: 512 });
  const [showAccount, setShowAccount] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [favorites, setFavorites] = useState(new Set());
  const [userId, setUserId] = useState(null);
  const [downloadOptionsVisible, setDownloadOptionsVisible] = useState(false);
  const [selectedImageForDownload, setSelectedImageForDownload] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found. Redirecting to login.');
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
          setProfilePicture(data.profilePicture ? `data:image/png;base64,${data.profilePicture}` : '/Images/Mockups-10.png');
          setUserId(data._id);
        } else {
          console.error('Failed to fetch user profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleAccountClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      setShowAccount(!showAccount);
    }
  };

  console.log('Received images:', images); // Debug statement

  const displayedImages = similarityFilterActive 
    ? images.filter(image => image.similarity !== null && image.similarity <= similarityRange)
    : images;

  const handleDelete = (index) => {
    const updatedImages = displayedImages.filter((_, imgIndex) => imgIndex !== index);
    setImages(updatedImages);
  };

  const handleDownload = async (imageUrl, format) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = selectedDimensions.width;
        canvas.height = selectedDimensions.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, selectedDimensions.width, selectedDimensions.height);
        
        const imageDataUrl = canvas.toDataURL(`image/${format}`);
        const a = document.createElement('a');
        a.href = imageDataUrl;
        a.download = `image.${format}`;
        a.click();
      };
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleFormatChange = (event) => {
    const format = event.target.value;
    setSelectedFormat(format);
    setDownloadOptionsVisible(false);
    handleDownload(selectedImageForDownload, format);
  };

  const handleDownloadClick = (imageUrl) => {
    setSelectedImageForDownload(imageUrl);
    setDownloadOptionsVisible(!downloadOptionsVisible);
  };

  const handleZoom = (imageUrl) => {
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
      <head>
        <title>Image Zoom View</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            width: ${selectedDimensions.width}px;
            height: ${selectedDimensions.height}px;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" />
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handleFavorite = async (imageUrl, index) => {
    if (!userId) {
      console.error('User ID is not set. Cannot add image to favorites.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagePath: imageUrl, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add image to favorites');
      }
      console.log('Image added to favorites');
      setFavorites((prevFavorites) => {
        const newFavorites = new Set(prevFavorites);
        if (newFavorites.has(index)) {
          newFavorites.delete(index);
        } else {
          newFavorites.add(index);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error adding image to favorites:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="output-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="output-background"></div> 
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        className={`output-container ${isSidebarOpen ? 'sidebar-open' : ''}`}
      >
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}
          onClick={handleAccountClick}
        >
          <img
            src={profilePicture ? profilePicture : '/Images/Mockups-10.png'}
            alt="My Account"
            title="Account"
            height="50px"
            style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }}
          />
        </div>
        {showAccount && (
          <div className="account-container">
            <Account />
          </div>
        )}
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          setNumImagesToShow={setNumImagesToShow} 
          setSimilarityRange={setSimilarityRange}
          setSimilarityFilterActive={setSimilarityFilterActive}
          setSelectedDimensions={setSelectedDimensions}
        />
        <div className="output-text-center">
          <h1 id="output-heading">Check out these Generated Designs!!</h1>
          <div className="multiple-output-containers">
            {displayedImages.length > 0 ? (
              displayedImages.slice(0, numImagesToShow).map((image, index) => {
                const imageUrl = `http://localhost:5000/${image.image_path}`;
                console.log(`Image ${index + 1} URL:`, imageUrl);
                return (
                  <div className="container-output" key={index}>
                    <div className="preview-output">
                      <img
                        className="preview-output-img"
                        src={imageUrl}
                        title={`Output ${index + 1}`}
                        alt={`Output ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/Images/error-placeholder.png';
                        }}
                        onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                      />
                    </div>
                    <div className="output-options-container">
                      <div className="download-dropdown">
                        <img
                          className="output-options"
                          src="/Images/Mockups-20.png"
                          title="Download Icon"
                          alt="Download Icon"
                          onClick={() => handleDownloadClick(imageUrl)}
                        />
                        {downloadOptionsVisible && selectedImageForDownload === imageUrl && (
                          <div className="dropdown-content">
                            <button onClick={() => handleFormatChange({ target: { value: 'png' } })}>PNG</button>
                            <button onClick={() => handleFormatChange({ target: { value: 'jpeg' } })}>JPEG</button>
                            <button onClick={() => handleFormatChange({ target: { value: 'svg+xml' } })}>SVG</button>
                            <button onClick={() => handleFormatChange({ target: { value: 'pdf' } })}>PDF</button>
                          </div>
                        )}
                      </div>
                      <img
                        className="output-options"
                        src="/Images/Mockups-17.png"
                        title="Delete Icon"
                        alt="Delete Icon"
                        onClick={() => handleDelete(index)}
                      />
                      <img
                        className="output-options"
                        src="/Images/view.png"
                        title="View Image"
                        alt="View Image"
                        onClick={() => handleZoom(imageUrl)}
                      />
                      <img
                        className="output-options"
                        src={favorites.has(index) ? "/Images/heart.png" : "/Images/favourite.png"}
                        title="Favourite"
                        alt="Favourite"
                        onClick={() => handleFavorite(imageUrl, index)}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No images generated</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
