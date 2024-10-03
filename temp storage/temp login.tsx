import React, { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });

      console.log(response.data);
      // Store the token in local storage
      localStorage.setItem('accessToken', response.data.access);

      // Decode and set the user information in context
      const userInfo = decodeToken(response.data.access);
      setUser(userInfo); // Update user state in context

      // Navigate to the homepage or dashboard after successful login
      navigate({ to: '/' }); // Update the navigation path as needed
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || "Login failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const decodeToken = (token: string) => {
    // Decode the JWT token here and extract user information
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      username: payload.username, // Adjust based on your token's payload structure
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-blue-500 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl text-center mb-6">Log in</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Log in
            </button>
            <Link to="/register" className="text-white hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
