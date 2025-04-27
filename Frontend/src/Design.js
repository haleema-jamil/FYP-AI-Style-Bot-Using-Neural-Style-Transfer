import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/sidebar.css';
import './css/output.css'; // Adjust the path as needed

const Sidebar = ({ isOpen, toggleSidebar, handleImageUpload, selectedImage }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-generate-page">
          <img style={{ marginLeft: "60px" }} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" height="100px" />
        </div>
        <a href="/Design" className="sidebar-images" id="selected-category">
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
        <div style={{ marginBottom: '20px', marginTop: '40px' }}>
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : '/Images/placeholder.png'}
            alt="Selected Design"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '10px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type="file"
            id="file-upload"
            onChange={handleImageUpload}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <label
            htmlFor="file-upload"
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: '#00E8F8',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '16px'
            }}
          >
            Upload Design
          </label>
        </div>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src="/Images/menu.png" alt="Menu Icon" width="30px" height="30px" />
      </div>
    </>
  );
};

const Design = () => {
  const [designImages, setDesignImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDesignImages = async () => {
      console.log('Fetching design images...');
      try {
        const response = await fetch('http://localhost:5000/designs');
        console.log('Response received:', response);

        if (!response.ok) {
          throw new Error(`Error fetching design images: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Design images data:', data);
        setDesignImages(data.designImages || []);
      } catch (error) {
        console.error('Error fetching design images:', error);
      }
    };
    fetchDesignImages();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const fileType = file.type;
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml']; // Add more types if needed
  
    if (!acceptedTypes.includes(fileType)) {
      alert('Only image files are accepted.');
      return;
    }
  
    setSelectedImage(file);  // Update selected image state
    const formData = new FormData();
    formData.append('design_image', file);
  
    try {
      const response = await fetch('http://localhost:5000/upload-design', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload design image');
      }
  
      const data = await response.json();
      setDesignImages([...designImages, data.imagePath]);
      console.log('Image uploaded and added to design images');
    } catch (error) {
      console.error('Error uploading design image:', error);
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(`http://localhost:5000${imageUrl}`);
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

  const handleDelete = async (imageUrl) => {
    console.log(`Deleting image: ${imageUrl}`);
    try {
      const response = await fetch('http://localhost:5000/delete-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagePath: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image from designs');
      }

      // Update the state to remove the deleted image
      setDesignImages(designImages.filter((url) => url !== imageUrl));
      console.log('Image deleted from designs');
    } catch (error) {
      console.error('Error deleting image from designs:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* <div>
        <h1>My Designs</h1>
      </div> */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleImageUpload={handleImageUpload}
        selectedImage={selectedImage}
      />
      <div style={{ marginLeft: '50px', padding: '10px', flexGrow: 1, overflowY: 'auto' }}>
        <h1 id='output-heading'>My Designs</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '10px'
        }}>
          {designImages.length > 0 ? (
            designImages.map((imageUrl, index) => (
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
                    src={`http://localhost:5000${imageUrl}`}
                    alt={`Design ${index + 1}`}
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onLoad={() => console.log(`Image ${index + 1} loaded successfully: http://localhost:5000${imageUrl}`)}
                    onError={(e) => {
                      console.error(`Error loading image ${index + 1}: http://localhost:5000${imageUrl}`, e);
                      e.target.src = '/Images/error-placeholder.png'; // Placeholder for error
                    }}
                  />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>
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
                  
                </div>
              </div>
            ))
          ) : (
            <p>No design images</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Design;
