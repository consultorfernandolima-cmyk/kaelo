import { useMemo, useState } from 'react'
import { FileText, Plus, Search, Eye, Printer, Sun, ShieldCheck } from 'lucide-react'
import { formatCurrency, StatusBadge } from '../../components/ui.jsx'

const initial = [
 {id:'P-220',cliente:'Clínica Vida Plena',modelo:'Integrador',tipo:'Energia Solar',objeto:'Implantação de sistema fotovoltaico com fornecimento e instalação',valor:148900,etapa:'Enviada',validade:'15/10/2026'},
 {id:'P-221',cliente:'Escola Horizonte',modelo:'Integrador',tipo:'Energia Solar',objeto:'Projeto e instalação de sistema fotovoltaico',valor:312000,etapa:'Em elaboração',validade:'22/10/2026'},
 {id:'P-218',cliente:'Condomínio Solar Park',modelo:'Serviços O&M',tipo:'Energia Solar',objeto:'Plano anual de operação, manutenção preventiva e limpeza de módulos',valor:890500,etapa:'Negociação',validade:'05/10/2026'},
]
const tones={Enviada:'navy','Em elaboração':'slate',Negociação:'yellow'}
const modelInfo={
 Integrador:{
  title:'Proposta de Energia Solar — Integrador',
  description:'Modelo para empresas que projetam, fornecem, instalam e entregam sistemas fotovoltaicos.',
  services:['Projeto e dimensionamento','Fornecimento de equipamentos e materiais','Instalação e comissionamento','Homologação e engenharia','Manutenção e monitoramento']
 },
 'Serviços O&M':{
  title:'Proposta de Energia Solar — Serviços O&M',
  description:'Modelo para empresas especializadas em operação e manutenção de usinas e sistemas fotovoltaicos.',
  services:['Operação e monitoramento','Manutenção preventiva','Manutenção corretiva','Limpeza de módulos','Inspeções e atendimento técnico']
 }
}

