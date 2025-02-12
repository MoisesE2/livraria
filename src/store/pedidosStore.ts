import { create } from 'zustand';
import axios from 'axios';
import { Pedido } from '@/types/pedido';

interface PedidosStore {
  pedidos: Pedido[];
  loadPedidos: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const usePedidosStore = create<PedidosStore>((set) => ({
  pedidos: [],
  isLoading: false,
  error: null,
  loadPedidos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/orders');
      set({ pedidos: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar pedidos', isLoading: false });
    }
  }
}));