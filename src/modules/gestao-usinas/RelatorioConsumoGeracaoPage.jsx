import { ArrowLeft, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'

const data = {
  cliente: 'Sinticomp',
  periodo: 'agosto/26',
  modulos: 24,
  potenciaWp: 330,
  inversor: 'Fronius',
  expectativa: 947.7,
  geracao: 764.80724,
  consumoRede: 349,
  injetada: 1190,
  tarifa: 1.18,
  valorConta: 110.53,
  saldoGeracao: 891,
  economia: 902.47,
  consumoTotal: 1190,
  consumoUsina: 764.80724,
  consumoCemig: 349,
  aproveitamento: 81,
  arvores: 2,
  co2: 0.23,
  agua: 3.03,
}

export default function RelatorioConsumoGeracaoPage() {
  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between print:hidden">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Gestão de Usinas · Relatório</p><h2 className="page-title">Relatório de Consumo e Geração</h2><p className="page-subtitle">Modelo de saída baseado no relatório atualmente enviado ao cliente.</p></div>
      <div className="flex gap-2"><Link className="btn-secondary" to="/gestao-usinas/geracao"><ArrowLeft size={16}/> Voltar</Link><button className="btn-primary" onClick={()=>window.print()}><Printer size={16}/> Imprimir / PDF</button></div>
    </header>
    <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-card print:shadow-none">
      <div className="border-b-4 border-navy-900 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Relatório de Consumo e Geração — {data.periodo}</p>
        <h1 className="mt-2 text-3xl font-bold text-navy-900">{data.cliente}</h1>
        <p className="mt-2 text-sm text-slate-600">Usina {data.modulos} Módulos de {data.potenciaWp} Wp · {data.inversor}</p>
      </div>
      <div className="grid gap-4 p-8 md:grid-cols-3">
        {[
          ['Expectativa de geração', `${data.expectativa.toLocaleString('pt-BR',{minimumFractionDigits:2})} kWh/mês`],
          ['Geração realizada', `${data.geracao.toLocaleString('pt-BR',{minimumFractionDigits:2})} kWh`],
          ['Percentual de aproveitamento', `${data.aproveitamento}%`],
          ['Economia gerada', `R$ ${data.economia.toLocaleString('pt-BR',{minimumFractionDigits:2})}`],
          ['Saldo de geração do mês', `${data.saldoGeracao.toLocaleString('pt-BR',{minimumFractionDigits:2})} kWh`],
          ['Valor pago da conta', `R$ ${data.valorConta.toLocaleString('pt-BR',{minimumFractionDigits:2})}`],
        ].map(([label,value])=><div className="rounded-xl border border-slate-200 p-4" key={label}><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-navy-900">{value}</p></div>)}
      </div>
      <div className="grid gap-6 border-t border-slate-200 p-8 md:grid-cols-2">
        <div><h2 className="font-semibold text-navy-900">Dados Consumo</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span>Energia consumida vinda da usina solar</span><strong>{data.consumoUsina.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</strong></div><div className="flex justify-between"><span>Energia consumida vinda da rede</span><strong>{data.consumoCemig.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</strong></div><div className="flex justify-between border-t pt-3"><span>Consumo total da instalação</span><strong>{data.consumoTotal.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</strong></div></div></div>
        <div><h2 className="font-semibold text-navy-900">Dados Geração</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span>Geração total</span><strong>{data.geracao.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</strong></div><div className="flex justify-between"><span>Energia injetada</span><strong>{data.injetada.toLocaleString('pt-BR',{maximumFractionDigits:2})} kWh</strong></div><div className="flex justify-between"><span>Tarifa considerada</span><strong>R$ {data.tarifa.toLocaleString('pt-BR',{minimumFractionDigits:2})}/kWh</strong></div></div></div>
      </div>
      <div className="border-t border-slate-200 p-8"><h2 className="font-semibold text-navy-900">Equivalência Ambiental</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{[[data.arvores,'Árvores Plantadas'],[data.co2,'Toneladas de CO₂ Não Emitidos'],[data.agua,'Milhões de Litros de Água Não Utilizados']].map(([v,l])=><div className="rounded-xl bg-slate-50 p-4" key={l}><p className="text-2xl font-bold text-navy-900">{v}</p><p className="mt-1 text-sm text-slate-600">{l}</p></div>)}</div></div>
      <div className="border-t border-slate-200 p-8 text-xs leading-6 text-slate-500"><p>* Geração estimada em condições ideais.</p><p>** Exibe a origem da energia consumida na instalação.</p><p>*** Levados em conta dados virtuais de conversão (kWh gerados no mês atual → CO₂).</p></div>
    </article>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:hidden">Modelo demonstrativo. Os valores acima reproduzem o caso de referência do relatório de agosto/2026; a próxima etapa é vincular este layout aos lançamentos mensais reais.</div>
  </section>
}
