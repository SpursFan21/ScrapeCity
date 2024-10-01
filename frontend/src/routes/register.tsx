import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Prepare payload for the POST request
    const payload = {
      email,
      username,
      password,
    };

    try {
      // Make the POST request to the Django backend
      const response = await axios.post('http://127.0.0.1:8000/api/register/', payload, {
        headers: {
          'Content-Type': 'application/json', // Ensure correct Content-Type
        },
      });

      console.log(response.data);
      // Navigate to login page after successful registration
      navigate({ to: '/login' });
    } catch (error) {
      // Handle potential errors
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data.error || error.response?.data.message || "Registration failed.";
        setError(errorMsg);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-blue-500 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl text-center mb-6">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
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
          <div>
            <input
              type="password"
              placeholder="Re-Enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Register
            </button>
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
