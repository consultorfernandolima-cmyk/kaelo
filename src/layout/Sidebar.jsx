import { NavLink, useLocation } from 'react-router-dom'
import { BarChart3, BriefcaseBusiness, ChevronDown, ClipboardList, FileText, LayoutDashboard, Settings, Sun, WalletCards, Wrench, Building2 } from 'lucide-react'

const groups = [
  { label: 'Principal', items: [{ to: '/', label: 'Painel', icon: LayoutDashboard, end: true }] },
  { label: 'Módulos', items: [
    { to: '/empresa', label: 'Empresa', icon: Building2 },
    { to: '/crm', label: 'CRM', icon: BriefcaseBusiness },
    { to: '/comercial', label: 'Comercial', icon: FileText },
    { to: '/servicos', label: 'Serviços', icon: Wrench },
    { to: '/gestao-usinas', label: 'Gestão de UFV', icon: Sun, expandable: true },
    { to: '/financeiro', label: 'Financeiro', icon: WalletCards },
    { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    { to: '/configuracoes', label: 'Configurações', icon: Settings },
  ]},
]

const submenu = [
 {to:'/usinas',label:'Cadastro de Usinas'},
 {to:'/gestao-usinas/planejamento',label:'Planejamento O&M'},
 {to:'/ordens-servico',label:'Ordens de Serviço'},
 {to:'/gestao-usinas/equipamentos',label:'Equipamentos e Estoque'},
 {to:'/gestao-usinas/geracao',label:'Consumo e Geração'},
 {to:'/gestao-usinas/relatorio-consumo',label:'Relatório de Consumo e Geração'},
 {to:'/implantacoes',label:'Implantações'},
 {to:'/propostas',label:'Propostas'},
 {to:'/contratos',label:'Contratos'},
]

function active(pathname){ return ['/gestao-usinas','/usinas','/ordens-servico','/implantacoes'].some(p=>pathname===p||pathname.startsWith(p+'/')) }

export default function Sidebar(){ const location=useLocation(); const open=active(location.pathname); return <aside className="flex w-72 shrink-0 flex-col bg-navy-950 text-slate-200">
 <div className="border-b border-white/10 px-5 py-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950"><span className="text-lg font-black">K</span></div><div><p className="text-base font-bold text-white">Kaelo</p><p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">ERP · Plataforma</p></div></div><div className="mt-4 rounded-xl border border-white/10 bg-navy-900 px-3 py-2"><p className="text-[10px] uppercase tracking-wider text-slate-500">Organização</p><p className="mt-0.5 truncate text-xs font-semibold text-white">Minha organização</p></div></div>
 <nav className="flex-1 overflow-y-auto px-3 py-4"><div className="mb-5"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Módulos</p><div className="space-y-1">
 {groups[0].items.map(({to,label,icon:Icon,expandable})=>{const on=expandable?open:location.pathname===to||location.pathname.startsWith(to+'/');return <div key={to}><NavLink to={to} className={({isActive})=>['flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',isActive||on?'bg-navy-800 text-white ring-1 ring-solar-yellow/30':'text-slate-300 hover:bg-navy-900 hover:text-white'].join(' ')}><Icon size={17} className={on?'text-solar-yellow':'text-slate-400'}/><span className="flex-1">{label}</span>{expandable&&<ChevronDown size={15} className={on?'text-solar-yellow':'text-slate-500'}/>}</NavLink>{expandable&&<div className="ml-4 mt-1 border-l border-white/10 pl-2">{submenu.map(item=><NavLink key={item.to} to={item.to} className={({isActive})=>['block rounded-lg px-3 py-2 text-xs font-medium',isActive?'bg-navy-800/90 text-white':'text-slate-400 hover:bg-navy-900 hover:text-slate-100'].join(' ')}>{item.label}</NavLink>)}</div>}</div>})}
 </div></div></nav>
 <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3"><p className="text-xs font-medium text-white">Ambiente Kaelo</p><p className="mt-1 text-[11px] leading-relaxed text-slate-400">Módulos e permissões aparecem conforme licença e perfil.</p></div>
 </aside>}
