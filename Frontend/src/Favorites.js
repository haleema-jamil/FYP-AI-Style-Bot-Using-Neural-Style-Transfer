import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/sidebar.css';
import './css/output.css'; // Adjust the path as needed

const Sidebar = ({ isOpen, toggleSidebar, handleImageUpload, selectedImage }) => {
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
        <Link to="/Favorites" className="sidebar-images" id="selected-category">
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

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(null); // State to store user ID
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthToken = () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found. Redirecting to login.');
        navigate('/login');
        return false;
      }
      return true;
    };

    const fetchUserProfile = async () => {
      if (!checkAuthToken()) return;

      try {
        const token = localStorage.getItem('authToken');
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
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('authToken');

      if (!token || !userId) {
        console.error('No auth token or user ID found. Redirecting to login.');
        navigate('/login');
        return;
      }

      console.log('Fetching favorite images...');
      try {
        const response = await fetch(`http://localhost:5000/favorites/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Response received:', response);

        if (!response.ok) {
          throw new Error(`Error fetching favorite images: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Favorite images data:', data);
        setFavorites(data.favoriteImages);
      } catch (error) {
        console.error('Error fetching favorite images:', error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [navigate, userId]);


  const handleDelete = async (imageUrl) => {
    const token = localStorage.getItem('authToken');
    console.log(token);

    if (!token || !userId) {
        console.error('No auth token or user ID found. Cannot delete image.');
        return;
    }

    console.log(`Deleting image: ${imageUrl}`);
    try {
      console.log("Start here");
        const response = await fetch('http://localhost:5000/api/delete-favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imagePath: imageUrl, userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete image from favorites');
        }

        setFavorites(favorites.filter((url) => url !== imageUrl));
        console.log('Image deleted from favorites');
    } catch (error) {
        console.error('Error deleting image from favorites:', error);
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

  console.log('Current favorites state:', favorites);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleImageUpload={() => {}}
        selectedImage={null}
      />
      <div className="favorites-container" style={{ marginLeft: '50px', padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <h1 id='output-heading'>Favorites</h1>
        <div 
          className="multiple-output-containers" 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '10px'
          }}
        >
          {favorites.length > 0 ? (
            favorites.map((imageUrl, index) => (
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
                    alt={`Favorite ${index + 1}`}
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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                  <button
                    onClick={() => handleDownload(imageUrl)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#00E8F8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '48%'
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(imageUrl)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#FF5C5C',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '48%'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite images</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
