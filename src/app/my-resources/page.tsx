'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Resource {
  id: string;
  name: string;
  description: string;
}

export default function MyResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      const res = await fetch('/api/my-resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
      setLoading(false);
    }

    fetchResources();
  }, []);

  if (loading) {
    return <div>Carregando seus recursos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Meus Recursos</h1>
        <Link href="/resources/new" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
          Criar Novo Recurso
        </Link>
      </div>
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white shadow-md rounded p-4">
              <h2 className="text-xl font-semibold">{resource.name}</h2>
              <p>{resource.description}</p>
              {/* Adicionar botões de Editar e Deletar aqui no futuro */}
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não criou nenhum recurso.</p>
      )}
    </div>
  );
}
