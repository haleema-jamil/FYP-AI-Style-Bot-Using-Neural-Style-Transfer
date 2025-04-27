// LoadingAnimation.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from './animations/Animation-g.json'; // Path to your animation file

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Optional: add a semi-transparent background
    zIndex: 1000 // Ensure it is on top of other elements
  };

  return (
    <div style={containerStyle}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LoadingAnimation;
