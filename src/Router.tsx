import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { HomePage } from "./pages/Home";
import { QuemSomosPage } from "./pages/QuemSomos";
import { CadastroDadosPessoais } from "./pages/LoginCadastro/cadastroDadosPessoais";
import { CadastroEndereco } from "./pages/LoginCadastro/cadastroEndereco";
import { CadastroSenha } from "./pages/LoginCadastro/cadastroSenha";
import { DashboardPage } from "./pages/DashBoard";
import { NossosLivros } from "./pages/NossosLivros";
import { Livros } from "./pages/Livros";
import { NossosServicos } from "./pages/NossosServicos";
import { NossosAutores } from "./pages/NossosAutores";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/LoginCadastro/loginPage";
import { Checkout } from "./pages/Checkout";
import { PapelariaAfetiva } from "./pages/Papelaria";
import { MeuPerfil } from "./pages/DashBoard/MeuPerfil"; 
import { ListaDesejos } from "./pages/DashBoard/ListaDesejos";
import { HistoricoPedidos } from "./pages/DashBoard/HistoricoPedidos";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas que usam o DefaultLayout */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="quemsomos" element={<QuemSomosPage />} />
          <Route path="nossosservicos" element={<NossosServicos />} />
          <Route path="nossoslivros" element={<NossosLivros />} />
          <Route path="livros/:id" element={<Livros />} />
          <Route path="nossosautores" element={<NossosAutores />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="papelariaafetiva" element={<PapelariaAfetiva />} />
          
          {/* Rotas do Dashboard */}
          <Route path="dashboard" element={<DashboardPage />}>
          <Route index element={<MeuPerfil />} /> {/* Rota padrão */}
          <Route path="meu-perfil" element={<MeuPerfil />} />
          <Route path="lista-desejos" element={<ListaDesejos />} />
          <Route path="historico-pedidos" element={<HistoricoPedidos />} />
        </Route>
        </Route>

        {/* Rotas de autenticação que usam o AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<CadastroDadosPessoais />} />
          <Route path="cadastro-endereco" element={<CadastroEndereco />} />
          <Route path="cadastro-senha" element={<CadastroSenha />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}