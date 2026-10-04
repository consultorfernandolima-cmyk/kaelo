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
import GestaoUsinasPage from './modules/gestao-usinas/GestaoUsinasPage.jsx'
import PlanejamentoPage from './modules/gestao-usinas/PlanejamentoPage.jsx'
import EquipamentosPage from './modules/gestao-usinas/EquipamentosPage.jsx'
import GeracaoPage from './modules/gestao-usinas/GeracaoPage.jsx'
import RelatorioConsumoGeracaoPage from './modules/gestao-usinas/RelatorioConsumoGeracaoPage.jsx'
import CadastrosPage from './modules/cadastros/CadastrosPage.jsx'
import GruposFamiliasPage from './modules/cadastros/GruposFamiliasPage.jsx'
import ProdutosPage from './modules/cadastros/ProdutosPage.jsx'
import AcessosPage from './modules/cadastros/AcessosPage.jsx'
import ConfiguracoesPage from './modules/configuracoes/ConfiguracoesPage.jsx'
import FinanceiroPage from './modules/finance/FinanceiroPage.jsx'
import ModulePage from './modules/shared/ModulePage.jsx'

const modulePages = {
  '/estoque': ['Estoque', 'Produtos, depósitos, movimentos e saldos operacionais.', 'Estoque'],
  '/operacoes': ['Operações', 'Ordens, serviços, agenda e execução operacional.', 'Operações'],
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
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
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
        <Route path="/gestao-usinas" element={<GestaoUsinasPage />} />
        <Route path="/gestao-usinas/planejamento" element={<PlanejamentoPage />} />
        <Route path="/gestao-usinas/equipamentos" element={<EquipamentosPage />} />
        <Route path="/gestao-usinas/geracao" element={<GeracaoPage />} />
        <Route path="/gestao-usinas/relatorio-consumo" element={<RelatorioConsumoGeracaoPage />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        {Object.entries(modulePages).map(([path, [title, description, eyebrow]]) => (
          <Route key={path} path={path} element={<ModulePage title={title} description={description} eyebrow={eyebrow} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
