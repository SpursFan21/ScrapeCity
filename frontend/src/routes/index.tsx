import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

interface HelloData {
  message: string;
}

function HomeComponent() {
  const fetchHello = async (): Promise<HelloData> => {
    const response = await fetch('http://127.0.0.1:8000/api/hello/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery<HelloData>({
    queryKey: ['hello'],
    queryFn: fetchHello,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {(error as Error).message}</p>;

  return (
    // <div>
    //     <div className="h-20"></div>

    //   <h1>Message from Django Backend:</h1>
    //   <p>{data?.message}</p>
    // </div>
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

        <h1 className='text-2xl font-bold mt-8'>Message from Django Backend:</h1>
        <p className='text-xl'>
          {data?.message}</p>

      </div>

    </div>
  );
}