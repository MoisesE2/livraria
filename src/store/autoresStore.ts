import { api } from "@/lib/api";
import { Autor } from "@/types/autor";
import { create } from "zustand";

type AutoresStoreType = {
  autores: Autor[] | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  findById: (id: number) => Promise<Autor | undefined>;
  getAutorNameById: (id?: number) => string;
};

export const autoresStore = create<AutoresStoreType>((set, get) => ({
  // Estados iniciais
  autores: null,
  isLoading: false,
  error: null,

  // Função para carregar todos os autores
  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<Autor[]>("/autores");
      set({ 
        autores: response.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: "Erro ao carregar os autores",
        isLoading: false 
      });
      console.error("Erro ao carregar autores:", error);
    }
  },

  // Função para buscar um autor por ID
  findById: async (id: number) => {
    set({ isLoading: true });

    const { autores } = get();

    // Verifica se o autor já está carregado
    if (autores) {
      const existingAutor = autores.find((autor) => autor.id === id);
      if (existingAutor) {
        set({ isLoading: false });
        return existingAutor;
      }
    }

    // Se não encontrou, busca na API
    try {
      const response = await api.get<Autor>(`/autores/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar autor:", error);
      set({ isLoading: false });
      return undefined;
    }
  },

  // Função para obter o nome do autor pelo ID
  getAutorNameById: (id?: number) => {
    const { autores } = get();

    // Se o ID for undefined ou null, retorna "Autor desconhecido"
    if (id === undefined || id === null) {
      return "Autor desconhecido";
    }

    // Busca o autor na lista carregada
    const autor = autores?.find((autor) => autor.id === id);

    // Retorna o nome do autor ou "Autor desconhecido" se não encontrado
    return autor ? autor.name : "Autor desconhecido";
  }
}));