import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { GiShoppingCart } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import ShopBagCard from './ShopBagCard';
import { getCartData } from '@/services/CookieCart';
import { X } from 'phosphor-react';

export default function ShopBag() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [livros, setLivros] = useState(getCartData());
  const [isEmpty, setIsEmpty] = useState<boolean>(livros.length === 0);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

  const handleUpdate = useCallback(() => {
  const updatedBooks = getCartData();
  setLivros(updatedBooks);
  setIsEmpty(updatedBooks.length === 0);
}, []);

  
  const handleCartClick = () => {
    try {
      setIsOpen((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsEmpty(livros.length === 0);
  }, [livros]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      isOpen &&
      !target.closest('#cart-bag') &&
      !target.closest('#content')
    ) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={handleCartClick}
        id='cart-bag'
      >
        <GiShoppingCart size={30} />
      </button>
      <AnimatePresence>
        {isOpen && screenWidth <= 800 && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Carrinho */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 bg-white shadow-lg w-[79%] border-l-4 border-[#B3B792] rounded-l-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                {/* Cabeçalho do Carrinho */}
                <div className="flex justify-between items-center py-3">
                  <p className='mx-auto font-bold text-xl text-[#B3B792] font-podkova'>Carrinho de compras</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mr-4 p-1 focus:inset-shadow-sm transition-all absolute right-0 border-2 border-[#B3B792] rounded-full text-[#B3B792] focus:bg-[#B3B792] focus:text-white"
                  >
                    <X size={18}/>
                  </button>
                </div>

                {/* Lista de Itens */}
                <div className="flex-1 overflow-y-auto">
                  <ShopBagCard onUpdate={handleUpdate} />
                </div>

                {/* Rodapé do Carrinho */}
                 <div className="pt-4 border-t w-full">
                        {isEmpty ? (
                  <button
                    className="border-2 font-semibold py-2 px-4 rounded-lg w-4/5 mx-[10%] mb-[10%] border-[#B3B792] text-[#B3B792] hover:text-white hover:bg-[#B3B792] transform-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Continuar comprando
                  </button>
                ) : (
                  <button
                    className="border-2 border-[#B3B792] w-4/5 mx-[10%] text-white mb-4 p-2 rounded-lg bg-[#B3B792] text-base font-semibold hover:bg-white hover:text-[#B3B792] transition-all duration-300"
                    onClick={() => {
                      navigate('/checkout');
                      setIsOpen(false);
                    }}
                  >
                    Finalizar compra
                  </button>
                )}
                 </div>
                 </div>
            </motion.div>
            </>
        )}
      </AnimatePresence>

  {isOpen && screenWidth > 800 && (
    <div
        className="flex flex-col bg-white rounded-lg z-50 transition-all ease-in-out duration-500 absolute right-[1%] top-[16%] h-4/6 w-1/4 drop-shadow-xl"
        id="content"
      >
        <div className="absolute -top-[9%] right-[9%] w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[45px] border-b-white"></div>
        <button
          id="close-cart"
          className="text-end mr-4 mt-2 font-semibold"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>
        <div className="my-5 pb-5 overflow-y-auto h-4/5">
          <ShopBagCard onUpdate={handleUpdate} />
        </div>
        {isEmpty ? (
          <button
            className="border-2 font-semibold py-2 px-4 rounded-lg w-4/5 mx-auto mb-[10%] border-[#B3B792] text-[#B3B792] hover:text-white hover:bg-[#B3B792] hover:w-[90%] transform-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Continuar comprando
          </button>
        ) : (
          <button
            className="w-4/5 mx-auto mb-4 p-2 rounded-lg bg-[#B3B792] text-black text-base font-semibold"
            onClick={() => {
              navigate('/checkout');
              setIsOpen(false);
            }}
          >
            Finalizar compra
          </button>
        )}
      </div>
  )}    </div>
  );
}
