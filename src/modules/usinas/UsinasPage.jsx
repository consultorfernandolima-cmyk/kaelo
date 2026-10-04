import { Eye, History, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { formatDate, StatusBadge } from '../../components/ui.jsx'
import { usinas } from '../../data/mock.js'

const historico = {
  'U-12': [
    { data: '2026-10-04', tipo: 'O&M', titulo: 'Limpeza de módulos', detalhe: 'OS-1042 · Atendimento programado', status: 'Agendada' },
    { data: '2026-09-04', tipo: 'O&M', titulo: 'Manutenção preventiva', detalhe: 'Inspeção de conexões e inversor', status: 'Concluído' },
  ],
  'U-45': [
    { data: '2026-10-06', tipo: 'O&M', titulo: 'Manutenção preventiva', detalhe: 'OS-1048 · Verificação de estrutura e inversor', status: 'Agendada' },
  ],
  'U-08': [
    { data: '2026-10-07', tipo: 'O&M', titulo: 'Limpeza de módulos', detalhe: 'OS-1051 · Atendimento confirmado', status: 'Confirmada' },
  ],
  'U-28': [
    { data: '2026-10-09', tipo: 'O&M', titulo: 'Inspeção elétrica', detalhe: 'OS-1055 · Inspeção preventiva do sistema', status: 'Pendente' },
  ],
  'U-180': [
    { data: '2026-09-18', tipo: 'O&M', titulo: 'Monitoramento', detalhe: 'Análise de desempenho operacional', status: 'Concluído' },
  ],
}

export default function UsinasPage() {
  const [q, setQ] = useState('')
  const [view, setView] = useState(null)

  const rows = useMemo(() => usinas.filter(u =>
    Object.values(u).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
  ), [q])

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operações · Gestão de Usinas</p>
          <h2 className="page-title">Usinas</h2>
          <p className="page-subtitle">Parque instalado, situação operacional e histórico dos atendimentos.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input pl-9" placeholder="Pesquisar usina ou cliente..." value={q} onChange={e => setQ(e.target.value)} /></div>
          <Link to="/usinas/cadastro" className="btn-primary"><Plus size={16} /> Cadastrar usina</Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-4"><p className="text-xs text-slate-500">Usinas cadastradas</p><p className="mt-1 text-xl font-bold text-navy-900">{usinas.length}</p></div>
        <div className="surface-card p-4"><p className="text-xs text-slate-500">Operando</p><p className="mt-1 text-xl font-bold text-navy-900">{usinas.filter(u => u.status === 'Operando').length}</p></div>
        <div className="surface-card p-4"><p className="text-xs text-slate-500">Potência instalada</p><p className="mt-1 text-xl font-bold text-navy-900">{usinas.reduce((s, u) => s + Number(u.potenciaKwp), 0).toLocaleString('pt-BR')} kWp</p></div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Código</th><th>Usina</th><th>Cliente</th><th>Potência</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>{rows.map(u => <tr key={u.id}><td className="font-medium">{u.id}</td><td>{u.nome}</td><td>{u.cliente}</td><td>{u.potenciaKwp} kWp</td><td><StatusBadge tone={u.status === 'Operando' ? 'green' : 'yellow'}>{u.status}</StatusBadge></td><td><button className="text-xs font-semibold text-navy-800 hover:underline" onClick={() => setView(u)}><Eye size={14} className="mr-1 inline" />Ver histórico</button></td></tr>)}</tbody></table></div>
      </div>

      {view && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Gestão de Usinas</p><h3 className="mt-1 text-2xl font-bold text-navy-900">{view.nome}</h3><p className="mt-1 text-sm text-slate-500">{view.id} · {view.cliente} · {view.potenciaKwp} kWp</p></div><button className="btn-secondary" onClick={() => setView(null)}>Fechar</button></div></div>
        <div className="p-6">
          <div className="mb-5 grid gap-4 md:grid-cols-3"><div><p className="text-xs text-slate-500">Status</p><p className="mt-1"><StatusBadge tone={view.status === 'Operando' ? 'green' : 'yellow'}>{view.status}</StatusBadge></p></div><div><p className="text-xs text-slate-500">Potência</p><p className="mt-1 font-semibold">{view.potenciaKwp} kWp</p></div><div><p className="text-xs text-slate-500">Registros</p><p className="mt-1 font-semibold">{(historico[view.id] || []).length}</p></div></div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3"><History size={17} /><h4 className="font-semibold text-navy-900">Histórico operacional</h4></div>
          <div className="mt-3 space-y-3">{(historico[view.id] || []).map((h, idx) => <div key={idx} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-navy-900">{h.titulo}</p><p className="mt-1 text-xs text-slate-500">{h.tipo} · {h.detalhe}</p></div><div className="flex items-center gap-3"><span className="text-xs text-slate-500">{formatDate(h.data)}</span><StatusBadge tone={h.status === 'Concluído' ? 'green' : h.status === 'Pendente' ? 'yellow' : 'navy'}>{h.status}</StatusBadge></div></div></div>)}</div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">O histórico demonstrativo será alimentado automaticamente pelos atendimentos e relatórios técnicos quando o fluxo estiver conectado ao banco.</div>
        </div>
      </article></div>}
    </section>
  )
}
