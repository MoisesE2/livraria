import { Star, Heart } from "phosphor-react";
import { useNavigate, Link } from "react-router-dom";
import { Livro } from "@/types/livro";
import { autoresStore } from "@/store/autoresStore";
import { useEffect } from "react";
import { useFavoritosStore } from "@/store/favoritosStore";

export default function ProductCard({ livro }: { livro: Livro }) {
  const { load, getAutorNameById } = autoresStore();
  const { favoritos, toggleFavorito } = useFavoritosStore();
  const isFavorito = favoritos.includes(livro.id);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Link
      to={`/livros/${livro.id}`}
      className="flex flex-col justify-center items-center w-full min-w-[200px] max-w-[240px] h-80 rounded-xl p-3 border-2 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mx-auto relative group"
    >
      {/* Botão de Favoritos */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorito(livro.id);
        }}
        className={`absolute right-3 top-3 z-10 ${
          isFavorito ? "text-red-600" : "text-gray-600"
        } hover:opacity-80 transition-opacity`}
      >
        <Heart size={20} weight={isFavorito ? "fill" : "regular"} />
      </button>

      {/* Imagem do livro */}
      <div className="w-full h-40 mb-2 overflow-hidden flex items-center justify-center">
        <img
          className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-95"
          src={livro.imgSrc}
          alt={`Capa do livro ${livro.title}`}
          loading="lazy"
        />
      </div>

      {/* Informações do livro */}
      <div className="w-full flex-1 flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
            {livro.title}
          </h2>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
            {getAutorNameById(livro.authorId)}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-lg font-extrabold text-gray-900 mb-2">
            {`R$ ${livro.price.toFixed(2)}`}
          </p>
          
          {/* Avaliações */}
          <div className="flex gap-0.5 mb-2 text-yellow-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={16} weight="fill" />
            ))}
          </div>

          {/* Botão Saiba Mais */}
          <button
            className="w-full bg-[#E5D2B8] text-gray-900 py-2 px-4 rounded-md 
                     font-semibold text-sm hover:bg-[#d4c0a7] transition-colors
                     active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/livros/${livro.id}`);
            }}
          >
            Saiba Mais
          </button>
        </div>
      </div>
    </Link>
  );
}