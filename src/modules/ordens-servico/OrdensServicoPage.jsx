import { useMemo, useState } from 'react'
import { ClipboardCheck, Eye, FileText, Plus, Printer, Search, Wrench } from 'lucide-react'
import { formatDate, StatusBadge } from '../../components/ui.jsx'

const initial = [
  { id: 'OS-1042', cliente: 'Fazenda Santa Luz', usina: 'Usina SL-12 kWp', modelo: 'Serviços O&M', tipo: 'Limpeza de módulos', data: '2026-10-04', tecnico: 'Ana Souza', status: 'Agendada', observacoes: 'Limpeza técnica dos módulos e inspeção visual.' },
  { id: 'OS-1048', cliente: 'Mercado Bom Preço', usina: 'Cobertura 45 kWp', modelo: 'Serviços O&M', tipo: 'Manutenção preventiva', data: '2026-10-06', tecnico: 'Carlos Lima', status: 'Agendada', observacoes: 'Verificar conexões, estrutura e inversor.' },
  { id: 'OS-1051', cliente: 'Residencial Aurora', usina: 'Telhado 8,2 kWp', modelo: 'Serviços O&M', tipo: 'Limpeza de módulos', data: '2026-10-07', tecnico: 'Pedro Alves', status: 'Confirmada', observacoes: 'Executar limpeza e registrar evidências fotográficas.' },
  { id: 'OS-1055', cliente: 'Clínica Vida Plena', usina: 'Carport 28 kWp', modelo: 'Serviços O&M', tipo: 'Inspeção elétrica', data: '2026-10-09', tecnico: 'Ana Souza', status: 'Pendente', observacoes: 'Inspeção preventiva do sistema.' },
]

const statusTone = { Agendada: 'navy', Confirmada: 'green', 'Em execução': 'yellow', Concluída: 'green', Pendente: 'yellow' }
const nextStatus = { Pendente: 'Confirmada', Agendada: 'Confirmada', Confirmada: 'Em execução', 'Em execução': 'Concluída' }

