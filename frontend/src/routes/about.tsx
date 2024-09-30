import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl text-center">
      <h1 className="text-3xl font-bold mb-4">About Scrape City</h1>
      
     {/* TODO */}

    </div>

  </div>
  )
}
