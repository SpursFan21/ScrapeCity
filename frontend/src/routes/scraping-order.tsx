import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

const ScrapingOrder: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md text-center">
        <h2 className="text-black text-2xl font-bold mb-6">Scraping Order Menu</h2>
        <div className="space-y-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600">
            New Scraping Order
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600">
            Current Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/scraping-order')({
  component: ScrapingOrder,
});

export default ScrapingOrder;
