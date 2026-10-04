import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import DashboardPage from './modules/dashboard/DashboardPage.jsx'
import ClientesPage from './modules/clientes/ClientesPage.jsx'
import UsinasPage from './modules/usinas/UsinasPage.jsx'
import UsinaCadastroPage from './modules/usinas/UsinaCadastroPage.jsx'
import PropostasPage from './modules/propostas/PropostasPage.jsx'
import CRMPage from './modules/crm/CRMPage.jsx'
import RelatoriosPage from './modules/relatorios/RelatoriosPage.jsx'
import ContratosPage from './modules/contratos/ContratosPage.jsx'
import OrdensServicoPage from './modules/ordens-servico/OrdensServicoPage.jsx'
import ImplantacoesPage from './modules/implantacoes/ImplantacoesPage.jsx'
import CadastrosPage from './modules/cadastros/CadastrosPage.jsx'
import GruposFamiliasPage from './modules/cadastros/GruposFamiliasPage.jsx'
import ProdutosPage from './modules/cadastros/ProdutosPage.jsx'
import AcessosPage from './modules/cadastros/AcessosPage.jsx'
import ConfiguracoesPage from './modules/configuracoes/ConfiguracoesPage.jsx'
import ModulePage from './modules/shared/ModulePage.jsx'

const modulePages = {
  '/crm': ['CRM', 'Funil comercial, oportunidades, atividades e próximos contatos.', 'Comercial'],
  '/financeiro': ['Financeiro', 'Contas a pagar, receber, lançamentos e conciliação.', 'Financeiro'],
  '/estoque': ['Estoque', 'Produtos, depósitos, movimentos e saldos operacionais.', 'Estoque'],
  '/operacoes': ['Operações', 'Ordens, serviços, agenda e execução operacional.', 'Operações'],

  '/configuracoes': ['Configurações', 'Organização, empresas, parâmetros e integrações e controle de acesso.', 'Administração'],
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cadastros" element={<CadastrosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/cadastros/grupos-familias" element={<GruposFamiliasPage />} />
        <Route path="/cadastros/produtos" element={<ProdutosPage />} />
        <Route path="/configuracoes/acessos" element={<AcessosPage />} />
        <Route path="/cadastros/acessos" element={<Navigate to="/configuracoes/acessos" replace />} />
        <Route path="/usinas" element={<UsinasPage />} />
        <Route path="/usinas/cadastro" element={<UsinaCadastroPage />} />
        <Route path="/propostas" element={<PropostasPage />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/contratos" element={<ContratosPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/ordens-servico" element={<OrdensServicoPage />} />
        <Route path="/implantacoes" element={<ImplantacoesPage />} />
        {Object.entries(modulePages).map(([path, [title, description, eyebrow]]) => (
          <Route key={path} path={path} element={<ModulePage title={title} description={description} eyebrow={eyebrow} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
