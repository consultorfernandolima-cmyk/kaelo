import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Layers3, FolderTree } from 'lucide-react'

const initialGroups = [
  { id: 1, name: 'Manutenção', description: 'Manutenção preventiva, corretiva e diagnóstico.', families: 2, active: true },
  { id: 2, name: 'Limpeza', description: 'Limpeza técnica de módulos e estruturas.', families: 1, active: true },
  { id: 3, name: 'Monitoramento', description: 'Geração, desempenho e relatórios operacionais.', families: 1, active: true },
  { id: 4, name: 'Materiais elétricos', description: 'Materiais e componentes para instalações.', families: 2, active: true },
  { id: 5, name: 'Equipamentos', description: 'Equipamentos e componentes da usina.', families: 1, active: true },
]
const initialFamilies = [
  { id: 1, group: 'Manutenção', name: 'Preventiva', description: 'Inspeções e manutenção preventiva.', active: true },
  { id: 2, group: 'Manutenção', name: 'Corretiva', description: 'Diagnóstico e manutenção corretiva.', active: true },
  { id: 3, group: 'Limpeza', name: 'Módulos', description: 'Limpeza dos módulos fotovoltaicos.', active: true },
  { id: 4, group: 'Monitoramento', name: 'Desempenho', description: 'Monitoramento e relatórios de desempenho.', active: true },
  { id: 5, group: 'Materiais elétricos', name: 'Cabos e condutores', description: 'Cabos, fios e condutores.', active: true },
  { id: 6, group: 'Materiais elétricos', name: 'Proteção elétrica', description: 'Disjuntores, DPS e proteção.', active: true },
  { id: 7, group: 'Equipamentos', name: 'Equipamentos solares', description: 'Equipamentos relacionados à geração solar.', active: true },
]

export default function GruposFamiliasPage() {
  const [tab, setTab] = useState('grupos')
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState(initialGroups)
  const [families, setFamilies] = useState(initialFamilies)
  const [modal, setModal] = useState(null)

  const rows = useMemo(() => {
    const source = tab === 'grupos' ? groups : families
    const q = query.toLowerCase().trim()
    return source.filter((item) => Object.values(item).some((v) => String(v).toLowerCase().includes(q)))
  }, [tab, groups, families, query])

  function save(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const values = Object.fromEntries(data.entries())
    if (tab === 'grupos') setGroups((items) => [...items, { id: Date.now(), name: values.name, description: values.description, families: 0, active: true }])
    else setFamilies((items) => [...items, { id: Date.now(), group: values.group, name: values.name, description: values.description, active: true }])
    setModal(null)
  }

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Cadastros</p><h2 className="page-title">Grupos e famílias</h2><p className="page-subtitle">Classificação básica para organizar produtos e serviços.</p></div>
      <div className="flex flex-wrap gap-2"><Link to="/cadastros/produtos" className="btn-secondary"><ArrowLeft size={16}/> Produtos e serviços</Link><button onClick={() => setModal(tab)} className="btn-primary"><Plus size={16}/> Novo {tab === 'grupos' ? 'grupo' : 'família'}</button></div>
    </header>
    <div className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button onClick={() => setTab('grupos')} className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'grupos' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}><Layers3 size={15} className="mr-2 inline"/>Grupos</button>
          <button onClick={() => setTab('familias')} className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'familias' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}><FolderTree size={15} className="mr-2 inline"/>Famílias</button>
        </div>
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input pl-9" placeholder="Pesquisar..." value={query} onChange={(e) => setQuery(e.target.value)}/></div>
      </div>
      <div className="overflow-x-auto"><table className="data-table"><thead><tr>{tab === 'grupos' ? <><th>Grupo</th><th>Descrição</th><th>Famílias</th><th>Status</th></> : <><th>Família</th><th>Grupo</th><th>Descrição</th><th>Status</th></>}</tr></thead>
      <tbody>{rows.map((item) => <tr key={item.id}>{tab === 'grupos' ? <><td className="font-medium">{item.name}</td><td>{item.description}</td><td>{item.families}</td></> : <><td className="font-medium">{item.name}</td><td>{item.group}</td><td>{item.description}</td></>}<td><span className="status-pill">{item.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}</tbody></table></div>
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-navy-900">Novo {modal === 'grupos' ? 'grupo' : 'família'}</h3>
      <div className="mt-5 space-y-4">{modal === 'familias' && <label className="field"><span>Grupo</span><select name="group" className="input" required>{groups.map(g => <option key={g.id}>{g.name}</option>)}</select></label>}<label className="field"><span>Nome</span><input name="name" className="input" required /></label><label className="field"><span>Descrição</span><textarea name="description" className="input min-h-24" /></label></div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancelar</button><button className="btn-primary">Salvar localmente</button></div>
    </form></div>}
  </section>
}
