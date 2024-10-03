import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-500 text-white fixed w-full">
          <nav className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-3xl font-bold">
              <Link to="/">Scrape City</Link>
            </h1>
            <ul className="flex space-x-4">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/register" className="hover:underline">Register</Link></li>
              <li><Link to="/login" className="hover:underline">Log-in</Link></li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow">
          <Outlet /> {/* Renders the page content */}
        </main>

        {/* <footer className="bg-blue-500 text-white text-center py-4">
        <p>&copy; 2024 Scrape City. All rights reserved.</p>
      </footer> */}
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}