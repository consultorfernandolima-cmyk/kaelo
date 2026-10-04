import { useLocation, useMemo, useState } from 'react'
import { CheckCircle2, Eye, FileText, Plus, Search, Sun } from 'lucide-react'
import { StatusBadge } from '../../components/ui.jsx'

const initial = [
  { id: 'IMP-001', proposta: 'P-220', cliente: 'Clínica Vida Plena', usina: 'Carport 28 kWp', etapa: 'Projeto', responsavel: 'Eng. Marcos Silva', inicio: '2026-10-01', progresso: 25, atividades: ['Levantamento técnico', 'Validação do projeto elétrico', 'Definição dos equipamentos'] },
  { id: 'IMP-002', proposta: 'P-221', cliente: 'Escola Horizonte', usina: 'Cobertura 72 kWp', etapa: 'Instalação', responsavel: 'Equipe Solar Norte', inicio: '2026-09-20', progresso: 70, atividades: ['Estrutura instalada', 'Módulos em montagem', 'Instalação do inversor'] },
  { id: 'IMP-003', proposta: 'P-216', cliente: 'Indústria Vale Verde', usina: 'Solo 180 kWp', etapa: 'Comissionamento', responsavel: 'Eng. Rafael Costa', inicio: '2026-08-15', progresso: 92, atividades: ['Testes elétricos', 'Configuração do monitoramento', 'Documentação de entrega'] },
]

const stages = ['Projeto', 'Aprovação', 'Instalação', 'Comissionamento', 'Concluída']

