import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login function
  const handleLogin = async () => {
    try {
      // Send a POST request to the login API
      const res = await axios.post('http://localhost:5000/users/login', {
        rollNumber,
        password,
      });

      // Set user data in context and localStorage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect to dashboard or home page
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Enter Roll Number"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
