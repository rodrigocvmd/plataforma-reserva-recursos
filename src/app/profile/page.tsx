'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Se não estiver autenticado, redireciona para o login
        router.push('/login');
      }
      setLoading(false);
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      // Redireciona para a página inicial após o logout
      router.push('/');
    }
  };

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (!user) {
    return null; // ou uma mensagem de erro
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button 
          onClick={handleLogout} 
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}