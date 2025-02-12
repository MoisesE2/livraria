import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLivrosStore } from "@/store/livrosStore"; // Usando o nome correto da store
import ProductCard from "@/pages/NossosLivros/ProductCard";
import { Funnel } from "phosphor-react";

export function NossosLivros() {
  const { livros, load, isLoading } = useLivrosStore();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [filterSelected, setFilterSelected] = useState<string>("TODOS");
  const [showFilters, setShowFilters] = useState(false);
  const livrosArray = livros || [];
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const filters = ["TODOS", "LANÇAMENTOS", "DESTAQUES", "KINDLE"];

  const getFilteredLivros = () => {
    return livrosArray.filter((livro) => {
      switch (filterSelected) {
        case "LANÇAMENTOS":
          return livro.launch;
        case "DESTAQUES":
          return livro.highlight;
        case "KINDLE":
          return livro.eBook;
        default:
          return true;
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-podkova">
      <main className="w-full flex flex-col items-center mt-5 px-4 flex-grow">
        <div className="w-full max-w-7xl">
          {/* Navegação entre páginas */}
          <nav className="text-sm mb-4 text-gray-600 font-medium">
            <span
              className="cursor-pointer hover:underline hover:text-[#6B4B3E]"
              onClick={() => navigate("/")}
            >
              Início
            </span>{" "}
            &gt; <span className="text-[#6B4B3E]">Nossos Livros</span>
          </nav>

          {/* Cabeçalho com título e botão de filtro (desktop) */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#3A2D28]">NOSSOS LIVROS</h1>
            {screenWidth >= 800 && (
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-[#E5D2B8] text-[#3A2D28] px-4 py-2 rounded-lg hover:bg-[#D4C0A7] transition-colors"
                >
                  <Funnel size={20} weight="fill" />
                  Filtrar
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5D2B8] z-50">
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setFilterSelected(filter);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm ${
                          filterSelected === filter
                            ? "bg-[#F8F5F2] text-[#6B4B3E] font-semibold"
                            : "text-[#3A2D28] hover:bg-[#F8F5F2]"
                        } transition-colors first:rounded-t-lg last:rounded-b-lg`}
                      >
                        {filter.replace("KINDLE", "E-BOOK & KINDLE")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Select de filtros para telas pequenas */}
          {screenWidth < 800 && (
            <select
              name="Filtro"
              id="filter"
              className="w-full mb-6 p-3 rounded-lg border border-[#E5D2B8] bg-white text-[#3A2D28] focus:outline-none focus:ring-2 focus:ring-[#6B4B3E]"
              value={filterSelected}
              onChange={(e) => setFilterSelected(e.target.value)}
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter.replace("KINDLE", "E-BOOK & KINDLE")}
                </option>
              ))}
            </select>
          )}

          {/* Grid de ProductCards */}
          <div
            className={`grid gap-6 my-6 ${
              screenWidth < 800
                ? "grid-cols-1 w-4/5 mx-auto"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4B3E]"></div>
              </div>
            ) : (
              <>
                {livrosArray.length > 0 ? (
                  getFilteredLivros().length > 0 ? (
                    getFilteredLivros().map((livro) => (
                      <ProductCard livro={livro} key={livro.id} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-[#6B4B3E]">
                      Nenhum livro encontrado nesta categoria
                    </p>
                  )
                ) : (
                  <p className="col-span-full text-center text-[#6B4B3E]">
                    Nenhum livro disponível no momento
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}