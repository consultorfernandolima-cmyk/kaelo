import { Activity, CalendarDays, ClipboardList, Gauge, PackageSearch, Sun, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

const cards = [
  ['/usinas','Usinas','Cadastro técnico, clientes vinculados e histórico operacional.',Sun],
  ['/gestao-usinas/planejamento','Planejamento O&M','Recorrências, agenda, atividades previstas e pendências.',CalendarDays],
  ['/ordens-servico','Ordens de serviço','Execução, status, checklist e relatório técnico.',ClipboardList],
  ['/gestao-usinas/equipamentos','Equipamentos','Inversores e componentes com histórico de manutenção.',Wrench],
  ['/gestao-usinas/geracao','Geração e desempenho','Registros de geração e relatório mensal por usina.',Gauge],
]
const kpis = [['Usinas ativas','5'],['OS abertas','4'],['Preventivas pendentes','2'],['Limpezas previstas','4'],['Relatórios pendentes','3'],['Serviços próximos do vencimento','2']]

export default function GestaoUsinasPage() {
 return <section className="space-y-5">
  <header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operações · Gestão de Usinas</p><h2 className="page-title">Gestão de Usinas</h2><p className="page-subtitle">Painel operacional para administrar a carteira de usinas: o que fazer, quando, quem executa, evidências, resultado e histórico.</p></header>
  <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">{kpis.map(([label,value])=><div key={label} className="surface-card p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-navy-900">{value}</p></div>)}</div>
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map(([to,title,desc,Icon])=><Link key={to} to={to} className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-card"><div className="flex items-start gap-3"><span className="rounded-xl bg-navy-900 p-2 text-solar-yellow"><Icon size={18}/></span><div><h3 className="font-semibold text-navy-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p></div></div></Link>)}</div>
  <div className="surface-card p-5"><div className="flex items-start gap-3"><Activity className="mt-0.5 text-solar-green" size={19}/><div><h3 className="font-semibold text-navy-900">Regra operacional</h3><p className="mt-1 text-sm leading-6 text-slate-500">O Kaelo controla a execução operacional. Informações comerciais, licenciamento e autorização de módulos permanecem fora deste módulo.</p></div></div></div>
 </section>
}