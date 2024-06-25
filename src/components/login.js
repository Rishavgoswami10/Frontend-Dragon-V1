import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://dragonclubs.online/login',
        { mobile, password },
        { withCredentials: true }
      );
      
      if (response.data && response.data.token && response.data.user) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update user state
        setUser(response.data.user);
        
        // Optionally, you can redirect the user here
        // history.push('/dashboard'); // If using react-router
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;