import { ArrowLeft, Printer } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const d = {
  cliente: 'Sinticomp', periodo: 'agosto/26', usina: '24 Módulos de 330 Wp', inversor: 'Fronius',
  expectativa: 947.70, geracao: 764.80724, rede: 349, injetada: 1190,
  saldoGeracao: 891.00, consumoTotal: -76.19, aproveitamento: 81,
  energiaConcessionaria: 58.97, economia: 902.47, saldoAtual: 2100,
  arvores: 2, co2: 0.23, agua: 3.03, fatorCemig: -458, fatorUsina: 558,
}

const fmt = (n, digits=2) => Number(n).toLocaleString('pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits})

function Bar({ value, label, max=1200, negative=false }) {
  const width = Math.min(Math.abs(value) / max * 100, 100)
  return <div className="flex h-52 items-end justify-center gap-8 border-b border-slate-300 px-6 pb-5 pt-4">
    <div className="flex h-full w-28 flex-col items-center justify-end gap-2">
      <strong className="text-sm text-navy-900">{fmt(value)}</strong>
      <div className="w-16 rounded-t bg-navy-800" style={{height:`${Math.max(width,8)}%`}} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  </div>
}

export default function RelatorioConsumoGeracaoPage() {
  const { state } = useLocation()
  const record = state?.record
  const report = record ? (() => {
    const expectativa = Number(record.potenciaKwp || 0) * 5.2 * 0.81 * 30
    const saldoGeracao = Number(record.energiaInjetada || 0) - (Number(record.consumoRede || 0) - 50)
    const saldoConsumo = Number(record.geracao || 0) - Number(record.energiaInjetada || 0)
    const consumoTotal = Number(record.consumoRede || 0) + saldoConsumo
    const aproveitamento = expectativa > 0 ? Number(record.geracao || 0) / expectativa * 100 : 0
    const economia = Number(record.geracao || 0) * Number(record.tarifa || 0)
    const energiaConcessionaria = Math.max(0, Number(record.valorFatura || 0) - Number(record.iluminacaoImpostos || 0))
    const fatorCemig = consumoTotal ? Number(record.consumoRede || 0) / consumoTotal * 100 : 0
    const fatorUsina = consumoTotal ? saldoConsumo / consumoTotal * 100 : 0
    const arvores = Number(record.geracao || 0) / 333.33
    const periodo = String(record.periodo || '').split('-')
    return {
      ...d,
      cliente: record.cliente,
      periodo: periodo.length === 2 ? `${periodo[1]}/${periodo[0].slice(2)}` : record.periodo,
      usina: `${record.modulos} Módulos de ${record.potenciaWp} Wp · ${record.potenciaKwp} kWp`,
      inversor: record.inversor,
      expectativa,
      geracao: Number(record.geracao || 0),
      rede: Number(record.consumoRede || 0),
      injetada: Number(record.energiaInjetada || 0),
      saldoGeracao,
      consumoTotal,
      aproveitamento,
      energiaConcessionaria,
      economia,
      saldoAtual: Number(record.saldoAtual || 0),
      arvores,
      co2: arvores * 0.0983,
      agua: arvores * 1.32,
      fatorCemig: fatorCemig.toFixed(0),
      fatorUsina: fatorUsina.toFixed(0),
    }
  })() : d
  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between print:hidden">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Gestão de Usinas · Relatório</p><h2 className="page-title">Relatório de Consumo e Geração</h2><p className="page-subtitle">Reprodução do modelo utilizado atualmente para apresentação ao cliente.</p></div>
      <div className="flex gap-2"><Link className="btn-secondary" to="/gestao-usinas/geracao"><ArrowLeft size={16}/> Voltar</Link><button className="btn-primary" onClick={()=>window.print()}><Printer size={16}/> Imprimir / PDF</button></div>
    </header>

    <article className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white p-8 shadow-card print:max-w-none print:rounded-none print:p-10 print:shadow-none">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900">Relatório de Consumo e Geração <span className="ml-2 font-normal">-</span> <span className="ml-2">{report.periodo}</span></h1>
        <div className="mt-2 grid max-w-xl grid-cols-[145px_1fr] gap-y-1 text-sm">
          <span>Cliente:</span><strong>{report.cliente}</strong>
          <span>Usina:</span><strong>{report.usina}</strong>
          <span></span><strong>{report.inversor}</strong>
          <span>*Expectativa de Geração:</span><strong>{fmt(report.expectativa)} KWh/Mês</strong>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-300 p-5"><h2 className="text-center text-lg font-bold text-slate-500">Dados Consumo</h2><div className="mt-2 grid grid-cols-2 gap-3"><Bar value={report.rede} label="Rede" max={400}/><Bar value={report.consumoTotal - report.rede} label="Usina Solar" max={600}/></div><div className="mt-3 grid grid-cols-2 text-center text-xs font-semibold"><span>Energia Consumida<br/>vinda da Usina Solar</span><span>Energia Consumida<br/>vinda da Rede</span></div></section>
        <section className="rounded-2xl border border-slate-300 p-5"><h2 className="text-center text-lg font-bold text-slate-500">Dados Geração</h2><div className="mt-2 grid grid-cols-2 gap-3"><Bar value={report.geracao} label="Geração Total" max={1400}/><Bar value={report.injetada} label="Energia Injetada" max={1400}/></div></section>
      </div>

      <div className="mt-1 grid md:grid-cols-2">
        <div className="bg-blue-100 p-2 text-center font-bold text-blue-900">Consumo Total da Instalação<br/>{fmt(report.consumoTotal)} KWh</div>
        <div className="bg-orange-100 p-2 text-center font-bold text-orange-900">Percentual de Aproveitamento<br/>{report.aproveitamento}%</div>
      </div>

      <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-300 p-5">
        <h2 className="text-center text-sm font-bold text-slate-500">**Fator de Consumo da Instalação</h2>
        <div className="mx-auto mt-4 flex h-48 w-48 items-center justify-center rounded-full" style={{background:`conic-gradient(#466fba 0 42%, #f07d2d 42% 100%)`}}>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-xs font-semibold">Consumo<br/>da instalação</div>
        </div>
        <div className="mt-4 flex justify-center gap-8 text-sm"><span>■ Consumo Cemig {report.fatorCemig}%</span><span>■ Consumo Usina {report.fatorUsina}%</span></div>
      </section>

      <div className="mt-5 grid gap-1 max-w-2xl bg-orange-100 p-2 font-bold text-red-600 md:grid-cols-2"><div>Saldo de Geração do Mês : <span>{fmt(report.saldoGeracao)} KWh</span></div><div>Energia Consumida da Concessionária <span>R$ {fmt(report.energiaConcessionaria)}</span></div></div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section><h2 className="bg-green-100 p-2 text-center font-bold text-green-900">***Equivalência Ambiental</h2><div className="mt-6 space-y-2 pl-8 text-sm font-semibold"><p className="text-green-600">{report.arvores} Árvores Plantadas</p><p className="text-slate-500">{fmt(report.co2)} Toneladas de CO2 Não Emitidos</p><p className="text-blue-800">{fmt(report.agua)} Milhões de Litros De Água Não Utilizados</p></div><div className="mx-auto mt-8 max-w-xs bg-orange-100 p-2 text-center font-bold text-orange-900">Economia Gerada<br/><span className="text-lg">R$ {fmt(report.economia)}</span></div></section>
        <section><h2 className="bg-blue-100 p-2 text-center font-bold text-blue-900">Saldo Atual De Geração</h2><Bar value={report.saldoAtual} label="" max={2100}/></section>
      </div>

      <div className="mt-7 text-sm italic text-slate-700"><p className="not-italic text-base font-medium">Observações :</p><p>*Geração estimada em condições ideais.</p><p>**Exibe a origem da energia consumida na instalação.</p><p>***Levados em conta dados virtuais de conversão (kWh gerados no mês atual → CO₂).</p></div>
    </article>

    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:hidden">Modelo demonstrativo baseado no PDF de agosto/2026 enviado pelo usuário. Os indicadores e textos são preservados para validação antes de transformar o relatório em saída definitiva do Kaelo.</div>
  </section>
}
