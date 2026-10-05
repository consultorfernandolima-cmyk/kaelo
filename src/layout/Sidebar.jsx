import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BriefcaseBusiness, ChevronRight, FileText, LayoutDashboard, Settings, Sun, WalletCards, Wrench, Building2 } from 'lucide-react'

const modules = [
  { to: '/empresa', label: 'Empresa', icon: Building2, children: [
    { to: '/configuracoes/acessos', label: 'Usuários' },
    { to: '/configuracoes/acessos', label: 'Perfil e Grupo de Usuários' },
    { to: '/empresa', label: 'Sobre versão / licença' },
  ]},
  { to: '/crm', label: 'CRM', icon: BriefcaseBusiness, children: [
    { to: '/crm', label: 'Leads' },
    { to: '/propostas', label: 'Propostas' },
    { to: '/comercial/faturamento', label: 'Faturamento' },
    { to: '/contratos', label: 'Contratos' },
  ]},
  { to: '/comercial', label: 'Comercial', icon: FileText, children: [
    { to: '/clientes', label: 'Parceiros' },
    { to: '/estoque', label: 'Estoque' },
    { to: '/propostas', label: 'Pedido / Orçamento' },
    { to: '/comercial/faturamento', label: 'Faturamento' },
  ]},
  { to: '/servicos', label: 'Serviços', icon: Wrench, children: [
    { to: '/clientes', label: 'Parceiros' },
    { to: '/ordens-servico', label: 'Ordem de Serviço' },
    { to: '/estoque', label: 'Estoque' },
    { to: '/servicos/faturamento', label: 'Faturamento' },
  ]},
  { to: '/gestao-usinas', label: 'Gestão de UFV', icon: Sun, children: [
    { to: '/usinas', label: 'Cadastro de Usinas' },
    { to: '/gestao-usinas/planejamento', label: 'Planejamento O&M' },
    { to: '/ordens-servico', label: 'Ordens de Serviço' },
    { to: '/gestao-usinas/equipamentos', label: 'Equipamentos e Estoque' },
    { to: '/gestao-usinas/geracao', label: 'Consumo e Geração' },
    { to: '/gestao-usinas/relatorio-consumo', label: 'Relatório de Consumo e Geração' },
    { to: '/implantacoes', label: 'Implantações' },
    { to: '/propostas', label: 'Propostas' },
    { to: '/contratos', label: 'Contratos' },
  ]},
  { to: '/financeiro', label: 'Financeiro', icon: WalletCards, children: [
    { to: '/financeiro', label: 'Contas a Pagar' },
    { to: '/financeiro', label: 'Contas a Receber' },
    { to: '/financeiro', label: 'Retorno' },
    { to: '/financeiro', label: 'Remessa' },
    { to: '/financeiro', label: 'DDA' },
  ]},
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3, children: [
    { to: '/relatorios', label: 'Relatórios por módulo' },
  ]},
  { to: '/configuracoes', label: 'Configurações', icon: Settings, children: [
    { to: '/configuracoes/ufv/ongrid', label: 'UFV On-grid' },
    { to: '/configuracoes/ufv/hibrido', label: 'UFV Híbrido' },
    { to: '/configuracoes/financeiro/receber', label: 'Financeiro · Contas a Receber' },
    { to: '/configuracoes/financeiro/bancaria', label: 'Financeiro · Configuração Bancária' },
  ]},
]

function matchesModule(item, pathname) {
  if (item.to === '/empresa' && pathname === '/configuracoes/acessos') return true
  return pathname === item.to || pathname.startsWith(item.to + '/')
}

function moduleForPath(pathname) {
  return modules.find(item => matchesModule(item, pathname)) || null
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeModule = moduleForPath(location.pathname)
  const [contextModule, setContextModule] = useState(() => activeModule?.to || null)
  const selected = modules.find(item => item.to === contextModule) || null

  // When navigation reaches a module naturally, keep its contextual menu.
  const effective = selected || activeModule

  if (effective) {
    const Icon = effective.icon
    return (
      <aside className="flex w-72 shrink-0 flex-col bg-navy-950 text-slate-200">
        <div className="border-b border-white/10 px-5 py-5">
          <button
            type="button"
            onClick={() => { setContextModule(null); navigate('/') }}
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={15} /> Voltar aos módulos
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950">
              <Icon size={19} />
            </div>
            <div>
              <p className="text-base font-bold text-white">{effective.label}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">Módulo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Funcionalidades</p>
          <div className="space-y-1">
            {effective.children.map((child, index) => (
              <NavLink
                key={child.to + child.label + index}
                to={child.to}
                onClick={() => setContextModule(effective.to)}
                className={({ isActive }) => [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-navy-800 text-white ring-1 ring-solar-yellow/30' : 'text-slate-300 hover:bg-navy-900 hover:text-white',
                ].join(' ')}
              >
                <ChevronRight size={15} className="text-slate-500" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3">
          <p className="text-xs font-medium text-white">{effective.label}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Selecione uma funcionalidade. Use “Voltar aos módulos” para retornar à lista principal.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col bg-navy-950 text-slate-200">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950"><span className="text-lg font-black">K</span></div>
          <div><p className="text-base font-bold text-white">Kaelo</p><p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">ERP · Plataforma</p></div>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-navy-900 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Organização</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white">Minha organização</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Módulos</p>
        <div className="space-y-1">
          {modules.map(item => {
            const Icon = item.icon
            return (
              <button key={item.to} type="button" onClick={() => { setContextModule(item.to); navigate(item.to) }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-navy-900 hover:text-white">
                <Icon size={18} className="text-slate-400" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            )
          })}
        </div>
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3">
        <p className="text-xs font-medium text-white">Ambiente Kaelo</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Selecione um módulo para abrir somente suas funcionalidades.</p>
      </div>
    </aside>
  )
}
