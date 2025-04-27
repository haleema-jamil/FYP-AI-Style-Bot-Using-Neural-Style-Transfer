import React, { useState, useEffect } from 'react';
import './css/Account.css'; 

const Account = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('User not logged in');
      return;
    }

    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProfileData(data);
        } else {
          setMessage(data.error || 'Failed to fetch user data');
        }
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Show preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('User not logged in');
      return;
    }

    // Form data for the image upload
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);

    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully');
        // Update profile picture in state
        setProfileData({
          ...profileData,
          profilePicture: data.profilePicture,
        });
        setPreviewImage('');
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="account-container">
      <div className="account">
        <img 
          src={previewImage || `data:image/png;base64,${profileData.profilePicture}`} 
          alt="My Account" 
          title="Account" 
          className="profile-picture"
        />
        <form onSubmit={handleSubmit} className="account-form">
          <label>
            Profile Picture:
            <input type="file" onChange={handleFileChange} />
          </label>
          <label>
            Name:
            <input 
              type="text" 
              name="name" 
              value={profileData.name} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Email:
            <input 
              type="email" 
              name="email" 
              value={profileData.email} 
              onChange={handleChange} 
            />
          </label>
          <button type="submit" className="btn">Update Profile</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Account;
