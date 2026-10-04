import { useMemo, useState } from 'react'
import { Eye, Plus, Printer, Search, ShieldCheck, Sun, Calculator, AlertTriangle } from 'lucide-react'
import { formatCurrency, StatusBadge } from '../../components/ui.jsx'
import { calcHybrid, calcHybridFromLoads, calcOnGrid, calcPriceFormation } from './dimensionamento.js'

const initial = [
 {id:'P-220',cliente:'Clínica Vida Plena',modelo:'Integrador',tipoProjeto:'On-grid',tipo:'Energia Solar',objeto:'Implantação de sistema fotovoltaico com fornecimento e instalação',valor:148900,etapa:'Enviada',validade:'15/10/2026'},
 {id:'P-221',cliente:'Escola Horizonte',modelo:'Integrador',tipoProjeto:'On-grid',tipo:'Energia Solar',objeto:'Projeto e instalação de sistema fotovoltaico',valor:312000,etapa:'Em elaboração',validade:'22/10/2026'},
 {id:'P-218',cliente:'Condomínio Solar Park',modelo:'Serviços O&M',tipoProjeto:'O&M',tipo:'Energia Solar',objeto:'Plano anual de operação, manutenção preventiva e limpeza de módulos',valor:890500,etapa:'Negociação',validade:'05/10/2026'},
]
const tones={Enviada:'navy','Em elaboração':'slate',Negociação:'yellow'}
const modelInfo={
 Integrador:{title:'Proposta de Energia Solar — Integrador',description:'Modelo para empresas que projetam, fornecem, instalam e entregam sistemas fotovoltaicos.',services:['Projeto e dimensionamento','Fornecimento de equipamentos e materiais','Instalação e comissionamento','Homologação e engenharia','Manutenção e monitoramento']},
 'Serviços O&M':{title:'Proposta de Energia Solar — Serviços O&M',description:'Modelo para empresas especializadas em operação e manutenção de usinas e sistemas fotovoltaicos.',services:['Operação e monitoramento','Manutenção preventiva','Manutenção corretiva','Limpeza de módulos','Inspeções e atendimento técnico']}
}

const money = value => formatCurrency(Number(value || 0))
const num = value => Number(value || 0).toLocaleString('pt-BR',{maximumFractionDigits:2})

