import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/sidebar.css';
import './css/output.css'; // Adjust the path as needed

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-generate-page">
          <img style={{ marginLeft: "60px" }} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" height="100px" />
        </div>
        <a href="/Design" className="sidebar-images">
          <img src="/Images/Mockups-13.png" title="Design Icon" width="20px" height="20px" /> Designs
        </a>
        <a href="/Album" className="sidebar-images" id="selected-category">
          <img src="/Images/Mockups-15.png" title="Albums Icon" width="20px" height="20px" /> My Albums
        </a>
        <Link to="/Favorites" className="sidebar-images">
          <img src="/Images/Mockups-14.png" title="Favourite Icon" width="20px" height="20px" /> Favourites
        </Link>
        <a href="/" className="sidebar-images">
          <img src="/Images/Mockups-13.png" title="Design Icon" width="20px" height="20px" /> Home
        </a>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src="/Images/menu.png" alt="Menu Icon" width="30px" height="30px" />
      </div>
    </>
  );
};

const Album = ({ handleRemoveFavorite }) => {
  const [albumImages, setAlbumImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(null); // State to store user ID
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

  useEffect(() => {
    const fetchAlbumImages = async () => {
      const token = localStorage.getItem('authToken');

      if (!token || !userId) {
        console.error('No auth token or user ID found. Redirecting to login.');
        navigate('/login');
        return;
      }

      console.log('Fetching album images...');
      try {
        const response = await fetch(`http://localhost:5000/api/album/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Response received:', response);

        if (!response.ok) {
          throw new Error(`Error fetching album images: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Album images data:', data);
        setAlbumImages(data.albumImages || []);
      } catch (error) {
        console.error('Error fetching album images:', error);
      }
    };

    if (userId) {
      fetchAlbumImages();
    }
  }, [navigate, userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);  // Update selected image state
    const formData = new FormData();
    formData.append('album_image', file);

    try {
      const response = await fetch('http://localhost:5000/upload-album', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload album image');
      }

      const data = await response.json();
      setAlbumImages([...albumImages, data.imagePath]);
      console.log('Image uploaded and added to album images');
    } catch (error) {
      console.error('Error uploading album image:', error);
    }
  };

  const handleDelete = async (imageUrl) => {
    const token = localStorage.getItem('authToken');

    if (!token || !userId) {
        console.error('No auth token or user ID found. Cannot delete image.');
        return;
    }

    console.log(`Deleting image: ${imageUrl}`);
    try {
        const response = await fetch('http://localhost:5000/api/album/album-delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imagePath: imageUrl, userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete image from album: ${errorData.error}`);
        }

        setAlbumImages(albumImages.filter((url) => url !== imageUrl));
        handleRemoveFavorite(imageUrl); // Call the function passed as prop to update favorites
        console.log('Image deleted from album');
    } catch (error) {
        console.error('Error deleting image from album:', error.message);
    }
};

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(`http://localhost:5000/${imageUrl}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log('Current album images state:', albumImages);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleImageUpload={handleImageUpload}
        selectedImage={selectedImage}
      />
      <div className="album-container" style={{ marginLeft: '50px', padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <h1 id='output-heading'>My Album</h1>
        <div 
          className="multiple-output-containers" 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '10px'
          }}
        >
          {albumImages.length > 0 ? (
            albumImages.map((imageUrl, index) => (
              <div 
                className="container-output" 
                key={index} 
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="preview-output" style={{ position: 'relative', width: '100%' }}>
                  <img
                    className="preview-output-img"
                    src={`http://localhost:5000/${imageUrl}`}
                    alt={`Album ${index + 1}`}
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onLoad={() => console.log(`Image ${index + 1} loaded successfully: http://localhost:5000/${imageUrl}`)}
                    onError={(e) => {
                      console.error(`Error loading image ${index + 1}: http://localhost:5000/${imageUrl}`, e);
                      e.target.src = '/Images/error-placeholder.png'; // Placeholder for error
                    }}
                  />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={() => handleDownload(imageUrl)}
                    style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#00E8F8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '45%'
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(imageUrl)}
                    style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#FF6347',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '45%'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No album images</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Album;
