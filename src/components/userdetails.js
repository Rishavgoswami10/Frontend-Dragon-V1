import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      // Fetch user details from the server with the token in the headers
      const response = await axios.get('https://dragonclubs.online/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      // Update the user state and session storage with fresh data
      setUser(response.data);
      sessionStorage.setItem('user', JSON.stringify(response.data));

      // Debugging: Log user details to check structure
      console.log('Fetched User Details:', response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response && error.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        setError('Failed to fetch updated user details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
      setLoading(false);
    } else {
      fetchUserDetails();
    }
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchUserDetails();
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleRefresh}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <p>No user data available. Please ensure you are logged in.</p>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Mobile Number: {user.mobile || 'N/A'}</p>
      <p>Username: {user.username || 'N/A'}</p>
      <p>Wallet Amount: {user.walletAmount || 'N/A'}</p>
      <p>Account Type: {user.accountType || 'N/A'}</p>
      <p>Last Login Time: {user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : 'N/A'}</p>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default UserDetails;
