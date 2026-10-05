import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, BriefcaseBusiness, ChevronDown, FileText, LayoutDashboard, Settings, Sun, WalletCards, Wrench, Building2 } from 'lucide-react'

const groups = [
  {
    label: 'Principal',
    items: [
      { to: '/', label: 'Painel', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Módulos',
    items: [
      {
        to: '/empresa', label: 'Empresa', icon: Building2,
        children: [
          { to: '/configuracoes/acessos', label: 'Usuários' },
          { to: '/configuracoes/acessos', label: 'Perfil e Grupo de Usuários' },
          { to: '/empresa', label: 'Sobre versão / licença' },
        ],
      },
      {
        to: '/crm', label: 'CRM', icon: BriefcaseBusiness,
        children: [
          { to: '/crm', label: 'Leads' },
          { to: '/propostas', label: 'Propostas' },
          { to: '/comercial/faturamento', label: 'Faturamento' },
          { to: '/contratos', label: 'Contratos' },
        ],
      },
      {
        to: '/comercial', label: 'Comercial', icon: FileText,
        children: [
          { to: '/clientes', label: 'Cadastros → Parceiros' },
          { to: '/estoque', label: 'Estoque' },
          { to: '/propostas', label: 'Pedido / Orçamento' },
          { to: '/comercial/faturamento', label: 'Faturamento' },
        ],
      },
      {
        to: '/servicos', label: 'Serviços', icon: Wrench,
        children: [
          { to: '/clientes', label: 'Cadastros → Parceiros' },
          { to: '/ordens-servico', label: 'Ordem de Serviço' },
          { to: '/estoque', label: 'Estoque' },
          { to: '/servicos/faturamento', label: 'Faturamento' },
        ],
      },
      {
        to: '/gestao-usinas', label: 'Gestão de UFV', icon: Sun,
        children: [
          { to: '/usinas', label: 'Cadastro de Usinas' },
          { to: '/gestao-usinas/planejamento', label: 'Planejamento O&M' },
          { to: '/ordens-servico', label: 'Ordens de Serviço' },
          { to: '/gestao-usinas/equipamentos', label: 'Equipamentos e Estoque' },
          { to: '/gestao-usinas/geracao', label: 'Consumo e Geração' },
          { to: '/gestao-usinas/relatorio-consumo', label: 'Relatório de Consumo e Geração' },
          { to: '/implantacoes', label: 'Implantações' },
          { to: '/propostas', label: 'Propostas' },
          { to: '/contratos', label: 'Contratos' },
        ],
      },
      {
        to: '/financeiro', label: 'Financeiro', icon: WalletCards,
        children: [
          { to: '/financeiro', label: 'Contas a pagar' },
          { to: '/financeiro', label: 'Contas a receber' },
          { to: '/financeiro', label: 'Retorno' },
          { to: '/financeiro', label: 'Remessa' },
          { to: '/financeiro', label: 'DDA' },
        ],
      },
      {
        to: '/relatorios', label: 'Relatórios', icon: BarChart3,
        children: [
          { to: '/relatorios', label: 'Relatórios por módulo' },
        ],
      },
      {
        to: '/configuracoes', label: 'Configurações', icon: Settings,
        children: [
          { to: '/configuracoes/acessos', label: 'Configurações de Acesso' },
          { to: '/configuracoes/ufv/ongrid', label: 'UFV On-grid' },
          { to: '/configuracoes/ufv/hibrido', label: 'UFV Híbrido' },
          { to: '/configuracoes/financeiro/receber', label: 'Financeiro · Contas a Receber' },
          { to: '/configuracoes/financeiro/bancaria', label: 'Financeiro · Configuração Bancária' },
        ],
      },
    ],
  },
]

function moduleActive(to, pathname) {
  return pathname === to || pathname.startsWith(to + '/')
}

function findActiveMenu(pathname) {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.children && moduleActive(item.to, pathname)) return item.to
    }
  }
  return null
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(() => findActiveMenu(location.pathname))

  const toggleMenu = (item) => {
    if (!item.children) {
      navigate(item.to)
      return
    }

    const willOpen = openMenu !== item.to
    setOpenMenu(willOpen ? item.to : null)
    if (willOpen) navigate(item.to)
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col bg-navy-950 text-slate-200">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950">
            <span className="text-lg font-black">K</span>
          </div>
          <div>
            <p className="text-base font-bold text-white">Kaelo</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">ERP · Plataforma</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-navy-900 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Organização</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white">Minha organização</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map(group => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon
                const active = moduleActive(item.to, location.pathname)
                const expanded = openMenu === item.to

                if (!item.children) {
                  return (
                    <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => [
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                      isActive ? 'bg-navy-800 text-white ring-1 ring-solar-yellow/30' : 'text-slate-300 hover:bg-navy-900 hover:text-white',
                    ].join(' ')}>
                      <Icon size={17} className={active ? 'text-solar-yellow' : 'text-slate-400'} />
                      <span className="flex-1">{item.label}</span>
                    </NavLink>
                  )
                }

                return (
                  <div key={item.to}>
                    <button
                      type="button"
                      onClick={() => toggleMenu(item)}
                      className={[
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
                        active || expanded ? 'bg-navy-800 text-white ring-1 ring-solar-yellow/30' : 'text-slate-300 hover:bg-navy-900 hover:text-white',
                      ].join(' ')}
                    >
                      <Icon size={17} className={active || expanded ? 'text-solar-yellow' : 'text-slate-400'} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown size={16} className={expanded ? 'rotate-180 text-solar-yellow transition-transform' : 'text-slate-500 transition-transform'} />
                    </button>

                    {expanded && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                        {item.children.map((child, index) => (
                          <NavLink
                            key={child.to + child.label + index}
                            to={child.to}
                            className={({ isActive }) => [
                              'block rounded-lg px-3 py-2 text-xs font-medium transition',
                              isActive ? 'bg-navy-800/90 text-white' : 'text-slate-400 hover:bg-navy-900 hover:text-slate-100',
                            ].join(' ')}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3">
        <p className="text-xs font-medium text-white">Ambiente Kaelo</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Módulos e permissões aparecem conforme licença e perfil.</p>
      </div>
    </aside>
  )
}
