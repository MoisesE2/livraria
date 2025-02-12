import { Livro } from "@/types/livro";
import { Star } from "phosphor-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

import livroComentario from "../../../../public/assets/images/livroComentarios.png";

interface ProdutoListHomeProps {
  title: string;
  livros: Livro[] | null;
  isLoading: boolean;
}

export function ComentariosAvaliacoes({
  livros,
  isLoading,
  title,
}: ProdutoListHomeProps) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-2xl font-playfair font-semibold mt-10 px-10 mb-5">
        {title}
      </h1>

      <div className="w-full relative overflow-hidden">
        {isLoading ? (
          <p className="w-full text-center text-xl font-semibold">
            Carregando - {title} ...
          </p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={5000}
            className="w-full"
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 8,
              },
              480: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 18,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
              1152: {
                slidesPerView: 4,
                spaceBetween: 22,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 15,
              },
              1536: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
          >
            {livros?.map((livro) => (
              <SwiperSlide
                key={livro.id}
                className="!flex !items-center !justify-center !h-auto pb-10"
              >
                <article className="flex flex-col items-center w-[230px] mb-8 rounded-lg pb-2 p-1.5 border-b-2 border-r-2 transition-transform transform hover:scale-105 hover:shadow-lg shadow-md">
                  <img
                    className="w-full rounded-t-lg"
                    src={livroComentario}
                    alt={`Imagem ${livro.title}`}
                  />
                  <div className="flex justify-start w-full ml-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} weight="fill" />
                    ))}
                  </div>
                  <h2 className="text-xs text-gray-500 text-center mt-1 mb-1 mx-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {livro.title}
                  </h2>
                  <p className="text-xs text-gray-500 text-center mx-2 w-full max-w-[280px] overflow-hidden line-clamp-3 leading-tight">
                    {truncateText("Uma leitura envolvente, com uma história que prende do início ao fim.", 80)}
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="flex flex-col items-center mt-5 mb-5">
        <button
          className="bg-white text-black py-2 px-4 rounded-full shadow-md font-bold hover:bg-gray-200 transition"
          onClick={() => alert("Direcionar para fazer um comentário")}
        >
          Fazer um Comentário
        </button>
      </div>
      <hr className="border-t border-black border-opacity-25 w-[50%] mt-8 mb-24" />
      <img
        className="mt-5 mb-10"
        src="/public/assets/images/descontos_politica.png"
        alt="Descontos e Política"
      />
    </section>
  );
}