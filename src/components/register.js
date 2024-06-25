import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setPage }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('https://backend-service-12.onrender.com/register', { mobile, password }, { withCredentials: true });
      setPage('login');
    } catch (error) {
      console.error('Error registering', error);
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      <div>
        <p>Already have an account?</p>
        <button onClick={() => setPage('login')}>Login</button>
      </div>
    </div>
  );
};

export default Register;
