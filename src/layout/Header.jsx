import { Bell, ChevronDown, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/': ['Painel', 'Visão geral da operação'],
  '/clientes': ['Parceiros', 'Cadastros'],
  '/usinas': ['Usinas', 'Setorial'],
  '/usinas/cadastro': ['Cadastro de Usina', 'Setorial'],
  '/propostas': ['Propostas', 'Comercial'],
  '/ordens-servico': ['Ordens de serviço', 'Operações'],
  '/crm': ['CRM', 'Comercial'],
  '/contratos': ['Contratos', 'Comercial'],
  '/financeiro': ['Financeiro', 'Gestão financeira'],
  '/estoque': ['Estoque', 'Operação'],
  '/operacoes': ['Operações', 'Operação'],
  '/relatorios': ['Relatórios', 'Gestão'],
  '/configuracoes': ['Configurações', 'Administração'],
}

export default function Header() {
  const { pathname } = useLocation()
  const [title, section] = titles[pathname] ?? ['Kaelo', 'ERP']

  return (
    <header className="border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Kaelo</span>
            <span>/</span>
            <span>{section}</span>
          </div>
          <h1 className="mt-0.5 truncate text-lg font-semibold text-navy-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Empresa</span>
            <button type="button" className="flex items-center gap-1.5 text-xs font-semibold text-navy-900">
              Matriz
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </div>

          <label className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar no Kaelo…"
              className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-navy-700 focus:bg-white focus:ring-2 focus:ring-solar-yellow/40"
            />
          </label>

          <button type="button" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50" aria-label="Notificações">
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-solar-yellow" />
          </button>

          <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-solar-yellow">FL</div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-navy-900">Administrador</p>
              <p className="text-[11px] text-slate-500">Acesso operacional</p>
            </div>
            <ChevronDown size={13} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}
