import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from './CustomModal';
import '../css/Signup.css'; // Ensure you have the CSS styles

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Password strength conditions
    const passwordConditions = [
      { regex: /.{8,}/, message: "Password must be at least 8 characters long" },
      { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
      { regex: /[a-z]/, message: "Password must contain at least one lowercase letter" },
      { regex: /\d/, message: "Password must contain at least one digit" },
      { regex: /[@$!%*?&#]/, message: "Password must contain at least one special character" }
    ];

    for (const condition of passwordConditions) {
      if (!condition.regex.test(password)) {
        setMessage(condition.message);
        return;
      }
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Verification code sent to your email.');
        setIsCodeSent(true);
      } else {
        setMessage(data.error || 'Failed to create user');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const { name , email, password } = formData;

    try {
      const response = await fetch('http://localhost:5000/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, code: verificationCode }), // Include password here
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Store the token in localStorage
        setMessage('Signup successful');
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/login');
        }, 1000); // Redirect after 1 second
      } else {
        setMessage(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="signupform" id="signupForm">
      {!isCodeSent ? (
        <form onSubmit={handleSubmit} className="form-container">
          <h1>Sign Up</h1>

          <label htmlFor="name"><b>Name</b></label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label htmlFor="showPassword">
            <input
              type="checkbox"
              name="showPassword"
              checked={showPassword}
              onChange={handleShowPassword}
            /> Show Password
          </label>

          <div className="remember-container">
            <input type="checkbox" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div className="remember-container">
            <input type="checkbox" name="terms" required />
            <p>By creating an account you agree to our <a href="#">Terms & Privacy</a></p>
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="form-container">
          <h1>Enter Verification Code</h1>

          <label htmlFor="verificationCode"><b>Verification Code</b></label>
          <input
            type="text"
            placeholder="Enter Verification Code"
            name="verificationCode"
            value={verificationCode}
            onChange={handleCodeChange}
            required
          />

          {/* Add a hidden input field to store the password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            style={{ display: 'none' }}
          />

          <button type="submit" className="btn">Verify</button>
        </form>
      )}
      {message && <p className='message'>{message}</p>}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message="Registered successfully!" />
    </div>
  );
};

export default Register;
