import React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth } from '../context/AuthContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Accessing auth context values using the custom hook
  const { isLoggedIn, user, loading, handleLogout } = useAuth();

  // Optionally handle logout in the context
  const onLogout = () => {
    handleLogout();
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Header rendering
  const renderHeader = () => {
    return (
      <header className="bg-blue-500 text-white fixed w-full">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold">
            <Link to="/">Scrape City</Link>
          </h1>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <>
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><Link to="/scraping-order" className="hover:underline">Scraping Order</Link></li>
                <li><Link to="/account" className="hover:underline">Account</Link></li>
                <li><button onClick={onLogout} className="hover:underline">Log-out</button></li>
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
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderHeader()}

      <main className="flex-grow mt-16"> {/* Added margin-top for spacing due to fixed header */}
        <Outlet /> {/* Renders the page content */}
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

export default RootComponent;
