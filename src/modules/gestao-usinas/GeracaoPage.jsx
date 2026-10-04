import { FileText, Plus, Printer, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const initial = [{
  id: 'CG-2026-08-SINTICOMP',
  cliente: 'Sinticomp',
  inversor: 'Fronius',
  modulos: 24,
  potenciaWp: 330,
  inversores: 1,
  potenciaKwp: 7.5,
  periodo: '2026-08',
  geracao: 764.80724,
  consumoRede: 349,
  energiaInjetada: 1190,
  tarifa: 1.18,
  iluminacaoImpostos: 51.56,
  valorConta: 110.53,
  valorFatura: 110.53,
  saldoAtual: 27544,
}]

function calc(r) {
  const expectativa = r.potenciaKwp * 5.2 * 0.81 * 30
  const saldoGeracao = r.energiaInjetada - (r.consumoRede - 50)
  const saldoConsumo = r.geracao - r.energiaInjetada
  const consumoTotal = r.consumoRede + saldoConsumo
  const aproveitamento = expectativa ? r.geracao / expectativa : 0
  const economia = r.geracao * r.tarifa
  const energiaConcessionaria = r.valorFatura ?? 110.53
  const custoConcessionaria = energiaConcessionaria - (r.iluminacaoImpostos || 0)
  const fatorCemig = consumoTotal ? r.consumoRede / consumoTotal : 0
  const fatorUsina = consumoTotal ? saldoConsumo / consumoTotal : 0
  const arvores = r.geracao / 333.33
  const agua = arvores * 1.32
  const co2 = arvores * 0.0983
  return { expectativa, saldoGeracao, saldoConsumo, consumoTotal, aproveitamento, economia, custoConcessionaria, fatorCemig, fatorUsina, arvores, agua, co2 }
}

export default function GeracaoPage() {
  const [rows, setRows] = useState(initial)
  const [selected, setSelected] = useState(initial[0])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({})

  const current = useMemo(() => calc(selected), [selected])

  const save = (e) => {
    e.preventDefault()
    const value = {
      id: `CG-${form.periodo}-${String(form.cliente).toUpperCase().replace(/\\s+/g, '-')}`,
      cliente: form.cliente,
      inversor: form.inversor,
      modulos: Number(form.modulos),
      potenciaWp: Number(form.potenciaWp),
      inversores: Number(form.inversores),
      potenciaKwp: Number(form.potenciaKwp),
      periodo: form.periodo,
      geracao: Number(form.geracao),
      consumoRede: Number(form.consumoRede),
      energiaInjetada: Number(form.energiaInjetada),
      tarifa: Number(form.tarifa),
      iluminacaoImpostos: Number(form.iluminacaoImpostos || 0),
      valorConta: Number(form.valorConta || 0),
      valorFatura: Number(form.valorConta || 0),
      saldoAtual: Number(form.saldoAtual || 0),
    }
    setRows(x => [value, ...x])
    setSelected(value)
    setModal(false)
  }

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Gestão de Usinas · Monitoramento</p>
        <h2 className="page-title">Consumo e Geração</h2>
        <p className="page-subtitle">Lançamento mensal e preparação do relatório que será enviado ao cliente.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => window.print()}><Printer size={16}/> Imprimir / PDF</button>
        <Link className="btn-secondary" to="/gestao-usinas/relatorio-consumo"><FileText size={16}/> Ver relatório</Link>
        <button className="btn-primary" onClick={() => { setForm({periodo:'2026-10', inversor:'Fronius', modulos:24, potenciaWp:330, inversores:1, potenciaKwp:7.5, tarifa:1.18}); setModal(true) }}><Plus size={16}/> Novo mês</button>
      </div>
    </header>

    <div className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 p-4"><h3 className="font-semibold text-navy-900">Histórico mensal</h3><p className="mt-1 text-sm text-slate-500">O Kaelo substitui a planilha por registros mensais vinculados à usina.</p></div>
      <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Cliente</th><th>Período</th><th>Geração</th><th>Consumo rede</th><th>Injetada</th><th>Aproveitamento</th><th></th></tr></thead><tbody>
        {rows.map(r => { const c=calc(r); return <tr key={r.id}><td className="font-medium">{r.cliente}</td><td>{r.periodo}</td><td>{r.geracao.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</td><td>{r.consumoRede.toLocaleString('pt-BR')} kWh</td><td>{r.energiaInjetada.toLocaleString('pt-BR')} kWh</td><td>{(c.aproveitamento*100).toFixed(0)}%</td><td><button className="btn-secondary" onClick={()=>setSelected(r)}>Abrir</button></td></tr> })}
      </tbody></table></div>
    </div>

    <div className="grid gap-4 md:grid-cols-4">
      {[
        ['Expectativa de geração', `${current.expectativa.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh`],
        ['Saldo de geração', `${current.saldoGeracao.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh`],
        ['Economia gerada', `R$ ${current.economia.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`],
        ['CO₂ não emitido', `${current.co2.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})} t`],
      ].map(([label,value])=><div className="surface-card p-4" key={label}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-navy-900">{value}</p></div>)}
    </div>

    <div className="surface-card p-5">
      <div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold text-navy-900">Dados calculados do período</h3><p className="mt-1 text-sm text-slate-500">Regras trazidas do modelo de Excel utilizado atualmente.</p></div><button className="btn-primary" onClick={()=>window.print()}><Save size={16}/> Gerar relatório do cliente</button></div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div><p className="text-xs text-slate-500">Consumo total da instalação</p><p className="font-semibold">{current.consumoTotal.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</p></div>
        <div><p className="text-xs text-slate-500">Consumo vindo da usina</p><p className="font-semibold">{(current.consumoUsina*100).toFixed(1)}%</p></div>
        <div><p className="text-xs text-slate-500">Consumo vindo da rede</p><p className="font-semibold">{(current.consumoCemig*100).toFixed(1)}%</p></div>
        <div><p className="text-xs text-slate-500">Árvores plantadas (equivalência)</p><p className="font-semibold">{current.arvores.toFixed(0)}</p></div>
        <div><p className="text-xs text-slate-500">Água não utilizada</p><p className="font-semibold">{current.agua.toFixed(2)} milhões de litros</p></div>
        <div><p className="text-xs text-slate-500">Valor pago da conta</p><p className="font-semibold">R$ {Number(selected.valorConta).toLocaleString('pt-BR',{minimumFractionDigits:2})}</p></div>
      </div>
    </div>

    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Dados demonstrativos. O modelo de cálculo foi mapeado do arquivo Excel atual; a persistência e a integração com faturas/monitoramento serão conectadas posteriormente.</div>

    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-navy-900">Lançamento mensal de consumo e geração</h3>
      <p className="mt-1 text-sm text-slate-500">Campos equivalentes ao preenchimento atual da planilha.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['cliente','Cliente','text',true],['periodo','Período','month',true],['inversor','Inversor/monitoramento','text',true],
          ['modulos','Quantidade de módulos','number',true],['potenciaWp','Potência do módulo (Wp)','number',true],['inversores','Quantidade de inversores','number',true],
          ['potenciaKwp','Usina projetada (kWp)','number',true],['geracao','Energia gerada (kWh)','number',true],['consumoRede','Energia consumida da rede (kWh)','number',true],
          ['energiaInjetada','Energia injetada (kWh)','number',true],['tarifa','Tarifa da fatura (R$/kWh)','number',true],['iluminacaoImpostos','Iluminação pública + impostos','number',false],
          ['valorConta','Valor pago da conta de luz','number',false],['saldoAtual','Saldo atual de geração','number',false],
        ].map(([name,label,type,required])=><label className="field" key={name}><span>{label}</span><input name={name} type={type} required={required} step={type==='number'?'0.01':undefined} className="input" defaultValue={form[name] ?? ''}/></label>)}
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn-primary">Salvar mês</button></div>
    </form></div>}
  </section>
}
