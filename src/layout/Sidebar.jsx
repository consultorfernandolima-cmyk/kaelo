import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarChart3, BriefcaseBusiness, ChevronDown, FileText, LayoutDashboard, Settings, Sun, WalletCards, Wrench, Building2 } from 'lucide-react'

const modules = [
  { to:'/empresa',label:'Empresa',icon:Building2,children:[{to:'/empresa/usuarios',label:'Usuários'},{to:'/empresa/perfis-grupos',label:'Perfil e Grupo de Usuários'},{to:'/empresa',label:'Sobre versão / licença'}]},
  { to:'/crm',label:'CRM',icon:BriefcaseBusiness,children:[{to:'/crm',label:'Leads'},{to:'/propostas',label:'Propostas'},{to:'/comercial/faturamento',label:'Faturamento'},{to:'/contratos',label:'Contratos'}]},
  { to:'/comercial',label:'Comercial',icon:FileText,children:[{to:'/clientes',label:'Parceiros'},{to:'/estoque',label:'Estoque'},{to:'/propostas',label:'Pedido / Orçamento'},{to:'/comercial/faturamento',label:'Faturamento'}]},
  { to:'/servicos',label:'Serviços',icon:Wrench,children:[{to:'/clientes',label:'Parceiros'},{to:'/ordens-servico',label:'Ordem de Serviço'},{to:'/estoque',label:'Estoque'},{to:'/servicos/faturamento',label:'Faturamento'}]},
  { to:'/gestao-usinas',label:'Gestão de UFV',icon:Sun,children:[{to:'/usinas',label:'Cadastro de Usinas'},{to:'/gestao-usinas/planejamento',label:'Planejamento O&M'},{to:'/ordens-servico',label:'Ordens de Serviço'},{to:'/gestao-usinas/equipamentos',label:'Equipamentos e Estoque'},{to:'/gestao-usinas/geracao',label:'Consumo e Geração'},{to:'/gestao-usinas/relatorio-consumo',label:'Relatório de Consumo e Geração'},{to:'/implantacoes',label:'Implantações'},{to:'/propostas',label:'Propostas'},{to:'/contratos',label:'Contratos'}]},
  { to:'/financeiro',label:'Financeiro',icon:WalletCards,children:[{to:'/financeiro',label:'Contas a Pagar'},{to:'/financeiro',label:'Contas a Receber'},{to:'/financeiro',label:'Retorno'},{to:'/financeiro',label:'Remessa'},{to:'/financeiro',label:'DDA'}]},
  { to:'/relatorios',label:'Relatórios',icon:BarChart3,children:[{to:'/relatorios',label:'Relatórios por módulo'}]},
  { to:'/configuracoes',label:'Configurações',icon:Settings,children:[{to:'/configuracoes/ufv/ongrid',label:'UFV On-grid'},{to:'/configuracoes/ufv/hibrido',label:'UFV Híbrido'},{to:'/configuracoes/financeiro/receber',label:'Financeiro · Contas a Receber'},{to:'/configuracoes/financeiro/bancaria',label:'Financeiro · Configuração Bancária'}]},
]

const matches=(m,p)=>m.to==='/empresa'&&p==='/configuracoes/acessos'?true:p===m.to||p.startsWith(m.to+'/')

export default function Sidebar(){
 const location=useLocation()
 const active=modules.find(m=>matches(m,location.pathname))
 const [open,setOpen]=useState(active?.to||'')
 return <aside className="flex w-72 shrink-0 flex-col bg-navy-950 text-slate-200">
  <div className="border-b border-white/10 px-5 py-5">
   <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-yellow text-navy-950"><span className="text-lg font-black">K</span></div><div><p className="text-base font-bold text-white">Kaelo</p><p className="text-[10px] uppercase tracking-[0.18em] text-solar-mint/80">ERP · Plataforma</p></div></div>
   <div className="mt-4 rounded-xl border border-white/10 bg-navy-900 px-3 py-2"><p className="text-[10px] uppercase tracking-wider text-slate-500">Organização</p><p className="mt-0.5 truncate text-xs font-semibold text-white">Minha organização</p></div>
  </div>
  <nav className="flex-1 overflow-y-auto px-3 py-4">
   <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Módulos</p>
   <div className="space-y-1">
    <NavLink to="/" end className={({isActive})=>['mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',isActive?'bg-navy-800 text-white':'text-slate-300 hover:bg-navy-900'].join(' ')}><LayoutDashboard size={17}/><span>Painel</span></NavLink>
    {modules.map(m=>{const Icon=m.icon;const isOpen=open===m.to;const isActive=matches(m,location.pathname);return <div key={m.to}>
      <button type="button" onClick={()=>setOpen(isOpen?'':m.to)} className={['flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',isActive||isOpen?'bg-navy-800 text-white':'text-slate-300 hover:bg-navy-900 hover:text-white'].join(' ')}>
       <Icon size={17} className={isActive||isOpen?'text-solar-yellow':'text-slate-400'}/><span className="flex-1">{m.label}</span><ChevronDown size={15} className={['transition-transform',isOpen?'rotate-180 text-solar-yellow':'text-slate-500'].join(' ')}/>
      </button>
      {isOpen&&<div className="ml-4 mt-1 mb-1 space-y-0.5 border-l border-white/10 pl-2">{m.children.map((c,i)=><NavLink key={c.to+c.label+i} to={c.to} end={c.to===m.to||c.to==='/'||c.to==='/empresa/usuarios'} className={({isActive})=>['block rounded-lg px-3 py-2 text-xs font-medium transition',isActive?'bg-navy-800 text-white':'text-slate-400 hover:bg-navy-900 hover:text-slate-100'].join(' ')}>{c.label}</NavLink>)}</div>}
    </div>})}
   </div>
  </nav>
  <div className="m-3 rounded-xl border border-white/10 bg-navy-900/80 p-3"><p className="text-xs font-medium text-white">Ambiente Kaelo</p><p className="mt-1 text-[11px] leading-relaxed text-slate-400">Os módulos permanecem visíveis. Clique no módulo para abrir ou recolher suas funcionalidades.</p></div>
 </aside>
}