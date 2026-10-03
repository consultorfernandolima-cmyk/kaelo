import { useState } from 'react'
import { ShieldCheck, UsersRound, UserRound, Plus } from 'lucide-react'

const modules = ['Cadastros', 'Comercial', 'CRM', 'Contratos', 'Financeiro', 'Estoque', 'Operações', 'Relatórios', 'Configurações']
const initialGroups = [
  { id: 1, name: 'Administrador', description: 'Acesso administrativo do ambiente.', users: 1, active: true },
  { id: 2, name: 'Vendas', description: 'Equipe responsável pelo processo comercial.', users: 0, active: true },
  { id: 3, name: 'Operações', description: 'Equipe responsável pela execução operacional.', users: 0, active: true },
  { id: 4, name: 'Financeiro', description: 'Equipe responsável pela rotina financeira.', users: 0, active: true },
]
const initialProfiles = [
  { id: 1, name: 'Administrador', description: 'Acesso total aos módulos contratados.', level: 'Total', modules: modules.length, active: true },
  { id: 2, name: 'Consulta', description: 'Visualização sem alteração.', level: 'Visualização', modules: modules.length, active: true },
]
const initialUsers = [
  { id: 1, name: 'Fernando Miranda de Lima', username: 'fernando.lima', email: 'consultorfernandolima@gmail.com', group: 'Administrador', profile: 'Administrador', access: 'Total', active: true },
]

export default function AcessosPage() {
  const [tab, setTab] = useState('usuarios')
  const [groups, setGroups] = useState(initialGroups)
  const [profiles, setProfiles] = useState(initialProfiles)
  const [users, setUsers] = useState(initialUsers)
  const [modal, setModal] = useState(null)

  function save(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    if (modal === 'grupos') setGroups(x => [...x, { id: Date.now(), name: v.name, description: v.description, users: 0, active: true }])
    if (modal === 'perfis') setProfiles(x => [...x, { id: Date.now(), name: v.name, description: v.description, level: v.level, modules: v.modules === 'all' ? modules.length : Number(v.modules), active: true }])
    if (modal === 'usuarios') setUsers(x => [...x, { id: Date.now(), name: v.name, username: v.username, email: v.email, group: v.group, profile: v.profile, access: v.access, active: true }])
    setModal(null)
  }

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Cadastros</p><h2 className="page-title">Acessos</h2><p className="page-subtitle">Estrutura inicial de grupos, perfis e usuários. Nesta etapa, o acesso é somente visual/local.</p></div>
      <button className="btn-primary" onClick={() => setModal(tab)}><Plus size={16}/> Novo {tab === 'usuarios' ? 'usuário' : tab === 'grupos' ? 'grupo' : 'perfil'}</button>
    </header>
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-3">
        {[['usuarios','Usuários',UserRound],['grupos','Grupos de usuários',UsersRound],['perfis','Perfis de acesso',ShieldCheck]].map(([key,label,Icon]) =>
          <button key={key} onClick={() => setTab(key)} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === key ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon size={15} className="mr-2 inline"/>{label}</button>
        )}
      </div>
      <div className="overflow-x-auto">
        {tab === 'usuarios' && <table className="data-table"><thead><tr><th>Usuário</th><th>E-mail</th><th>Grupo</th><th>Perfil</th><th>Acesso</th><th>Status</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><div className="font-medium">{u.name}</div><div className="text-xs text-slate-400">{u.username}</div></td><td>{u.email}</td><td>{u.group}</td><td>{u.profile}</td><td>{u.access}</td><td><span className="status-pill">{u.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}</tbody></table>}
        {tab === 'grupos' && <table className="data-table"><thead><tr><th>Grupo</th><th>Descrição</th><th>Usuários</th><th>Status</th></tr></thead><tbody>{groups.map(g=><tr key={g.id}><td className="font-medium">{g.name}</td><td>{g.description}</td><td>{g.users}</td><td><span className="status-pill">{g.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}</tbody></table>}
        {tab === 'perfis' && <table className="data-table"><thead><tr><th>Perfil</th><th>Descrição</th><th>Nível</th><th>Módulos</th><th>Status</th></tr></thead><tbody>{profiles.map(p=><tr key={p.id}><td className="font-medium">{p.name}</td><td>{p.description}</td><td>{p.level}</td><td>{p.modules}</td><td><span className="status-pill">{p.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}</tbody></table>}
      </div>
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-navy-900">Novo {modal === 'usuarios' ? 'usuário' : modal === 'grupos' ? 'grupo de usuários' : 'perfil de acesso'}</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modal === 'usuarios' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field"><span>Usuário</span><input name="username" className="input" required /></label><label className="field"><span>E-mail</span><input name="email" type="email" className="input" required /></label><label className="field"><span>Grupo</span><select name="group" className="input">{groups.map(g=><option>{g.name}</option>)}</select></label><label className="field"><span>Perfil</span><select name="profile" className="input">{profiles.map(p=><option>{p.name}</option>)}</select></label><label className="field"><span>Nível de acesso</span><select name="access" className="input"><option>Visualização</option><option>Alteração</option><option>Total</option></select></label></>}
        {modal === 'grupos' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field md:col-span-2"><span>Descrição</span><textarea name="description" className="input min-h-24" /></label></>}
        {modal === 'perfis' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field md:col-span-2"><span>Descrição</span><textarea name="description" className="input min-h-20" /></label><label className="field"><span>Nível padrão</span><select name="level" className="input"><option>Visualização</option><option>Alteração</option><option>Total</option></select></label><label className="field"><span>Módulos</span><select name="modules" className="input"><option value="all">Todos</option><option value="1">Selecionados (1+)</option></select></label></>}
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancelar</button><button className="btn-primary">Salvar localmente</button></div>
    </form></div>}
  </section>
}
