import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Sun,
  Warehouse,
} from 'lucide-react'

const groups = [
  {
    label: 'Visão geral',
    items: [{ to: '/', label: 'Painel', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/cadastros', label: 'Cadastros', icon: ClipboardList, end: true },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { to: '/crm', label: 'CRM', icon: BriefcaseBusiness },
      { to: '/propostas', label: 'Propostas', icon: FileText },
      { to: '/contratos', label: 'Contratos', icon: FileText },
    ],
  },
  {
    label: 'Operação',
    items: [
      { to: '/ordens-servico', label: 'Ordens de serviço', icon: ClipboardList },
      { to: '/implantacoes', label: 'Implantações', icon: Sun },
      { to: '/operacoes', label: 'Operações', icon: BriefcaseBusiness },
      { to: '/estoque', label: 'Estoque', icon: Warehouse },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { to: '/financeiro', label: 'Financeiro', icon: BarChart3 },
      { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    label: 'Administração',
    items: [
      { to: '/configuracoes', label: 'Configurações', icon: Settings, end: true },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-navy-950 text-slate-200">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950 shadow-lg shadow-solar-yellow/20">
            <span className="text-lg font-black">K</span>
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">Kaelo</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">ERP · Plataforma</p>
          </div>
        </div>
        <button type="button" className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-left hover:bg-navy-800">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Organização</p>
            <p className="mt-0.5 truncate text-xs font-semibold text-white">Minha organização</p>
          </div>
          <span className="text-xs text-slate-500">⌄</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-navy-800 text-white shadow-inner ring-1 ring-solar-yellow/40'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={17} className={isActive ? 'text-solar-yellow' : 'text-slate-400'} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-solar-yellow" />
          <p className="text-xs font-medium text-white">Ambiente Kaelo</p>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
          Módulos e permissões serão definidos pela organização e licença.
        </p>
      </div>
    </aside>
  )
}
