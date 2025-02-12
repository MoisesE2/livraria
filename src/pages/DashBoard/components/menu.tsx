import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import usuario from "../../../../public/assets/images/usuario.png"; // Imagem padrão
import {
  ArrowLeft,
  ArrowRight,
  User,
  Heart,
  Archive,
  SignOut,
} from "phosphor-react"; // Importando ícones

export function MenuDashBoard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [profileImage, setProfileImage] = useState(usuario); // Estado para a imagem

  // Atualiza a imagem do perfil ao carregar o componente
  useEffect(() => {
    const savedAvatar = localStorage.getItem("profileAvatar");
    if (savedAvatar) {
      setProfileImage(savedAvatar);
    }

    // Observa mudanças no localStorage para sincronização em tempo real
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "profileAvatar") {
        setProfileImage(e.newValue || usuario);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const itens = [
    {
      texto: "Meu Perfil",
      rota: "/dashboard/meu-perfil",
      icon: <User size={20} />,
    },
    {
      texto: "Lista de Desejos",
      rota: "/dashboard/lista-desejos",
      icon: <Heart size={20} />,
    },
    {
      texto: "Histórico de Pedidos",
      rota: "/dashboard/historico-pedidos",
      icon: <Archive size={20} />,
    },
    { texto: "Sair", rota: "/", icon: <SignOut size={20} /> },
  ];

  return (
    <aside
      className={`fixed left-4 md:top-[15%] top-[25%] z-40 bg-white 
rounded-xl     transition-all duration-300 min-h-[300px] 
${collapsed ? "w-16" : "w-64"}
    overflow-y-auto scrollbar-hide touch-pan-y md:touch-auto
    shadow-custom`}>
      <div className="flex flex-col p-3 h-full justify-between">
        {/* Top Section */}
        <div>
          {/* Botão de toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="self-end p-2 mb-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ArrowRight size={20} weight="bold" />
            ) : (
              <ArrowLeft size={20} weight="bold" />
            )}
          </button>

          {/* Imagem do perfil */}
          <div className="flex justify-center mb-6">
            <img
              src={profileImage} // Usa a imagem do estado
              alt="Usuário"
              className={`
                rounded-full object-cover border-2 border-[#B3B792]
                transition-all duration-300
                ${collapsed ? "w-10 h-10" : "w-14 h-14"}
              `}
            />
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-3 flex-1">
          {itens.map((item, index) => (
            <Link
              key={index}
              to={item.rota}
              onClick={() => handleClick(index)}
              className={`
                flex items-center gap-3 p-3 rounded-xl
                transition-all duration-300 hover:bg-[#B3B792]/20
                ${activeIndex === index ? "bg-[#B3B792] text-white" : "text-gray-600"}
                ${collapsed ? "justify-center" : "pl-4"}
                min-h-[48px]
              `}
            >
              {collapsed ? (
                <span className="text-gray-600">{item.icon}</span> // Ícone no menu fechado
              ) : (
                <>
                  {item.icon}
                  <span className="text-base">{item.texto}</span>
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}