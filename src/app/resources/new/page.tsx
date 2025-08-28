'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function NewResourcePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Please log in to create a resource.');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
        // Redirecionar para a página de login se não estiver autenticado
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in to create a resource.');
      return;
    }

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, ownerId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create resource');
      }

      router.push('/resources');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <p>Loading...</p>; // Ou um spinner de carregamento
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Resource</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Resource Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}