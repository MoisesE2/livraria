import { useState, useEffect } from 'react';
import { CaretDown, CurrencyDollar, CreditCard, Bank, QrCode, Barcode } from 'phosphor-react';
import { usePedidosStore } from '@/store/pedidosStore';
import { useLivrosStore } from '@/store/livrosStore';
import { Pedido } from '@/types/pedido';
import { Livro } from '@/types/livro';

export function HistoricoPedidos() {
  const [pedidoAberto, setPedidoAberto] = useState<number | null>(null);
  const { pedidos, loadPedidos, isLoading, error } = usePedidosStore();
  const { livros, load } = useLivrosStore();

  useEffect(() => {
    loadPedidos();
    load();
  }, [loadPedidos, load]);

  const getStatus = (statusCode: number) => {
    switch(statusCode) {
      case 0: return { text: 'Processando', color: 'bg-amber-100 text-amber-800' };
      case 1: return { text: 'Enviado', color: 'bg-blue-100 text-blue-800' };
      case 2: return { text: 'Entregue', color: 'bg-green-100 text-green-800' };
      default: return { text: 'Desconhecido', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPagamento = (metodo: string) => {
    switch(metodo) {
      case 'creditCard': return { text: 'Cartão de Crédito', icon: <CreditCard size={20} /> };
      case 'pix': return { text: 'PIX', icon: <QrCode size={20} /> };
      case 'boleto': return { text: 'Boleto', icon: <Barcode size={20} /> };
      default: return { text: 'Outro', icon: <Bank size={20} /> };
    }
  };

  const encontrarLivro = (livroId: number): Livro | undefined => {
    return livros?.find((livro: Livro) => livro.id === livroId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4B3E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full flex flex-col font-podkova'>
      <main className='w-full flex flex-col mt-5 flex-grow px-4 md:px-8'>
        <div className='w-full mx-auto max-w-[2300px]'>
          <h1 className='text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#3A2D28]'>
            HISTÓRICO DE PEDIDOS
          </h1>

          <div className='space-y-3 md:space-y-4 w-full'>
            {pedidos.length === 0 ? (
              <div className='text-center py-6 md:py-8 text-[#6B4B3E]'>
                Nenhum pedido encontrado
              </div>
            ) : (
              pedidos.map((pedido: Pedido) => {
                const status = getStatus(pedido.status);
                const pagamento = getPagamento(pedido.paymentMethod);

                return (
                  <div 
                    key={pedido.id}
                    className='bg-white rounded-lg border border-[#E5D2B8] p-4 md:p-6 w-full max-w-[2000px] md:max-w-[3000px] mx-auto'
                  >
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-3 text-[#3A2D28]'>
                          {pagamento.icon}
                          <span className='font-semibold text-base md:text-lg'>#{pedido.id}</span>
                        </div>
                        <p className='text-sm md:text-base text-gray-600'>
                          {new Date(pedido.orderDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className='flex items-center gap-3 md:gap-6'>
                        <span className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base ${status.color}`}>
                          {status.text}
                        </span>
                        <div className='flex items-center gap-2 md:gap-3 text-[#6B4B3E]'>
                          <CurrencyDollar size={22} />
                          <span className='font-semibold text-base md:text-lg'>
                            {pedido.totalPrice.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => setPedidoAberto(pedidoAberto === pedido.id ? null : pedido.id)}
                          className='p-2 md:p-3 hover:bg-[#F8F5F2] rounded-lg transition-colors'
                        >
                          <CaretDown
                            size={22}
                            weight='bold'
                            className={`transform transition-transform ${
                              pedidoAberto === pedido.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {pedidoAberto === pedido.id && (
                      <div className='mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5D2B8]'>
                        <h3 className='text-sm md:text-base font-semibold text-[#3A2D28] mb-3 md:mb-4'>
                          PRODUTOS
                        </h3>
                        <div className='space-y-3 md:space-y-4'>
                          {pedido.products.map((produtoId, index) => {
                            const livro = encontrarLivro(produtoId);
                            return livro ? (
                              <div key={index} className='flex justify-between text-sm md:text-base'>
                                <div>
                                  <p className='text-[#3A2D28]'>{livro.title}</p>
                                  <p className='text-gray-600'>{livro.authorId}</p>
                                </div>
                                <div className='text-right'>
                                  <p className='text-[#6B4B3E]'>
                                    {livro.price.toLocaleString('pt-BR', { 
                                      style: 'currency', 
                                      currency: 'BRL' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}