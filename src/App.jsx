import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import DashboardPage from './modules/dashboard/DashboardPage.jsx'
import ClientesPage from './modules/clientes/ClientesPage.jsx'
import UsinasPage from './modules/usinas/UsinasPage.jsx'
import UsinaCadastroPage from './modules/usinas/UsinaCadastroPage.jsx'
import PropostasPage from './modules/propostas/PropostasPage.jsx'
import OrdensServicoPage from './modules/ordens-servico/OrdensServicoPage.jsx'
import ModulePage from './modules/shared/ModulePage.jsx'

const modulePages = {
  '/crm': ['CRM', 'Funil comercial, oportunidades, atividades e próximos contatos.', 'Comercial'],
  '/contratos': ['Contratos', 'Contratos, versões, documentos e histórico comercial.', 'Comercial'],
  '/financeiro': ['Financeiro', 'Contas a pagar, receber, lançamentos e conciliação.', 'Financeiro'],
  '/estoque': ['Estoque', 'Produtos, depósitos, movimentos e saldos operacionais.', 'Estoque'],
  '/operacoes': ['Operações', 'Ordens, serviços, agenda e execução operacional.', 'Operações'],
  '/relatorios': ['Relatórios', 'Indicadores e relatórios por empresa, período e permissão.', 'Gestão'],
  '/configuracoes': ['Configurações', 'Organização, empresas, usuários, parâmetros e integrações.', 'Administração'],
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/usinas" element={<UsinasPage />} />
        <Route path="/usinas/cadastro" element={<UsinaCadastroPage />} />
        <Route path="/propostas" element={<PropostasPage />} />
        <Route path="/ordens-servico" element={<OrdensServicoPage />} />

        {Object.entries(modulePages).map(([path, [title, description, eyebrow]]) => (
          <Route
            key={path}
            path={path}
            element={<ModulePage title={title} description={description} eyebrow={eyebrow} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
