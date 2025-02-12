import { create } from 'zustand';

interface FavoritosStore {
  favoritos: number[];
  carregarFavoritos: () => void;
  toggleFavorito: (livroId: number) => void;
}

export const useFavoritosStore = create<FavoritosStore>((set) => ({
  favoritos: [],
  carregarFavoritos: () => {
    if (typeof window !== 'undefined') {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      set({ favoritos });
    }
  },
  toggleFavorito: (livroId) => {
    set((state) => {
      const novoFavoritos = state.favoritos.includes(livroId)
        ? state.favoritos.filter(id => id !== livroId)
        : [...state.favoritos, livroId];
      
      localStorage.setItem('favoritos', JSON.stringify(novoFavoritos));
      return { favoritos: novoFavoritos };
    });
  },
}));