export default function ImplantacoesPage() {
  const location = useLocation()
  const incomingContract = location.state?.contract
  const [items, setItems] = useState(() => incomingContract ? [{ id: 'IMP-NEW', proposta: incomingContract.proposta || 'A definir', cliente: incomingContract.cliente, usina: 'Usina a cadastrar', etapa: 'Projeto', responsavel: 'A definir', inicio: '', progresso: 10, atividades: ['Receber dados técnicos do contrato', 'Cadastrar usina', 'Planejar implantação'] }, ...initial] : initial)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [view, setView] = useState(null)

  const rows = useMemo(() => items.filter(item =>
    Object.values(item).some(value => String(value).toLowerCase().includes(q.toLowerCase()))
  ), [items, q])

  function advance(item) {
    const index = stages.indexOf(item.etapa)
    if (index < 0 || index === stages.length - 1) return
    const next = stages[index + 1]
    const progress = Math.min(100, [25, 45, 70, 92, 100][index + 1])
    setItems(current => current.map(row => row.id === item.id ? { ...row, etapa: next, progresso: progress } : row))
    setView(current => current && current.id === item.id ? { ...current, etapa: next, progresso: progress } : current)
  }

  function save(event) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const item = {
      id: 'IMP-' + String(items.length + 1).padStart(3, '0'),
      proposta: data.proposta,
      cliente: data.cliente,
      usina: data.usina,
      etapa: 'Projeto',
      responsavel: data.responsavel,
      inicio: data.inicio,
      progresso: 10,
      atividades: ['Receber documentação da proposta', 'Validar dados técnicos', 'Planejar implantação'],
    }
    setItems(current => [item, ...current])
    setModal(false)
    setView(item)
  }

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operações · Gestão de Usinas · Integrador</p>
        <h2 className="page-title">Implantações</h2>
        <p className="page-subtitle">Acompanhe o projeto, instalação, comissionamento e entrega das usinas vendidas pelo Integrador.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input pl-9" placeholder="Pesquisar implantação..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Nova implantação</button>
      </div>
    </header>

    <div className="grid gap-4 md:grid-cols-4">
      {[
        ['Em andamento', rows.filter(i => i.etapa !== 'Concluída').length],
        ['Em instalação', rows.filter(i => i.etapa === 'Instalação').length],
        ['Comissionamento', rows.filter(i => i.etapa === 'Comissionamento').length],
        ['Concluídas', rows.filter(i => i.etapa === 'Concluída').length],
      ].map(([label, value]) => <div key={label} className="surface-card p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-navy-900">{value}</p></div>)}
    </div>

    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Implantação</th><th>Proposta</th><th>Cliente</th><th>Usina</th><th>Etapa</th><th>Progresso</th><th>Ações</th></tr></thead>
      <tbody>{rows.map(item => <tr key={item.id}>
        <td className="font-medium">{item.id}</td><td>{item.proposta}</td><td>{item.cliente}</td><td>{item.usina}</td>
        <td><StatusBadge tone={item.etapa === 'Concluída' ? 'green' : item.etapa === 'Comissionamento' ? 'yellow' : 'navy'}>{item.etapa}</StatusBadge></td>
        <td className="min-w-[150px]"><div className="flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-navy-800" style={{ width: item.progresso + '%' }} /></div><span className="text-xs font-semibold text-slate-600">{item.progresso}%</span></div></td>
        <td><button className="text-xs font-semibold text-navy-800 hover:underline" onClick={() => setView(item)}><Eye size={14} className="mr-1 inline" />Acompanhar</button></td>
      </tr>)}</tbody></table></div>
    </div>

    <div className="surface-card p-5">
      <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-green/10 text-solar-green"><Sun size={19} /></div><div><p className="font-semibold text-navy-900">Regra do modelo Integrador</p><p className="mt-1 text-sm leading-6 text-slate-500">Este fluxo aparece para organizações licenciadas como <strong>Integrador</strong>. A proposta de energia solar origina a implantação, que depois alimenta o cadastro e o histórico da usina.</p></div></div>
    </div>

    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5"><FileText size={19} /></div><div><h3 className="text-lg font-semibold text-navy-900">Nova implantação</h3><p className="text-xs text-slate-500">Fluxo demonstrativo originado de uma proposta de Integrador.</p></div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="field"><span>Proposta</span><input name="proposta" className="input" placeholder="Ex.: P-220" required /></label>
        <label className="field"><span>Cliente</span><input name="cliente" className="input" required /></label>
        <label className="field md:col-span-2"><span>Usina / projeto</span><input name="usina" className="input" placeholder="Ex.: Carport 28 kWp" required /></label>
        <label className="field"><span>Responsável</span><input name="responsavel" className="input" required /></label>
        <label className="field"><span>Início previsto</span><input name="inicio" type="date" className="input" required /></label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn-primary">Criar implantação</button></div>
    </form></div>}

    {view && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><article className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
      <div className="border-b border-slate-200 p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wider text-solar-green">Kaelo ERP · Integrador</p><h3 className="mt-1 text-2xl font-bold text-navy-900">{view.id}</h3><p className="mt-1 text-sm text-slate-500">{view.cliente} · {view.usina}</p></div><button className="btn-secondary" onClick={() => setView(null)}>Fechar</button></div></div>
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-4"><div><p className="text-xs text-slate-500">Proposta</p><p className="mt-1 font-semibold">{view.proposta}</p></div><div><p className="text-xs text-slate-500">Etapa</p><p className="mt-1"><StatusBadge tone={view.etapa === 'Concluída' ? 'green' : 'navy'}>{view.etapa}</StatusBadge></p></div><div><p className="text-xs text-slate-500">Responsável</p><p className="mt-1 font-semibold">{view.responsavel}</p></div><div><p className="text-xs text-slate-500">Início</p><p className="mt-1 font-semibold">{view.inicio}</p></div></div>
        <div><div className="flex justify-between text-xs font-semibold text-slate-600"><span>Progresso da implantação</span><span>{view.progresso}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-navy-800" style={{ width: view.progresso + '%' }} /></div></div>
        <div><p className="text-sm font-semibold text-navy-900">Atividades da etapa</p><div className="mt-3 space-y-2">{view.atividades.map(activity => <div key={activity} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><CheckCircle2 size={16} className="text-solar-green" />{activity}</div>)}</div></div>
        <div className="flex justify-end"><button className="btn-primary" disabled={view.etapa === 'Concluída'} onClick={() => advance(view)}>{view.etapa === 'Concluída' ? 'Implantação concluída' : 'Avançar etapa'}</button></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Demonstração local. Na integração futura, a implantação será criada a partir da proposta aprovada e o cadastro da usina ficará vinculado ao projeto.</div>
      </div>
    </article></div>}
  </section>
}
