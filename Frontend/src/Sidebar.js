import React from 'react';
import './css/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-generate-page">
          <img style={{marginLeft:"60px"}} src="/Images/AI_bot.png" alt="Company's Logo" title="Our Logo" height="120px" />
        </div>
        <a href="#" className="sidebar-images">
          <img src="/Images/Mockups-13.png" title="Design Icon" width="20px" height="20px" /> Designs
        </a>
        <a href="#" className="sidebar-images">
          <img src="/Images/Mockups-15.png" title="Albums Icon" width="20px" height="20px" /> My Albums
        </a>
        <a href="#" className="sidebar-images">
          <img src="/Images/Mockups-14.png" title="Favourite Icon" width="20px" height="20px" /> Favourites
        </a>
        <div>
          <h3>Image Dimensions</h3>
          <div className="dimension-button">
            <div className="dimension-btn-top">
              <button className="dimension">512 x 512</button>
              <button className="dimension">768 x 768</button>
            </div>
            <div className="dimension-btn-middle">
              <button className="dimension">512 x 1024</button>
              <button className="dimension">768 x 1024</button>
            </div>
            <div className="dimension-btn-bottom">
              <button className="dimension">1024 x 768</button>
              <button className="dimension">1024 x 1024</button>
            </div>
          </div>
        </div>
        <div className='ImageNum'>
          <h3>Number Of Images</h3>
          <div id="imagesnum-button" className="imagesnum-button">
            <div className="imagesnum-btn-top">
              <button className="imagesnum">1</button>
              <button className="imagesnum">2</button>
              <button className="imagesnum">3</button>
              <button className="imagesnum">4</button>
            </div>
            <div className="imagesnum-btn-down">
              <button className="imagesnum">5</button>
              <button className="imagesnum">6</button>
              <button className="imagesnum">7</button>
              <button className="imagesnum">8</button>
            </div>
          </div>
        </div>
        <h3>Similarity Range:</h3>
        <div className="slidercontainer">
          <input type="range" min="1" max="100" defaultValue="50" className="slider" id="myRange" title="Similarity Range" />
        </div>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src="/Images/menu.png" alt="Menu Icon" width="30px" height="30px" />
      </div>
    </>
  );
};

export default Sidebar;