export default function OrdensServicoPage() {
  const [items, setItems] = useState(initial)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [view, setView] = useState(null)
  const [report, setReport] = useState(null)
  const [reports, setReports] = useState({})
  const [evidence, setEvidence] = useState({})
  const [checklist, setChecklist] = useState({})

  const rows = useMemo(() => items.filter(i => Object.values(i).some(v => String(v).toLowerCase().includes(q.toLowerCase()))), [items, q])

  function save(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const item = { id: `OS-${1056 + items.length - initial.length}`, ...v, data: v.data }
    setItems(x => [item, ...x])
    setModal(false)
    setView(item)
  }

  function createReport(item) {
    const generated = {
      os: item.id,
      cliente: item.cliente,
      usina: item.usina,
      tecnico: item.tecnico,
      data: item.data,
      servico: item.tipo,
      status: 'Concluído',
      condicao: 'Sistema inspecionado e atendimento executado conforme escopo da OS.',
      atividades: item.tipo === 'Limpeza de módulos'
        ? 'Limpeza técnica dos módulos, inspeção visual e registro das condições encontradas.'
        : item.tipo === 'Manutenção preventiva'
          ? 'Verificação de conexões, estrutura, inversor e pontos de atenção preventiva.'
          : 'Execução do atendimento previsto na ordem de serviço e verificação operacional.',
      observacoes: item.observacoes || 'Sem observações adicionais.',
      recomendacoes: 'Manter o plano de manutenção e registrar o próximo atendimento no histórico da usina.',
      evidencias: evidence[item.id] || 0,
      checklist: checklist[item.id] || {},
    }
    setReports(x => ({ ...x, [item.id]: generated }))
    setReport(generated)
    setView(null)
  }

  function advance(item) {
    const status = nextStatus[item.status]
    if (!status) return
    setItems(x => x.map(i => i.id === item.id ? { ...i, status } : i))
    setView({ ...item, status })
  }

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operações · Gestão de Usinas</p>
        <h2 className="page-title">Ordens de Serviço</h2>
        <p className="page-subtitle">Fluxo demonstrativo de manutenção: programação, execução e encerramento do atendimento.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input pl-9" placeholder="Pesquisar OS, cliente, usina ou técnico..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Nova OS</button>
      </div>
    </header>

    <div className="grid gap-4 md:grid-cols-4">
      {['Pendente', 'Agendada', 'Em execução', 'Concluída'].map(status => <div key={status} className="surface-card p-4"><p className="text-xs text-slate-500">{status}</p><p className="mt-1 text-xl font-bold text-navy-900">{items.filter(i => i.status === status).length}</p><p className="mt-1 text-xs text-slate-400">ordens</p></div>)}
    </div>

    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>OS</th><th>Cliente</th><th>Usina</th><th>Modelo</th><th>Serviço</th><th>Data</th><th>Técnico</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>{rows.map(i => <tr key={i.id}><td className="font-medium">{i.id}</td><td>{i.cliente}</td><td>{i.usina}</td><td><StatusBadge tone="slate">{i.modelo}</StatusBadge></td><td>{i.tipo}</td><td>{formatDate(i.data)}</td><td>{i.tecnico}</td><td><StatusBadge tone={statusTone[i.status] || 'slate'}>{i.status}</StatusBadge></td><td className="whitespace-nowrap"><button className="mr-3 text-xs font-semibold text-navy-800 hover:underline" onClick={() => setView(i)}><Eye size={14} className="mr-1 inline" />Ver</button>{nextStatus[i.status] && <button className="text-xs font-semibold text-solar-green hover:underline" onClick={() => advance(i)}><ClipboardCheck size={14} className="mr-1 inline" />Avançar</button>}</td></tr>)}</tbody></table></div>
    </div>

    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5"><Wrench size={19} /></div><div><h3 className="text-lg font-semibold text-navy-900">Nova Ordem de Serviço</h3><p className="text-xs text-slate-500">Serviços O&M · Gestão de Usinas</p></div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="field md:col-span-2"><span>Cliente</span><input name="cliente" className="input" required /></label>
        <label className="field"><span>Usina</span><input name="usina" className="input" placeholder="Ex.: Usina SL-12 kWp" required /></label>
        <label className="field"><span>Tipo de serviço</span><select name="tipo" className="input"><option>Manutenção preventiva</option><option>Manutenção corretiva</option><option>Limpeza de módulos</option><option>Inspeção elétrica</option><option>Monitoramento</option></select></label>
        <label className="field"><span>Data de execução</span><input name="data" type="date" className="input" required /></label>
        <label className="field"><span>Técnico responsável</span><input name="tecnico" className="input" required /></label>
        <label className="field md:col-span-2"><span>Observações</span><textarea name="observacoes" className="input min-h-24" placeholder="Escopo, cuidados, evidências e informações para a equipe." /></label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn-primary">Criar OS</button></div>
    </form></div>}

    {view && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
      <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Gestão de Usinas · Ordem de Serviço</p><h3 className="mt-1 text-2xl font-bold text-navy-900">{view.id}</h3><p className="mt-1 text-sm text-slate-500">{view.cliente} · {view.usina}</p></div><button className="btn-secondary" onClick={() => setView(null)}>Fechar</button></div></div>
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-4"><div><p className="text-xs text-slate-500">Modelo</p><p className="mt-1 font-semibold">{view.modelo}</p></div><div><p className="text-xs text-slate-500">Serviço</p><p className="mt-1 font-semibold">{view.tipo}</p></div><div><p className="text-xs text-slate-500">Data</p><p className="mt-1 font-semibold">{formatDate(view.data)}</p></div><div><p className="text-xs text-slate-500">Status</p><p className="mt-1"><StatusBadge tone={statusTone[view.status] || 'slate'}>{view.status}</StatusBadge></p></div></div>
        <div className="rounded-xl border border-slate-200 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Técnico responsável</p><p className="mt-2 text-base text-navy-900">{view.tecnico}</p><p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Observações</p><p className="mt-2 text-sm leading-6 text-slate-600">{view.observacoes || 'Sem observações registradas.'}</p></div>
        <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-semibold text-navy-900">Evidências do atendimento</p><p className="mt-2 text-sm text-slate-600">Quantidade de registros fotográficos associados à OS.</p><input type="number" min="0" className="input mt-3 max-w-xs" value={evidence[view.id] || 0} onChange={e => setEvidence(x => ({ ...x, [view.id]: Number(e.target.value || 0) }))} /> </div>
        <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-semibold text-navy-900">Checklist técnico</p><div className="mt-3 grid gap-2 md:grid-cols-2">{(view.tipo === 'Limpeza de módulos' ? ['Condição dos módulos','Sujidade excessiva','Vidro danificado','Estrutura em condição adequada','Limpeza concluída','Registro fotográfico'] : ['Módulos','Estruturas','Cabos','Conectores','Inversores','Proteções','Quadros','Alarmes']).map(label => <label key={label} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><input type="checkbox" checked={Boolean(checklist[view.id]?.[label])} onChange={e => setChecklist(x => ({...x,[view.id]:{...(x[view.id] || {}),[label]:e.target.checked}}))} />{label}</label>)}</div></div>
        <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-semibold text-navy-900">Próximo passo operacional</p><p className="mt-2 text-sm leading-6 text-slate-600">{nextStatus[view.status] ? `Avançar para “${nextStatus[view.status]}” e, após a conclusão, gerar o relatório do atendimento.` : 'Atendimento concluído. Próxima etapa: relatório técnico e histórico da usina.'}</p></div>
        <div className="flex flex-wrap gap-2"><button className="btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir OS / PDF</button>{nextStatus[view.status] && <button className="btn-secondary" onClick={() => advance(view)}>Avançar status</button>}{view.status === 'Concluída' && <button className="btn-secondary" onClick={() => createReport(view)}><FileText size={16} /> Gerar relatório técnico</button>}{reports[view.id] && <button className="btn-secondary" onClick={() => { setReport(reports[view.id]); setView(null) }}><FileText size={16} /> Ver relatório</button>}</div>
      </div>
    </article></div>}

    {report && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
      <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Gestão de Usinas · Relatório Técnico</p><h3 className="mt-1 text-2xl font-bold text-navy-900">Relatório de Atendimento</h3><p className="mt-1 text-sm text-slate-500">{report.os} · {report.cliente} · {report.usina}</p></div><button className="btn-secondary" onClick={() => setReport(null)}>Fechar</button></div></div>
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-4"><div><p className="text-xs text-slate-500">OS</p><p className="mt-1 font-semibold">{report.os}</p></div><div><p className="text-xs text-slate-500">Data</p><p className="mt-1 font-semibold">{formatDate(report.data)}</p></div><div><p className="text-xs text-slate-500">Técnico</p><p className="mt-1 font-semibold">{report.tecnico}</p></div><div><p className="text-xs text-slate-500">Status</p><p className="mt-1"><StatusBadge tone="green">{report.status}</StatusBadge></p></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Serviço executado</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.servico}</p><p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Atividades realizadas</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.atividades}</p></div>
          <div className="rounded-xl border border-slate-200 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Condição do sistema</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.condicao}</p><p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Recomendações</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.recomendacoes}</p></div>
        </div>
        <div className="rounded-xl bg-slate-50 p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Observações</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.observacoes}</p><p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Checklist e evidências</p><p className="mt-2 text-sm text-slate-600">{Object.values(report.checklist || {}).filter(Boolean).length} itens marcados · {report.evidencias || 0} evidências fotográficas</p></div>
        <div className="flex gap-2"><button className="btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir relatório / PDF</button><button className="btn-secondary" onClick={() => setReport(null)}>Fechar</button></div>
      </div>
    </article></div>}
  </section>
}
