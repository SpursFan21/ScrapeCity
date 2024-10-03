import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/account')({
  component: AccountPage,
});

function AccountPage() {
  const [userDetails, setUserDetails] = useState({
    // this is just example code will need to get this working later for actual user
    username: 'JohnDoe',
    email: 'johndoe@example.com', 
    password: 'password123',
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    //  will add logic for this later to send the updated details to backend once i build the functoionality there

    // await axios.put('http://127.0.0.1:8000/api/account/update', updatedUserData);
    // After successful update:
    setEditing(false);
  };

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
          <p className="border p-2 rounded">*****</p>
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
