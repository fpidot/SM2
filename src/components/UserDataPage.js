import React, { useState, useEffect } from 'react';
import { fetchUserData, fetchAllUsers } from '../util/api';

const UserDataPage = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const handleFetchUserData = async () => {
    try {
      const data = await fetchUserData(userId);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFetchAllUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  useEffect(() => {
    handleFetchAllUsers();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button onClick={handleFetchUserData}>Fetch User Data</button>
      {userData && (
        <div>
          <h2>User Info</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
      <h2>All Users</h2>
      <pre>{JSON.stringify(allUsers, null, 2)}</pre>
    </div>
  );
};

export default UserDataPage;
