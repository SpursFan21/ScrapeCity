import React from 'react';
import { Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})


function RegisterPage () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-blue-500 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl text-center mb-6">Register</h2>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Re-Enter Password"
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
};

export default RegisterPage;
