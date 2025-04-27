import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomModal from './CustomModal';
import '../css/Signup.css'; // Ensure you have the CSS styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Store the token in localStorage
        setMessage('Login successful');
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/');
        }, 1000); // Redirect after 1 second
      } else {
        setMessage(data.error || 'Failed to login');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="signupform" id="signupForm">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>

        <label htmlFor="email"><b>Email</b></label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password"><b>Password</b></label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="showPassword" className="show-password">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <button type="submit" className="btn">Login</button>
        <p className="signup-text">Don't have an account? <Link to="/register">Sign up</Link></p> {/* Add signup link here */}
      </form>
      {message && <p className='message'>{message}</p>}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message="Login successful!" />
    </div>
  );
};

export default Login;