export default function PropostasPage(){
 const [items,setItems]=useState(initial),[q,setQ]=useState(''),[modal,setModal]=useState(false),[view,setView]=useState(null)
 const [licenseType,setLicenseType]=useState('Integrador')
 const [projectType,setProjectType]=useState('On-grid')
 const [dimensionModal,setDimensionModal]=useState(false)
 const [dimensionType,setDimensionType]=useState('On-grid')
 const [onGrid,setOnGrid]=useState({consumoMensal:900,hsp:5.2,performanceRatio:81,potenciaModuloWp:550})
 const [hybrid,setHybrid]=useState({objetivo:'backup',energiaDiaria:12.84,potenciaCriticaKw:1.6,potenciaPicoKva:3.77,fatorPotencia:0.95,duracaoHoras:8,autonomiaDias:1,dod:90,eficiencia:95,degradacao:0,margem:10,bateriaNominalKwh:5.8,bateriaPotenciaKw:2.8,inversorPotenciaKva:5})
 const [priceForm,setPriceForm]=useState({kit:0,instalacao:0,projetoEletrico:0,art:0,materialCc:0,materialCa:0,transformador:0,frete:0,outros:0,impostos:0,comissao:0,margem:20})
 const [useLoads,setUseLoads]=useState(false)
 const [loads,setLoads]=useState([])
 const model=modelInfo[licenseType]
 const rows=useMemo(()=>items.filter(i=>Object.values(i).some(v=>String(v).toLowerCase().includes(q.toLowerCase()))),[items,q])
 const onGridResult=calcOnGrid(onGrid)
 const loadResult=calcHybridFromLoads({loads,backupHours:hybrid.duracaoHoras})
 const hybridResult=calcHybrid({...hybrid,...(useLoads?{energiaNecessariaOverride:hybrid.objetivo==='backup'?loadResult.criticalEnergy:loadResult.dailyEnergy,potenciaCriticaKw:loadResult.criticalPower,potenciaPicoOverride:Math.max(hybrid.potenciaPicoKva,loadResult.connectedPeak / Math.max(0.1,Number(hybrid.fatorPotencia || 0.95)))}:{})})
 const priceResult=calcPriceFormation(priceForm)
 function updatePrice(name,value){setPriceForm(x=>({...x,[name]:value}))}

 function save(e){
  e.preventDefault()
  const v=Object.fromEntries(new FormData(e.currentTarget))
  const item={id:`P-${String(items.length+220).padStart(3,'0')}`,modelo:licenseType,tipo:'Energia Solar',tipoProjeto:projectType,...v,valor:Number(v.valor||0)}
  setItems(x=>[item,...x]);setModal(false);setView(item)
 }

 function updateOnGrid(name,value){setOnGrid(x=>({...x,[name]:value}))}
 function updateHybrid(name,value){setHybrid(x=>({...x,[name]:value}))}
 function addLoad(){setLoads(x=>[...x,{name:'Nova carga',powerKw:'',hoursPerDay:'',simultaneity:1,critical:true}])}
 function updateLoad(index,name,value){setLoads(x=>x.map((load,i)=>i===index?{...load,[name]:value}:load))}
 function removeLoad(index){setLoads(x=>x.filter((_,i)=>i!==index))}

 return <section className="space-y-5">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
   <div>
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Comercial · Gestão de Usinas</p>
    <h2 className="page-title">Propostas de Energia Solar</h2>
    <p className="page-subtitle">Propostas específicas para Integradores, com dimensionamento On-grid e Híbrido preparados para validação.</p>
   </div>
   <div className="flex flex-wrap gap-2">
    <button className="btn-secondary" onClick={()=>setDimensionModal(true)}><Calculator size={16}/> Dimensionar</button>
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
     <div className="mt-2 flex gap-2">{['Integrador','Serviços O&M'].map(type=><button key={type} type="button" className={`rounded-lg px-3 py-2 text-xs font-semibold ${licenseType===type?'bg-navy-900 text-white':'bg-white text-slate-600 ring-1 ring-slate-200'}`} onClick={()=>setLicenseType(type)}>{type}</button>)}</div>
     <p className="mt-2 text-[10px] text-slate-400">Na integração real, este valor virá do pacote de licença liberado pelo Solar ERP.</p>
    </div>
   </div>
  </div>

  {licenseType==='Integrador' && <div className="grid gap-4 md:grid-cols-3">
   {[
    ['On-grid','Dimensionamento fotovoltaico conectado à rede.','Pronto'],
    ['Híbrido','FV + armazenamento, cargas críticas e backup.','Pronto para validação'],
    ['Off-grid','Dimensionamento isolado completo.','Stand-by']
   ].map(([type,desc,status])=><button key={type} onClick={()=>{setProjectType(type);if(type!=='Off-grid')setDimensionType(type);if(type!=='Off-grid')setDimensionModal(true)}} className="surface-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between"><p className="font-semibold text-navy-900">{type}</p><StatusBadge tone={type==='Off-grid'?'yellow':'navy'}>{status}</StatusBadge></div>
    <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
   </button>)}
  </div>}

  <div className="grid gap-4 md:grid-cols-3">
   {['Em elaboração','Enviada','Negociação'].map(s=><div key={s} className="surface-card p-4"><p className="text-xs text-slate-500">{s}</p><p className="mt-1 text-xl font-bold text-navy-900">{rows.filter(i=>i.etapa===s).length}</p><p className="mt-1 text-xs text-slate-400">{money(rows.filter(i=>i.etapa===s).reduce((a,i)=>a+i.valor,0))}</p></div>)}
  </div>

  <div className="surface-card overflow-hidden">
   <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input pl-9" placeholder="Pesquisar cliente, proposta ou serviço..." value={q} onChange={e=>setQ(e.target.value)}/></div><p className="text-xs text-slate-400">{rows.length} proposta(s)</p></div>
   <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Código</th><th>Cliente</th><th>Modelo</th><th>Projeto</th><th>Objeto</th><th>Valor</th><th>Etapa</th><th>Ações</th></tr></thead>
   <tbody>{rows.map(i=><tr key={i.id}><td className="font-medium">{i.id}</td><td>{i.cliente}</td><td><StatusBadge tone={i.modelo==='Integrador'?'navy':'slate'}>{i.modelo}</StatusBadge></td><td>{i.tipoProjeto}</td><td>{i.objeto}</td><td>{money(i.valor)}</td><td><StatusBadge tone={tones[i.etapa]||'slate'}>{i.etapa}</StatusBadge></td><td><button className="text-xs font-semibold text-navy-800 hover:underline" onClick={()=>setView(i)}><Eye size={14} className="mr-1 inline"/>Visualizar</button></td></tr>)}</tbody></table></div>
  </div>

  {modal&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
   <form onSubmit={save} className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5"><Sun size={19}/></div><div><h3 className="text-lg font-semibold text-navy-900">{model.title}</h3><p className="text-xs text-slate-500">Modelo determinado pela licença da organização</p></div></div>
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tipo de empresa</p><p className="mt-1 font-semibold text-navy-900">{licenseType}</p><p className="mt-1 text-xs text-slate-500">Campo informativo. Não pode ser alterado na criação da proposta.</p></div>
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
     <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-navy-900">Formação de preço</p><p className="mt-1 text-xs leading-5 text-slate-500">O kit é informado como uma cotação fechada do distribuidor. Os demais campos representam custos adicionais do projeto/instalação.</p></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200">Demonstração</span></div>
     <div className="mt-4 grid gap-3 md:grid-cols-3">
      <label className="field"><span>Kit fechado do distribuidor</span><input type="number" min="0" step="0.01" className="input" value={priceForm.kit} onChange={e=>updatePrice('kit',e.target.value)}/></label><label className="field"><span>Instalação</span><input type="number" min="0" step="0.01" className="input" value={priceForm.instalacao} onChange={e=>updatePrice('instalacao',e.target.value)}/></label><label className="field"><span>Projeto elétrico</span><input type="number" min="0" step="0.01" className="input" value={priceForm.projetoEletrico} onChange={e=>updatePrice('projetoEletrico',e.target.value)}/></label><label className="field"><span>ART</span><input type="number" min="0" step="0.01" className="input" value={priceForm.art} onChange={e=>updatePrice('art',e.target.value)}/></label><label className="field"><span>Material adicional CC</span><input type="number" min="0" step="0.01" className="input" value={priceForm.materialCc} onChange={e=>updatePrice('materialCc',e.target.value)}/></label><label className="field"><span>Material adicional CA</span><input type="number" min="0" step="0.01" className="input" value={priceForm.materialCa} onChange={e=>updatePrice('materialCa',e.target.value)}/></label><label className="field"><span>Transformador</span><input type="number" min="0" step="0.01" className="input" value={priceForm.transformador} onChange={e=>updatePrice('transformador',e.target.value)}/></label><label className="field"><span>Frete / logística</span><input type="number" min="0" step="0.01" className="input" value={priceForm.frete} onChange={e=>updatePrice('frete',e.target.value)}/></label><label className="field"><span>Outros custos</span><input type="number" min="0" step="0.01" className="input" value={priceForm.outros} onChange={e=>updatePrice('outros',e.target.value)}/></label><label className="field"><span>Impostos adicionais</span><input type="number" min="0" step="0.01" className="input" value={priceForm.impostos} onChange={e=>updatePrice('impostos',e.target.value)}/></label><label className="field"><span>Comissão</span><input type="number" min="0" step="0.01" className="input" value={priceForm.comissao} onChange={e=>updatePrice('comissao',e.target.value)}/></label><label className="field"><span>Markup / margem (%)</span><input type="number" min="0" step="0.01" className="input" value={priceForm.margem} onChange={e=>updatePrice('margem',e.target.value)}/></label>
     </div>
     <div className="mt-4 grid gap-3 md:grid-cols-4">
      <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p className="text-xs text-slate-500">Custo direto</p><p className="mt-1 font-semibold text-navy-900">{money(priceResult.custoDireto)}</p></div>
      <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p className="text-xs text-slate-500">Base antes da margem</p><p className="mt-1 font-semibold text-navy-900">{money(priceResult.baseAntesMargem)}</p></div>
      <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p className="text-xs text-slate-500">Preço sugerido</p><p className="mt-1 font-semibold text-solar-green">{money(priceResult.precoVenda)}</p></div>
      <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p className="text-xs text-slate-500">Margem resultante</p><p className="mt-1 font-semibold text-navy-900">{(priceResult.margemLiquida*100).toFixed(1)}%</p></div>
     </div>
     <p className="mt-3 text-[11px] leading-5 text-slate-500">Regra provisória para validação: kit + custos adicionais + impostos + comissão formam a base; a margem configurada é aplicada como markup. O valor comercial da proposta continua editável até a regra ser validada com a planilha.</p>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <label className="field md:col-span-2"><span>Cliente</span><input name="cliente" className="input" required/></label>
     {licenseType==='Integrador' && <label className="field"><span>Tipo de projeto</span><select name="tipoProjeto" value={projectType} onChange={e=>setProjectType(e.target.value)} className="input"><option>On-grid</option><option>Híbrido</option><option>Off-grid</option></select></label>}
     {licenseType==='Serviços O&M' && <label className="field"><span>Modalidade</span><input className="input bg-slate-50" value="Operação e manutenção (O&M)" readOnly/></label>}
     <label className="field"><span>Valor total sugerido pela formação de preço</span><input name="valor" type="number" min="0" step="0.01" className="input bg-slate-50" value={priceResult.precoVenda.toFixed(2)} readOnly required/><small className="text-xs text-slate-500">Calculado automaticamente a partir do kit, custos adicionais, impostos, comissão e markup.</small></label>
     <label className="field md:col-span-2"><span>Objeto da proposta</span><input name="objeto" className="input" placeholder={projectType==='Híbrido'?'Ex.: Projeto FV híbrido com armazenamento e backup de cargas críticas':projectType==='Off-grid'?'Ex.: Estudo preliminar de sistema isolado fotovoltaico':'Ex.: Projeto, fornecimento e instalação de sistema fotovoltaico'} required/></label>
     <div className="md:col-span-2"><p className="text-xs font-semibold text-navy-900">Escopo sugerido</p><div className="mt-2 flex flex-wrap gap-2">{model.services.map(s=><span key={s} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{s}</span>)}</div></div>
     <label className="field"><span>Etapa</span><select name="etapa" className="input"><option>Em elaboração</option><option>Enviada</option><option>Negociação</option></select></label>
     <label className="field"><span>Validade</span><input name="validade" type="date" className="input" required/></label>
    </div>
    {projectType==='Off-grid' && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-amber-900"><AlertTriangle size={16}/> Off-grid em stand-by</p><p className="mt-1 text-xs leading-5 text-amber-800">O Kaelo registra o estudo preliminar, mas não apresenta dimensionamento automático definitivo nesta versão.</p></div>}
    <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn-primary">Criar proposta</button></div>
   </form>
  </div>}

  {view&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
   <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Gestão de Usinas · Proposta</p><h3 className="mt-1 text-2xl font-bold text-navy-900">{view.id}</h3><p className="mt-1 text-sm text-slate-500">{view.cliente}</p></div><button className="btn-secondary" onClick={()=>setView(null)}>Fechar</button></div></div>
   <div className="space-y-5 p-6"><div className="grid gap-4 md:grid-cols-5"><div><p className="text-xs text-slate-500">Modelo</p><p className="mt-1 font-semibold">{view.modelo}</p></div><div><p className="text-xs text-slate-500">Projeto</p><p className="mt-1 font-semibold">{view.tipoProjeto}</p></div><div><p className="text-xs text-slate-500">Valor</p><p className="mt-1 font-semibold">{money(view.valor)}</p></div><div><p className="text-xs text-slate-500">Etapa</p><p className="mt-1 font-semibold">{view.etapa}</p></div><div><p className="text-xs text-slate-500">Validade</p><p className="mt-1 font-semibold">{view.validade}</p></div></div>
    <div className="rounded-xl border border-slate-200 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Objeto</p><p className="mt-2 text-base text-navy-900">{view.objeto}</p></div>
    <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-semibold text-navy-900">{view.modelo==='Integrador'?'Escopo do integrador':'Escopo de Serviços O&M'}</p><div className="mt-3 flex flex-wrap gap-2">{modelInfo[view.modelo].services.map(s=><span key={s} className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200">{s}</span>)}</div></div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-900">Documento demonstrativo</p><p className="mt-1 text-sm leading-6 text-amber-800">Estrutura preparada para validação visual. O conteúdo comercial, condições, escopo detalhado e composição de preços serão refinados antes da integração com a licença e o banco de dados.</p></div>
    <button className="btn-primary" onClick={()=>window.print()}><Printer size={16}/> Imprimir / PDF</button>
   </div>
  </article></div>}

  {dimensionModal&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
   <article className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-solar-green">Pré-dimensionamento técnico</p><h3 className="text-xl font-bold text-navy-900">Dimensionamento de Energia Solar</h3><p className="text-xs text-slate-500">Premissas transparentes para validação antes da proposta definitiva.</p></div><button className="btn-secondary" onClick={()=>setDimensionModal(false)}>Fechar</button></div>
    <div className="p-5">
     <div className="flex flex-wrap gap-2">
      {['On-grid','Híbrido','Off-grid'].map(type=><button key={type} onClick={()=>setDimensionType(type)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${dimensionType===type?'bg-navy-900 text-white':'bg-slate-100 text-slate-600'}`}>{type}</button>)}
     </div>
     {dimensionType==='On-grid' && <div className="mt-5 space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
       {[
        ['consumoMensal','Consumo médio (kWh/mês)','number'],
        ['hsp','HSP média (h/dia)','number'],
        ['performanceRatio','Performance Ratio (%)','number'],
        ['potenciaModuloWp','Módulo (Wp)','number'],
       ].map(([name,label,type])=><label className="field" key={name}><span>{label}</span><input type={type} step="any" className="input" value={onGrid[name]} onChange={e=>updateOnGrid(name,e.target.value)}/></label>)}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Potência calculada</p><p className="mt-1 text-xl font-bold text-navy-900">{num(onGridResult.potenciaKwp)} kWp</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Módulos</p><p className="mt-1 text-xl font-bold text-navy-900">{onGridResult.quantidadeModulos}</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Potência instalada</p><p className="mt-1 text-xl font-bold text-navy-900">{num(onGridResult.potenciaRealKwp)} kWp</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Geração estimada</p><p className="mt-1 text-xl font-bold text-navy-900">{num(onGridResult.geracaoEstimada)} kWh/mês</p></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Premissa atual: <strong>Geração = kWp × HSP × PR × 30</strong>. O PR, HSP e módulo ficam editáveis. Isso permite confrontar o cálculo do Kaelo com a metodologia comercial atual antes de congelarmos a fórmula.</div>
     </div>}
     {dimensionType==='Híbrido' && <div className="mt-5 space-y-5">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><p className="text-sm font-semibold text-blue-900">Pré-dimensionamento híbrido</p><p className="mt-1 text-xs leading-5 text-blue-800">O Kaelo separa energia (kWh) de potência (kW/kVA), considera DoD, eficiência, degradação e margem. A validação final ainda depende do perfil horário, fabricante, compatibilidade e requisitos da distribuidora.</p></div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
         <p className="text-sm font-semibold text-navy-900">Perfil de cargas críticas</p>
         <p className="mt-1 text-xs leading-5 text-slate-500">Quando houver dados de cargas, o Kaelo pode calcular a energia do backup pela carga crítica, em vez de usar apenas potência × horas.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700"><input type="checkbox" checked={useLoads} onChange={e=>{setUseLoads(e.target.checked);if(e.target.checked&&!loads.length)setLoads([{name:'Carga crítica',powerKw:'',hoursPerDay:8,simultaneity:1,critical:true}])}}/> Usar perfil de cargas</label>
       </div>
       {useLoads && <div className="mt-4 space-y-3">
        {loads.map((load,index)=><div key={index} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] md:items-end">
         <label className="field"><span>Carga</span><input className="input" value={load.name} onChange={e=>updateLoad(index,'name',e.target.value)}/></label>
         <label className="field"><span>Potência (kW)</span><input type="number" step="any" className="input" value={load.powerKw} onChange={e=>updateLoad(index,'powerKw',e.target.value)}/></label>
         <label className="field"><span>Horas/dia</span><input type="number" step="any" className="input" value={load.hoursPerDay} onChange={e=>updateLoad(index,'hoursPerDay',e.target.value)}/></label>
         <label className="field"><span>Simultaneidade</span><input type="number" step="0.01" min="0" max="1" className="input" value={load.simultaneity} onChange={e=>updateLoad(index,'simultaneity',e.target.value)}/></label>
         <div className="flex items-center gap-2 pb-0.5"><label className="flex items-center gap-2 whitespace-nowrap text-xs"><input type="checkbox" checked={load.critical} onChange={e=>updateLoad(index,'critical',e.target.checked)}/> Crítica</label><button type="button" className="btn-secondary" onClick={()=>removeLoad(index)}>Remover</button></div>
        </div>)}
        <button type="button" className="btn-secondary" onClick={addLoad}>+ Adicionar carga</button>
        <div className="grid gap-3 md:grid-cols-3">
         <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Energia diária pelas cargas</p><p className="mt-1 font-bold text-navy-900">{num(loadResult.dailyEnergy)} kWh/dia</p></div>
         <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Energia crítica no backup</p><p className="mt-1 font-bold text-navy-900">{num(loadResult.criticalEnergy)} kWh</p></div>
         <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Potência crítica</p><p className="mt-1 font-bold text-navy-900">{num(loadResult.criticalPower)} kW</p></div>
        </div>
       </div>}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
       <label className="field"><span>Objetivo</span><select className="input" value={hybrid.objetivo} onChange={e=>updateHybrid('objetivo',e.target.value)}><option value="backup">Backup</option><option value="peak-shaving">Peak shaving</option><option value="autoconsumo">Autoconsumo</option></select></label>
       <label className="field"><span>Energia diária (kWh)</span><input type="number" step="any" className="input" value={hybrid.energiaDiaria} onChange={e=>updateHybrid('energiaDiaria',e.target.value)}/></label>
       <label className="field"><span>Carga crítica (kW)</span><input type="number" step="any" className="input" value={hybrid.potenciaCriticaKw} onChange={e=>updateHybrid('potenciaCriticaKw',e.target.value)}/></label>
       <label className="field"><span>Pico de carga (kVA)</span><input type="number" step="any" className="input" value={hybrid.potenciaPicoKva} onChange={e=>updateHybrid('potenciaPicoKva',e.target.value)}/></label>
       <label className="field"><span>Fator de potência</span><input type="number" min="0.1" max="1" step="0.01" className="input" value={hybrid.fatorPotencia} onChange={e=>updateHybrid('fatorPotencia',e.target.value)}/><small className="text-xs text-slate-500">Converte potência aparente (kVA) em potência ativa (kW).</small></label>
       <label className="field"><span>Duração do evento (h)</span><input type="number" step="any" className="input" value={hybrid.duracaoHoras} onChange={e=>updateHybrid('duracaoHoras',e.target.value)}/></label>
       <label className="field"><span>Autonomia (dias)</span><input type="number" step="any" className="input" value={hybrid.autonomiaDias} onChange={e=>updateHybrid('autonomiaDias',e.target.value)}/></label>
       <label className="field"><span>DoD (%)</span><input type="number" step="any" className="input" value={hybrid.dod} onChange={e=>updateHybrid('dod',e.target.value)}/></label>
       <label className="field"><span>Eficiência (%)</span><input type="number" step="any" className="input" value={hybrid.eficiencia} onChange={e=>updateHybrid('eficiencia',e.target.value)}/></label>
       <label className="field"><span>Reserva de degradação (%)</span><input type="number" step="any" className="input" value={hybrid.degradacao} onChange={e=>updateHybrid('degradacao',e.target.value)}/></label>
       <label className="field"><span>Margem de segurança (%)</span><input type="number" step="any" className="input" value={hybrid.margem} onChange={e=>updateHybrid('margem',e.target.value)}/></label>
       <label className="field"><span>Bateria nominal (kWh)</span><input type="number" step="any" className="input" value={hybrid.bateriaNominalKwh} onChange={e=>updateHybrid('bateriaNominalKwh',e.target.value)}/></label>
       <label className="field"><span>Potência por bateria (kW)</span><input type="number" step="any" className="input" value={hybrid.bateriaPotenciaKw} onChange={e=>updateHybrid('bateriaPotenciaKw',e.target.value)}/></label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Energia a cobrir</p><p className="mt-1 text-xl font-bold text-navy-900">{num(hybridResult.energiaNecessaria)} kWh</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Capacidade nominal</p><p className="mt-1 text-xl font-bold text-navy-900">{num(hybridResult.capacidadeNominal)} kWh</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Baterias</p><p className="mt-1 text-xl font-bold text-navy-900">{hybridResult.qtdBaterias} × {num(hybrid.bateriaNominalKwh)} kWh</p></div>
       <div className="surface-card p-4"><p className="text-xs text-slate-500">Potência de bateria</p><p className="mt-1 text-xl font-bold text-navy-900">{num(hybridResult.potenciaBateriaDisponivel)} kW</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
       <div className={`rounded-xl border p-4 ${hybridResult.bateriaAtendePotencia?'border-emerald-200 bg-emerald-50':'border-red-200 bg-red-50'}`}><p className="text-sm font-semibold">Potência das baterias</p><p className="mt-1 text-xs">Necessário: {num(hybridResult.potenciaBateriaNecessaria)} kW · Disponível: {num(hybridResult.potenciaBateriaDisponivel)} kW</p><p className="mt-2 text-xs font-semibold">{hybridResult.bateriaAtendePotencia?'Atende a premissa de potência.':'Não atende a premissa de potência; revisar banco/inversor.'}</p></div>
       <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-navy-900">Compatibilidade final</p><p className="mt-1 text-xs leading-5 text-slate-600">Antes de fechar a proposta, validar tensão, faixa de operação, corrente, potência de carga/descarga, BMS/comunicação, homologação/registro aplicável e compatibilidade entre inversor e bateria.</p></div>
      </div>
      <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">Base técnica do pré-cálculo: energia e potência são dimensionadas separadamente; a capacidade nominal é ajustada por DoD, eficiência, degradação e margem. Com o perfil de cargas ativo, a energia de backup passa a ser calculada pelas cargas críticas e suas horas de operação. A próxima evolução será importar curva de carga/geração de 24 h ou 8760 h para simulação energética.</div>
     </div>}
     {dimensionType==='Off-grid' && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="flex items-center gap-2 font-semibold text-amber-900"><AlertTriangle size={17}/> Off-grid em stand-by</p><p className="mt-2 text-sm leading-6 text-amber-800">Nesta versão o Kaelo não fecha o dimensionamento automático off-grid. A proposta poderá registrar consumo, cargas, autonomia desejada, localização e observações para estudo posterior.</p></div>}
    </div>
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4"><p className="text-xs text-slate-500">Resultado para validação técnica — não substitui projeto executivo, análise da distribuidora ou especificação do fabricante.</p><button className="btn-secondary" onClick={()=>window.print()}><Printer size={15}/> Imprimir</button></div>
   </article>
  </div>}
 </section>
}
