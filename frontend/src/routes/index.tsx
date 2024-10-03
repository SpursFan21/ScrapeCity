import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

const HomeComponent: React.FC = () => {
  const { isLoggedIn, user } = useAuth(); // Destructure auth context values

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-4">Scraping Made Easy</h1>
        <h2 className="text-xl font-semibold mb-6">
          Welcome to Scrape City - Your Gateway to Effortless Data Extraction
        </h2>
        <p className="text-gray-600 leading-relaxed">
          At Scrape City, we simplify the world of web scraping, making it accessible
          and efficient for everyone. Our cutting-edge platform is designed to handle
          all your data extraction needs, allowing you to focus on what matters most: analyzing and utilizing your data.
        </p>

        {/* Show different messages depending on login status */}
        {isLoggedIn ? (
          <div>
            <h1 className="text-2xl font-bold mt-8">Welcome back, {user?.username}!</h1>
            <p className="text-xl">We're glad to have you back!</p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mt-8">Join Us!</h1>
            <p className="text-xl">Sign in or register to start scraping with us!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
