import { useMemo, useState } from 'react'
import { BatteryCharging, Save, SunMedium } from 'lucide-react'

export default function ConfigUfvPage({ mode='ongrid' }) {
  const hybrid = mode === 'hibrido'
  const [values,setValues]=useState(hybrid
    ? {demanda:10,autonomia:4,dod:90,eficiencia:90,potencia:5}
    : {perdas:19,eficiencia:81,hsp:5.2,fatorSeguranca:1})
  const result=useMemo(()=>{
    if(!hybrid) return {fator:Number(values.eficiencia||0)/100, hsp:Number(values.hsp||0), perdas:Number(values.perdas||0)}
    const energia=Number(values.demanda||0)*Number(values.autonomia||0)
    const util=Number(values.dod||0)/100
    const eff=Number(values.eficiencia||0)/100
    const capacidade=util&&eff?energia/(util*eff):0
    return {energia,capacidade,potencia:Number(values.potencia||0)}
  },[values,hybrid])
  const set=(key,value)=>setValues(v=>({...v,[key]:value}))
  return <section className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Configurações · Gestão UFV</p><h2 className="page-title">{hybrid?'Parâmetros UFV Híbrido':'Parâmetros UFV On-grid'}</h2><p className="page-subtitle">{hybrid?'Dimensionamento preliminar de armazenamento, autonomia e potência.':'Parâmetros preliminares de perdas, eficiência e recurso solar.'}</p></header>
    <div className="surface-card p-5">
      <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800">{hybrid?<BatteryCharging size={19}/>:<SunMedium size={19}/>}</div><div><h3 className="font-semibold text-navy-900">Parâmetros do cenário</h3><p className="text-sm text-slate-500">Valores locais para validação do fluxo. A integração com banco e catálogo de equipamentos será posterior.</p></div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
      {hybrid ? <>
        <Field label="Demanda a cobrir (kW)" value={values.demanda} onChange={v=>set('demanda',v)}/>
        <Field label="Autonomia desejada (h)" value={values.autonomia} onChange={v=>set('autonomia',v)}/>
        <Field label="DoD (%)" value={values.dod} onChange={v=>set('dod',v)}/>
        <Field label="Eficiência global (%)" value={values.eficiencia} onChange={v=>set('eficiencia',v)}/>
        <Field label="Potência nominal de referência (kW)" value={values.potencia} onChange={v=>set('potencia',v)}/>
      </> : <>
        <Field label="Perdas estimadas (%)" value={values.perdas} onChange={v=>set('perdas',v)}/>
        <Field label="Eficiência global (%)" value={values.eficiencia} onChange={v=>set('eficiencia',v)}/>
        <Field label="HSP de referência (kWh/m².dia)" value={values.hsp} onChange={v=>set('hsp',v)}/>
        <Field label="Fator de segurança" value={values.fatorSeguranca} onChange={v=>set('fatorSeguranca',v)}/>
      </>}
      </div>
      <button className="btn-primary mt-5" type="button" onClick={()=>window.alert('Parâmetros salvos no modo demonstração.')}><Save size={16}/> Salvar parâmetros</button>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {hybrid ? <><Metric label="Energia a cobrir" value={(result.energia||0).toLocaleString('pt-BR',{maximumFractionDigits:2})+' kWh'}/><Metric label="Capacidade estimada" value={(result.capacidade||0).toLocaleString('pt-BR',{maximumFractionDigits:2})+' kWh'}/><Metric label="Potência de referência" value={result.potencia+' kW'}/></> : <><Metric label="Eficiência configurada" value={values.eficiencia+'%'}/><Metric label="Perdas configuradas" value={values.perdas+'%'}/><Metric label="HSP" value={values.hsp+' kWh/m².dia'}/></>}
    </div>
    <div className="surface-card p-5 text-sm leading-6 text-slate-500">{hybrid?'Dimensionamento preliminar: energia requerida = demanda × autonomia; capacidade de bateria considera DoD e eficiência. A seleção final depende do perfil de carga, objetivo do sistema, tecnologia, limites do fabricante e validação do equipamento.':'Os parâmetros servem como configuração inicial. O HSP deverá ser obtido por localidade e fonte definida, como CRESESB SunData, e as perdas/eficiência devem ser validadas conforme projeto e equipamentos.'}</div>
  </section>
}
function Field({label,value,onChange}){return <label className="field"><span>{label}</span><input className="input" type="number" step="0.01" value={value} onChange={e=>onChange(e.target.value)}/></label>}
function Metric({label,value}){return <div className="surface-card p-5"><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-navy-900">{value}</p></div>}
