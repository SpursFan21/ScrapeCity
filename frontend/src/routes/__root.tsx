import React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth, AuthProvider } from '../context/AuthContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isLoggedIn, user, handleLogout } = useAuth(); // Get auth context

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white fixed w-full">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold">
            <Link to="/">Scrape City</Link>
          </h1>
          <ul className="flex space-x-4">
            {/* Display different menus based on logged-in status */}
            {isLoggedIn ? (
              <>
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><Link to="/scraping-order" className="hover:underline">Scraping Order</Link></li>
                <li><Link to="/account" className="hover:underline">Account</Link></li>
                <li><button onClick={handleLogout} className="hover:underline">Log-out</button></li>
                <li className="ml-4">Welcome, {user?.username}</li>
              </>
            ) : (
              <>
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><Link to="/register" className="hover:underline">Register</Link></li>
                <li><Link to="/login" className="hover:underline">Log-in</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="flex-grow mt-16">
        <Outlet /> {/* This is where the nested routes will be rendered */}
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

// Wrap RootComponent in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  );
}
