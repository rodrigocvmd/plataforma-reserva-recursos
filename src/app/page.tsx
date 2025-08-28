'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        // Se o usuário estiver logado, redireciona para a página de recursos
        router.push('/resources');
      } else {
        // Se não estiver logado, permite a renderização da página inicial
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    // Mostra uma tela de carregamento enquanto verifica a autenticação
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-blue-100">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Bem-vindo ao Resource Booker
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Sua plataforma para agendamento de recursos de forma fácil e rápida.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/resources"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Ver Recursos
        </Link>
        <Link
          href="/login"
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}