import React, { useState, useEffect } from 'react';
import './css/home.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from './/CustomModel'; // Assuming you have a CustomModal component

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate('/'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleSignOut = () => {
    setIsModalOpen(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setIsModalOpen(false);
    navigate('/'); // Redirect to login page after sign out
  };

  const cancelSignOut = () => {
    setIsModalOpen(false);
  };

  const handleHowItWorks = () => {
    navigate('/Works');
  };

  return (
    <div>
      <header className="header">
        <div className="header__menu-bar">
          <div className="header__logo-box">
            <img style={{ marginLeft: "60px" }} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" />
          </div>

          <ul className="header__nav-list">
            {isLoggedIn ? (
              <li className="header__nav-item">
                <button onClick={handleSignOut} className="header__nav-link login-button">Sign Out</button>
              </li>
            ) : (
              <>
                <li className="header__nav-item">
                  <a href="/login" className="header__nav-link login-button">Login</a>
                </li>
                <li className="header__nav-item">
                  <a href="/register" className="header__nav-link sign-up-button">Sign Up</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      <div className="container">
        <div className="left-section">
          <div id="title" className="maintext">
            <h1 className="text1">
              Unlock Your Imagination with <span className="t1">AI Style Bot:</span> where <span className="t2">Artistry Meets Innovation.</span>
            </h1>
            <h2 className="text2">Creating Stunning Clothing Designs is Easy:</h2>
            <h3 className="text3">&emsp;&emsp;1. Upload Your Content Images.</h3>
            <h3 className="text3">&emsp;&emsp;2. Choose Required Dimensions and Colours.</h3>
            <h3 className="text3" id="text3">&emsp;&emsp;3. Sit Back and let our Style Bot play its magic.</h3>
            <a href="/Generate" className="image-generation-btn">Image Generation</a>
          </div>
        </div>
        <div className="right-section">
          <img src="/Images/Image-01.jpg" alt="Main Visual" />
        </div>
      </div>
      <button
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '20px',
          padding: '10px 20px',
          background: 'linear-gradient(81.02deg, #16c2d1 -39.48%, #aaf8f8 130.8%)',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          animation: 'pop-up 0.5s ease-out'
        }}
        onClick={handleHowItWorks}
      >
        How It Works
      </button>
      <CustomModal 
        isOpen={isModalOpen} 
        onClose={cancelSignOut} 
        onConfirm={confirmSignOut} 
        message="Do you want to sign out?" 
      />
    </div>
  );
};

export default Home;
