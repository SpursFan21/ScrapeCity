import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/account')({
  component: AccountPage,
});

function AccountPage() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    newPassword: '', 
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  
  const { user, isLoggedIn } = useAuth(); // Get user info and login status from AuthContext

  const maskPassword = (password: string) => '*'.repeat(password.length);

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserDetails({
        username: user.username,
        email: user.email || '',
        password: '123super', // Placeholder for the actual password
        newPassword: '', // Initially empty
      });
    }
  }, [user, isLoggedIn]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const updatedUserData = {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.newPassword,
      };

      await axios.put('http://127.0.0.1:8000/api/update-account/', updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <h2>You need to log in to view your account details</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-black text-2xl text-center mb-6">Account Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username:</label>
          <p className="border p-2 rounded">{userDetails.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <p className="border p-2 rounded">{userDetails.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password:</label>
          <p className="border p-2 rounded">{maskPassword(userDetails.password)}</p>
        </div>
        {!editing ? (
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white rounded px-4 py-2 w-full"
          >
            Edit Details
          </button>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Username:</label>
              <input
                type="text"
                value={userDetails.username}
                onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Email:</label>
              <input
                type="email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password (optional):</label>
              <input
                type="password"
                value={userDetails.newPassword}
                onChange={(e) => setUserDetails({ ...userDetails, newPassword: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white rounded px-4 py-2 w-full"
            >
              Update Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AccountPage;
