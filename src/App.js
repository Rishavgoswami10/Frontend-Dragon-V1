import React, { useState } from 'react';
import Login from '../src/components/login';
import Register from '../src/components/register';
import UserDetails from '../src/components/userdetails';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('register'); // Default to register page

  return (
    <div className="App">
      {page === 'register' && <Register setPage={setPage} />}
      {page === 'login' && !user && <Login setUser={setUser} />}
      {user && <UserDetails />}
    </div>
  );
}

export default App;
