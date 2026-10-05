import { useMemo, useState } from 'react'
import { FileCheck2, Search } from 'lucide-react'
import { formatCurrency, StatusBadge } from '../../components/ui.jsx'

const initial = [
 { id:'FAT-001', origem:'Pedido', cliente:'Clínica Vida Plena', documento:'P-220', valor:148900, status:'Em preparação', fiscal:'NFe' },
 { id:'FAT-002', origem:'OS', cliente:'Mercado Bom Preço', documento:'OS-1048', valor:1500, status:'Pronto para faturar', fiscal:'NFSe' },
 { id:'FAT-003', origem:'Contrato', cliente:'Fazenda Santa Luz', documento:'CT-001', valor:2000, status:'Faturado', fiscal:'NFSe' },
]

export default function FaturamentoPage(){
 const [rows,setRows]=useState(initial),[q,setQ]=useState('')
 const filtered=useMemo(()=>rows.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q.toLowerCase()))),[rows,q])
 function faturar(id){setRows(x=>x.map(r=>r.id===id?{...r,status:'Faturado'}:r))}
 return <section className="space-y-5">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Fiscal · Comercial / Serviços</p><h2 className="page-title">Faturamento</h2><p className="page-subtitle">Uma única rotina para faturar pedido, contrato ou ordem de serviço, conforme a operação e a licença.</p></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input pl-9" placeholder="Pesquisar..." value={q} onChange={e=>setQ(e.target.value)}/></div></header>
  <div className="grid gap-4 md:grid-cols-3"><div className="surface-card p-4"><p className="text-xs text-slate-500">Em preparação</p><p className="mt-1 text-xl font-bold text-navy-900">{formatCurrency(rows.filter(r=>r.status==='Em preparação').reduce((a,r)=>a+r.valor,0))}</p></div><div className="surface-card p-4"><p className="text-xs text-slate-500">Pronto para faturar</p><p className="mt-1 text-xl font-bold text-navy-900">{formatCurrency(rows.filter(r=>r.status==='Pronto para faturar').reduce((a,r)=>a+r.valor,0))}</p></div><div className="surface-card p-4"><p className="text-xs text-slate-500">Faturado</p><p className="mt-1 text-xl font-bold text-navy-900">{formatCurrency(rows.filter(r=>r.status==='Faturado').reduce((a,r)=>a+r.valor,0))}</p></div></div>
  <div className="surface-card overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Origem</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Documento</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Fiscal</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} className="border-t border-slate-100"><td className="px-4 py-3">{r.origem}</td><td className="px-4 py-3 font-medium text-navy-900">{r.cliente}</td><td className="px-4 py-3">{r.documento}</td><td className="px-4 py-3">{formatCurrency(r.valor)}</td><td className="px-4 py-3">{r.fiscal}</td><td className="px-4 py-3"><StatusBadge tone={r.status==='Faturado'?'green':r.status==='Pronto para faturar'?'yellow':'slate'}>{r.status}</StatusBadge></td><td className="px-4 py-3 text-right">{r.status!=='Faturado'&&<button onClick={()=>faturar(r.id)} className="btn-secondary"><FileCheck2 size={14}/> Faturar</button>}</td></tr>)}</tbody></table></div></div>
  <div className="surface-card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Integração futura</p><p className="mt-2 text-sm leading-6 text-slate-600">A emissão fiscal real será conectada depois. O fluxo demonstrativo já separa origem, documento, valor e tipo fiscal sem criar cadastros duplicados.</p></div>
 </section>
}