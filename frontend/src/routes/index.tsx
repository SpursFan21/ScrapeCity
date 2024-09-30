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
    <div>
      <h1>Message from Django Backend:</h1>
      <p>{data?.message}</p>
    </div>
  );
}
