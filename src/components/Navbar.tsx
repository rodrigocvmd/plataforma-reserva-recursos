'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  name: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      // A rota /api/auth/me só é acessível se o usuário estiver logado
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    }

    // Não busca o usuário em rotas de autenticação
    if (pathname !== '/login' && pathname !== '/register') {
      fetchUser();
    }
    // Fecha o menu móvel ao navegar para uma nova página
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-2xl font-bold">
                Resource Booker
              </Link>
            </div>
            {/* Desktop Menu Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/resources" className={`${pathname === '/resources' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                  Recursos
                </Link>
                {user && (
                  <>
                    <Link href="/my-resources" className={`${pathname === '/my-resources' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                      Meus Recursos
                    </Link>
                    <Link href="/resources/new" className={`${pathname === '/resources/new' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                      Criar Recurso
                    </Link>
                    <Link href="/profile" className={`${pathname === '/profile' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                      Meu Perfil
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Desktop User/Auth Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <span className="text-gray-300">Olá, {user.name || 'Usuário'}</span>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors">
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="flex flex-wrap justify-center space-x-4 px-2 pb-3 pt-2 sm:px-3">
            <Link href="/resources" className={`${pathname === '/resources' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-base font-medium transition-colors`}>
              Recursos
            </Link>
            {user ? (
              <>
                <Link href="/my-resources" className={`${pathname === '/my-resources' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-base font-medium transition-colors`}>
                  Meus Recursos
                </Link>
                <Link href="/resources/new" className={`${pathname === '/resources/new' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-base font-medium transition-colors`}>
                  Criar Recurso
                </Link>
                <Link href="/profile" className={`${pathname === '/profile' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-base font-medium transition-colors`}>
                  Meu Perfil
                </Link>
                <div className="border-t border-gray-700 pt-4 mt-4 w-full text-center">
                  <p className="px-3 text-base font-medium text-gray-400">Olá, {user.name || 'Usuário'}</p>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-700 pt-4 mt-4 w-full flex justify-center space-x-4">
                <Link href="/login" className="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Registrar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}