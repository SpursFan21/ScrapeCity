import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router, RouterProvider, createFileRoute } from '@tanstack/react-router';
import { AuthProvider, useAuth } from '../context/AuthContext';


const homeRoute = createFileRoute('/')({
  component: HomeComponent,
});

// Create the router instance
const router = new Router({
  routes: [homeRoute], // Set the routes array with the home route
});

// Home component definition
function HomeComponent() {
  const { isLoggedIn, user } = useAuth(); // Access authentication state

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
        {isLoggedIn && <p className="text-gray-600">Logged in as: {user?.username}</p>}
      </div>
    </div>
  );
}

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} /> {/* Wrap RouterProvider with AuthProvider */}
    </AuthProvider>
  );
};

// Render the App component into the DOM
const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
