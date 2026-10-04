import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ClipboardList, Clock3, Plus, Search, UserRound } from 'lucide-react'
import { StatusBadge } from '../../components/ui.jsx'

const initialOrders = [
  { id: 'OP-1001', cliente: 'Hope Soluções em Energia', servico: 'Instalação elétrica', data: '2026-10-04', responsavel: 'Ana Souza', status: 'Planejada', origem: 'Comercial' },
  { id: 'OP-1002', cliente: 'Mercado Bom Preço', servico: 'Manutenção elétrica', data: '2026-10-05', responsavel: 'Carlos Lima', status: 'Em execução', origem: 'Contrato' },
  { id: 'OP-1003', cliente: 'Clínica Vida Plena', servico: 'Vistoria técnica', data: '2026-10-06', responsavel: 'Pedro Alves', status: 'Pendente', origem: 'Solicitação' },
  { id: 'OP-1004', cliente: 'Indústria Vale Verde', servico: 'Relatório técnico', data: '2026-10-07', responsavel: 'Rafael Costa', status: 'Concluída', origem: 'Contrato' },
]

const statuses = ['Pendente', 'Planejada', 'Em execução', 'Concluída']

export default function OperacoesPage() {
  const [items, setItems] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return items.filter((item) => (
      [item.id, item.cliente, item.servico, item.responsavel, item.status].join(' ').toLowerCase().includes(term)
    ))
  }, [items, search])

  const summary = statuses.map((status) => ({ status, count: items.filter((item) => item.status === status).length }))

  function advance(id) {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item
      const index = statuses.indexOf(item.status)
      return index < statuses.length - 1 ? { ...item, status: statuses[index + 1] } : item
    }))
  }

  function addOperation(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const cliente = String(data.get('cliente') || '').trim()
    const servico = String(data.get('servico') || '').trim()
    if (!cliente || !servico) return
    setItems((current) => [...current, {
      id: 'OP-' + String(1005 + current.length),
      cliente,
      servico,
      data: data.get('data') || '2026-10-08',
      responsavel: data.get('responsavel') || 'A definir',
      status: 'Pendente',
      origem: data.get('origem') || 'Solicitação',
    }])
    setShowForm(false)
    event.currentTarget.reset()
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operação · Geral</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="page-title">Operações</h2>
            <p className="page-subtitle">Acompanhe serviços, tarefas e execuções do ERP sem misturar a operação específica de Gestão de Usinas.</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Nova operação</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map(({ status, count }) => (
          <div key={status} className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{status}</p>
            <p className="mt-2 text-2xl font-bold text-navy-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="surface-card flex items-center gap-3 p-4">
        <Search size={17} className="text-slate-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar operação, cliente, serviço ou responsável..." className="min-w-64 flex-1 border-0 bg-transparent text-sm outline-none" />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <ClipboardList size={18} className="text-navy-800" />
          <div>
            <h3 className="font-semibold text-navy-900">Fila operacional</h3>
            <p className="text-xs text-slate-500">Fluxo demo: Pendente → Planejada → Em execução → Concluída.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-3">Operação</th><th className="px-5 py-3">Cliente</th><th className="px-5 py-3">Serviço</th><th className="px-5 py-3">Data</th><th className="px-5 py-3">Responsável</th><th className="px-5 py-3">Origem</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-semibold text-navy-900">{item.id}</td>
                  <td className="px-5 py-3.5">{item.cliente}</td>
                  <td className="px-5 py-3.5">{item.servico}</td>
                  <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-slate-400" />{item.data}</span></td>
                  <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5"><UserRound size={14} className="text-slate-400" />{item.responsavel}</span></td>
                  <td className="px-5 py-3.5">{item.origem}</td>
                  <td className="px-5 py-3.5"><StatusBadge tone={item.status === 'Concluída' ? 'green' : item.status === 'Em execução' ? 'yellow' : item.status === 'Pendente' ? 'slate' : 'blue'}>{item.status}</StatusBadge></td>
                  <td className="px-5 py-3.5 text-right">{item.status !== 'Concluída' && <button type="button" className="btn-secondary whitespace-nowrap" onClick={() => advance(item.id)}><CheckCircle2 size={14} /> Avançar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={<Clock3 size={18} />} title="Agenda" text="As operações podem receber data e responsável antes da execução." />
        <InfoCard icon={<UserRound size={18} />} title="Responsabilidade" text="Cada execução fica associada a um responsável operacional." />
        <InfoCard icon={<CheckCircle2 size={18} />} title="Conclusão" text="A conclusão será a base para histórico, custos e relatórios." />
      </div>

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
        <form onSubmit={addOperation} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-navy-900">Nova operação</h3>
          <p className="mt-1 text-sm text-slate-500">Cadastro local para validação do fluxo operacional.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Cliente<input name="cliente" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Serviço<input name="servico" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Data<input name="data" type="date" defaultValue="2026-10-08" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Responsável<input name="responsavel" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Origem<select name="origem" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>Solicitação</option><option>Contrato</option><option>Comercial</option><option>Interna</option></select></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">Criar operação</button></div>
        </form>
      </div>}
    </section>
  )
}

function InfoCard({ icon, title, text }) {
  return <div className="surface-card p-5"><div className="flex items-center gap-2 text-navy-800">{icon}<h3 className="font-semibold">{title}</h3></div><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>
}
