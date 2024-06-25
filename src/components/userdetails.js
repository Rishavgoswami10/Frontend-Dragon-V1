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
        window.location.href = '/login'; // Redirect to the login page
      } else {
        setError('Failed to fetch updated user details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to the login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirect to the login page if no token
      return;
    }

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
      <p>Invite Code: {user.invitecode || 'N/A'}</p>
      <p>Invitation Code: {user.invitationCode || 'N/A'}</p>
      <p>UID: {user.uid || 'N/A'}</p>
      <p>Referral Link: {user.referralLink || 'N/A'}</p>
      <p>Last Bonus Withdrawal: {user.lastBonusWithdrawal || 'N/A'}</p>
      <p>Total Commission: {user.totalCommission || 'N/A'}</p>
      <p>Avatar: {user.avatar ? <img src={user.avatar} alt="Avatar" /> : 'N/A'}</p>
      <p>Referrer: {user.referrer || 'N/A'}</p>
      <p>First Deposit Made: {user.firstDepositMade ? 'Yes' : 'No'}</p>
      <p>Total Bonus Amount: {user.totalBonusAmount || 'N/A'}</p>
      <p>Consecutive Days: {user.consecutiveDays || 'N/A'}</p>
      <p>Locked: {user.locked ? 'Yes' : 'No'}</p>
      <p>Registration Date: {user.registrationDate ? new Date(user.registrationDate).toLocaleString() : 'N/A'}</p>

      {/* Additional fields */}
      <h3>Notification:</h3>
      <pre>{JSON.stringify(user.notification, null, 2)}</pre>

      <h3>Withdraw Records:</h3>
      <pre>{JSON.stringify(user.withdrawRecords, null, 2)}</pre>

      {/* <h3>Achievements:</h3>
      <pre>{JSON.stringify(user.achievements, null, 2)}</pre>

      <h3>Direct Subordinates:</h3>
      <pre>{JSON.stringify(user.directSubordinates, null, 2)}</pre>

      <h3>Team Subordinates:</h3>
      <pre>{JSON.stringify(user.teamSubordinates, null, 2)}</pre>

      <h3>Referred Users:</h3>
      <pre>{JSON.stringify(user.referredUsers, null, 2)}</pre>

      <h3>Commission Records:</h3>
      <pre>{JSON.stringify(user.commissionRecords, null, 2)}</pre> */}

      <h3>Bank Details:</h3>
      <pre>{JSON.stringify(user.bankDetails, null, 2)}</pre>

      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDetails;