export default function PropostasPage(){
 const [items,setItems]=useState(initial),[q,setQ]=useState(''),[modal,setModal]=useState(false),[view,setView]=useState(null)
 const [licenseType,setLicenseType]=useState('Integrador')
 const model=modelInfo[licenseType]
 const rows=useMemo(()=>items.filter(i=>Object.values(i).some(v=>String(v).toLowerCase().includes(q.toLowerCase()))),[items,q])

 function save(e){
  e.preventDefault()
  const v=Object.fromEntries(new FormData(e.currentTarget))
  const item={id:`P-${String(items.length+220).padStart(3,'0')}`,modelo:licenseType,tipo:'Energia Solar',...v,valor:Number(v.valor||0)}
  setItems(x=>[item,...x]);setModal(false);setView(item)
 }

 return <section className="space-y-5">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
   <div>
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Comercial · Gestão de Usinas</p>
    <h2 className="page-title">Propostas de Energia Solar</h2>
    <p className="page-subtitle">Modelos específicos para Integradores e empresas de Serviços O&M.</p>
   </div>
   <div className="flex gap-2">
    <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input pl-9" placeholder="Pesquisar cliente, proposta ou serviço..." value={q} onChange={e=>setQ(e.target.value)}/></div>
    <button className="btn-primary" onClick={()=>setModal(true)}><Plus size={16}/> Nova proposta</button>
   </div>
  </header>

  <div className="surface-card p-4">
   <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-start gap-3">
     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-green/10 text-solar-green"><ShieldCheck size={19}/></div>
     <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tipo de empresa definido pela licença</p>
      <div className="mt-1 flex items-center gap-2"><span className="text-lg font-bold text-navy-900">{licenseType}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Não editável na proposta</span></div>
      <p className="mt-1 text-xs text-slate-500">{model.description}</p>
     </div>
    </div>
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 lg:min-w-[340px]">
     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Simulação para validação</p>
     <div className="mt-2 flex gap-2">
      {['Integrador','Serviços O&M'].map(type=><button key={type} type="button" className={`rounded-lg px-3 py-2 text-xs font-semibold ${licenseType===type?'bg-navy-900 text-white':'bg-white text-slate-600 ring-1 ring-slate-200'}`} onClick={()=>setLicenseType(type)}>{type}</button>)}
     </div>
     <p className="mt-2 text-[10px] text-slate-400">Na integração real, este valor virá do pacote de licença liberado pelo Solar ERP.</p>
    </div>
   </div>
  </div>

  <div className="grid gap-4 md:grid-cols-3">
   {['Em elaboração','Enviada','Negociação'].map(s=><div key={s} className="surface-card p-4"><p className="text-xs text-slate-500">{s}</p><p className="mt-1 text-xl font-bold text-navy-900">{rows.filter(i=>i.etapa===s).length}</p><p className="mt-1 text-xs text-slate-400">{formatCurrency(rows.filter(i=>i.etapa===s).reduce((a,i)=>a+i.valor,0))}</p></div>)}
  </div>

  <div className="surface-card overflow-hidden">
   <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Código</th><th>Cliente</th><th>Modelo</th><th>Objeto</th><th>Valor</th><th>Etapa</th><th>Validade</th><th>Ações</th></tr></thead>
   <tbody>{rows.map(i=><tr key={i.id}><td className="font-medium">{i.id}</td><td>{i.cliente}</td><td><StatusBadge tone={i.modelo==='Integrador'?'navy':'slate'}>{i.modelo}</StatusBadge></td><td>{i.objeto}</td><td>{formatCurrency(i.valor)}</td><td><StatusBadge tone={tones[i.etapa]||'slate'}>{i.etapa}</StatusBadge></td><td>{i.validade}</td><td><button className="text-xs font-semibold text-navy-800 hover:underline" onClick={()=>setView(i)}><Eye size={14} className="mr-1 inline"/>Visualizar</button></td></tr>)}</tbody></table></div>
  </div>

  {modal&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
   <form onSubmit={save} className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5"><Sun size={19}/></div><div><h3 className="text-lg font-semibold text-navy-900">{model.title}</h3><p className="text-xs text-slate-500">Modelo determinado pela licença da organização</p></div></div>
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tipo de empresa</p><p className="mt-1 font-semibold text-navy-900">{licenseType}</p><p className="mt-1 text-xs text-slate-500">Campo informativo. Não pode ser alterado na criação da proposta.</p></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <label className="field md:col-span-2"><span>Cliente</span><input name="cliente" className="input" required/></label>
     <label className="field"><span>Modalidade</span><input className="input bg-slate-50" value={licenseType==='Integrador'?'Implantação / integração fotovoltaica':'Operação e manutenção (O&M)'} readOnly/></label>
     <label className="field"><span>Valor total</span><input name="valor" type="number" className="input" required/></label>
     <label className="field md:col-span-2"><span>Objeto da proposta</span><input name="objeto" className="input" placeholder={licenseType==='Integrador'?'Ex.: Projeto, fornecimento e instalação de sistema fotovoltaico':'Ex.: Plano anual de manutenção preventiva e limpeza de módulos'} required/></label>
     <div className="md:col-span-2"><p className="text-xs font-semibold text-navy-900">Escopo sugerido para este modelo</p><div className="mt-2 flex flex-wrap gap-2">{model.services.map(s=><span key={s} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{s}</span>)}</div></div>
     <label className="field"><span>Etapa</span><select name="etapa" className="input"><option>Em elaboração</option><option>Enviada</option><option>Negociação</option></select></label>
     <label className="field"><span>Validade</span><input name="validade" type="date" className="input" required/></label>
    </div>
    <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn-primary">Criar proposta</button></div>
   </form>
  </div>}

  {view&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
   <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Gestão de Usinas · Proposta</p><h3 className="mt-1 text-2xl font-bold text-navy-900">{view.id}</h3><p className="mt-1 text-sm text-slate-500">{view.cliente}</p></div><button className="btn-secondary" onClick={()=>setView(null)}>Fechar</button></div></div>
   <div className="space-y-5 p-6"><div className="grid gap-4 md:grid-cols-4"><div><p className="text-xs text-slate-500">Modelo</p><p className="mt-1 font-semibold">{view.modelo}</p></div><div><p className="text-xs text-slate-500">Valor</p><p className="mt-1 font-semibold">{formatCurrency(view.valor)}</p></div><div><p className="text-xs text-slate-500">Etapa</p><p className="mt-1 font-semibold">{view.etapa}</p></div><div><p className="text-xs text-slate-500">Validade</p><p className="mt-1 font-semibold">{view.validade}</p></div></div>
    <div className="rounded-xl border border-slate-200 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Objeto</p><p className="mt-2 text-base text-navy-900">{view.objeto}</p></div>
    <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-semibold text-navy-900">{view.modelo==='Integrador'?'Escopo do integrador':'Escopo de Serviços O&M'}</p><div className="mt-3 flex flex-wrap gap-2">{modelInfo[view.modelo].services.map(s=><span key={s} className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200">{s}</span>)}</div></div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-900">Documento demonstrativo</p><p className="mt-1 text-sm leading-6 text-amber-800">Estrutura preparada para validação visual. O conteúdo comercial, condições, escopo detalhado, periodicidade e composição de preços serão refinados antes da integração com a licença e o banco de dados.</p></div>
    <button className="btn-primary" onClick={()=>window.print()}><Printer size={16}/> Imprimir / PDF</button>
   </div>
  </article></div>}
 </section>
}
