import { api } from "@/lib/api";
import { Livro } from "@/types/livro";
import { create } from "zustand";

type LivrosStoreType = {
  livros: Livro[] | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  findById: (id: number) => Promise<Livro | undefined>;
};

export const useLivrosStore = create<LivrosStoreType>((set, get) => ({
  livros: null,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get<Livro[]>("/livros");
      set({ 
        livros: response.data,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: "Erro ao carregar os livros",
        isLoading: false 
      });
    }
  },

  findById: async (id: number) => {
    // Acesso correto ao estado usando a função get()
    const currentState = get();
    
    // Verificação segura do array de livros
    if (currentState.livros) {
      const livroExistente = currentState.livros.find(l => l.id === id);
      if (livroExistente) return livroExistente;
    }

    set({ isLoading: true });

    try {
      const response = await api.get<Livro>(`/livros/${id}`);
      const novoLivro = response.data;

      // Atualização imutável do estado
      set(state => ({
        livros: state.livros ? [...state.livros, novoLivro] : [novoLivro],
        isLoading: false
      }));

      return novoLivro;
    } catch (error) {
      set({ 
        error: "Erro ao buscar livro",
        isLoading: false 
      });
      return undefined;
    }
  }
}));