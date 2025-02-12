import { useEffect } from 'react';
import { BookOpen, HeartStraight } from 'phosphor-react';
import { useLivrosStore } from '@/store/livrosStore';
import { useFavoritosStore } from '@/store/favoritosStore';
import ProductCard from '@/pages/NossosLivros/ProductCard';

export function ListaDesejos() {
  const { livros = [], load: loadLivros } = useLivrosStore();
  const { favoritos, carregarFavoritos } = useFavoritosStore();

  useEffect(() => {
    loadLivros();
    carregarFavoritos();
  }, [loadLivros, carregarFavoritos]);

  const livrosFavoritos = livros?.filter(livro => favoritos.includes(livro.id)) || [];

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <BookOpen size={32} className="text-gray-400" />
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Lista de Desejos
          </h1>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {livrosFavoritos.length > 0 ? (
            livrosFavoritos.map((livro) => (
              <div 
                key={livro.id}
                className="transform transition-transform duration-300 hover:scale-105">
                <ProductCard livro={livro} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 space-y-6 sm:space-y-8">
              <HeartStraight 
                size={64} 
                className="text-gray-400 animate-pulse" 
                weight="regular"
              />
              <p className="text-gray-500 text-lg text-center max-w-md sm:whitespace-pre-line">
                Nenhum livro favoritado ainda!<span className="block sm:hidden"> </span> Clique no coração dos livros
                <span className="block sm:hidden"> </span> para adicioná-los aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
