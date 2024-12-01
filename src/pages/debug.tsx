import React, { useEffect } from 'react';

const Debug: React.FC = () => {
  useEffect(() => {
    // Log all localStorage data
    console.log('All localStorage data:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}:`, localStorage.getItem(key));
      }
    }

    // Log current user data
    const currentUser = localStorage.getItem('currentUser');
    console.log('Current user:', currentUser ? JSON.parse(currentUser) : null);

    // Log userData
    const userData = localStorage.getItem('userData');
    console.log('User data:', userData ? JSON.parse(userData) : null);
  }, []);

  return (
    <div>
      <h1>Debug Page</h1>
      <p>Check the console (F12) for debug information</p>
    </div>
  );
};

export default Debug;
