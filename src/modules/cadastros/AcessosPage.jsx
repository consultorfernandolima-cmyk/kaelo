import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Check, Eye, KeyRound, Pencil, Plus, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react'

const modules = ['Cadastros', 'Comercial', 'CRM', 'Contratos', 'Financeiro', 'Estoque', 'Operações', 'Relatórios', 'Configurações']

const initialGroups = [
  { id: 1, name: 'Administrador', description: 'Acesso administrativo do ambiente.', users: 1, active: true },
  { id: 2, name: 'Vendas', description: 'Equipe responsável pelo processo comercial.', users: 0, active: true },
  { id: 3, name: 'Operações', description: 'Equipe responsável pela execução operacional.', users: 0, active: true },
  { id: 4, name: 'Financeiro', description: 'Equipe responsável pela rotina financeira.', users: 0, active: true },
]

const initialProfiles = [
  { id: 1, name: 'Administrador', description: 'Acesso total aos módulos contratados.', level: 'Total', permissions: Object.fromEntries(modules.map(m => [m, 'Total'])), active: true },
  { id: 2, name: 'Consulta', description: 'Visualização sem alteração.', level: 'Visualização', permissions: Object.fromEntries(modules.map(m => [m, 'Visualização'])), active: true },
]

const initialUsers = [
  { id: 1, name: 'Fernando Miranda de Lima', username: 'fernando.lima', email: 'consultorfernandolima@gmail.com', group: 'Administrador', profile: 'Administrador', access: 'Total', active: true },
]

const permissionOptions = ['Visualização', 'Alteração', 'Total']

function PermissionCell({ value }) {
  return value === 'Total'
    ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Check size={14} /> Total</span>
    : value === 'Alteração'
      ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><Pencil size={13} /> Alteração</span>
      : <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"><Eye size={13} /> Visualização</span>
}

export default function AcessosPage({ focusedTab = null }) {
  const [tab, setTab] = useState(focusedTab || 'usuarios')
  const [groups, setGroups] = useState(initialGroups)
  const [profiles, setProfiles] = useState(initialProfiles)
  const [users, setUsers] = useState(initialUsers)
  const [selectedProfile, setSelectedProfile] = useState(initialProfiles[0].id)
  const [modal, setModal] = useState(null)

  function save(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    if (modal === 'grupos') setGroups(x => [...x, { id: Date.now(), name: v.name, description: v.description, users: 0, active: true }])
    if (modal === 'perfis') {
      const level = v.level
      setProfiles(x => [...x, {
        id: Date.now(),
        name: v.name,
        description: v.description,
        level,
        permissions: Object.fromEntries(modules.map(m => [m, level])),
        active: true,
      }])
    }
    if (modal === 'usuarios') setUsers(x => [...x, { id: Date.now(), name: v.name, username: v.username, email: v.email, group: v.group, profile: v.profile, access: v.access, active: true }])
    setModal(null)
  }

  function toggleUser(id) {
    setUsers(items => items.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }

  const activeProfile = profiles.find(p => p.id === selectedProfile) || profiles[0]

  return <section className="space-y-5">
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Configurações</p>
        <h2 className="page-title">Configurações de Acesso</h2>
        <p className="page-subtitle">Usuários, grupos e perfis. O perfil define quais módulos o usuário pode acessar e se o acesso é de visualização, alteração ou total.</p>
      </div>
      <div className="flex flex-wrap gap-2"><Link to="/configuracoes" className="btn-secondary"><ArrowLeft size={16}/> Configurações</Link><button className="btn-primary" onClick={() => setModal(tab)}><Plus size={16}/> Novo {tab === 'usuarios' ? 'usuário' : tab === 'grupos' ? 'grupo' : 'perfil'}</button></div>
    </header>

    <div className="grid gap-3 md:grid-cols-3">
      {[
        ['usuarios', 'Usuários', users.length, UserRound],
        ['grupos', 'Grupos de usuários', groups.length, UsersRound],
        ['perfis', 'Perfis de acesso', profiles.length, ShieldCheck],
      ].map(([key, label, count, Icon]) => (
        <button key={key} onClick={() => setTab(key)} className={`surface-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${tab === key ? 'ring-2 ring-navy-800/10' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800"><Icon size={18}/></div>
            <span className="text-xl font-bold text-navy-900">{count}</span>
          </div>
          <div className="mt-3 text-sm font-semibold text-navy-900">{label}</div>
          <div className="mt-1 text-xs text-slate-500">{key === 'perfis' ? 'Módulos e níveis de permissão' : key === 'grupos' ? 'Organização dos usuários' : 'Identidade e vínculo de acesso'}</div>
        </button>
      ))}
    </div>

    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-3">
        {[['usuarios','Usuários',UserRound],['grupos','Grupos de usuários',UsersRound],['perfis','Perfis de acesso',ShieldCheck]].map(([key,label,Icon]) =>
          <button key={key} onClick={() => setTab(key)} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === key ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon size={15} className="mr-2 inline"/>{label}</button>
        )}
      </div>

      <div className="overflow-x-auto">
        {tab === 'usuarios' && <table className="data-table">
          <thead><tr><th>Nome</th><th>Usuário</th><th>E-mail</th><th>Grupo</th><th>Perfil</th><th>Nível de acesso</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{users.map(u => <tr key={u.id}>
            <td className="font-medium">{u.name}</td><td>{u.username}</td><td>{u.email}</td><td>{u.group}</td><td>{u.profile}</td><td>{u.access}</td>
            <td><span className="status-pill">{u.active ? 'Ativo' : 'Inativo'}</span></td>
            <td><button onClick={() => toggleUser(u.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title={u.active ? 'Desativar' : 'Ativar'}>{u.active ? <X size={15}/> : <Check size={15}/>}</button></td>
          </tr>)}</tbody>
        </table>}

        {tab === 'grupos' && <table className="data-table">
          <thead><tr><th>Grupo</th><th>Descrição</th><th>Usuários</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{groups.map(g => <tr key={g.id}>
            <td className="font-medium">{g.name}</td><td>{g.description}</td><td>{g.users}</td>
            <td><span className="status-pill">{g.active ? 'Ativo' : 'Inativo'}</span></td><td><span className="text-xs text-slate-400">Visual</span></td>
          </tr>)}</tbody>
        </table>}

        {tab === 'perfis' && <div className="space-y-5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-navy-900">Matriz de permissões</p>
              <p className="text-xs text-slate-500">Cada módulo recebe um nível de acesso dentro do perfil selecionado.</p>
            </div>
            <label className="field min-w-64"><span>Perfil</span><select value={selectedProfile} onChange={e => setSelectedProfile(Number(e.target.value))} className="input">{profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-navy-900">{activeProfile.name}</span>
              <span className="status-pill">{activeProfile.level}</span>
              <span className="text-xs text-slate-500">{activeProfile.description}</span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="data-table">
              <thead><tr><th>Módulo</th><th>Visualização</th><th>Alteração</th><th>Acesso total</th></tr></thead>
              <tbody>{modules.map(module => {
                const value = activeProfile.permissions[module]
                return <tr key={module}><td className="font-medium">{module}</td><td>{value === 'Visualização' ? <PermissionCell value={value}/> : <span className="text-slate-300">—</span>}</td><td>{value === 'Alteração' ? <PermissionCell value={value}/> : <span className="text-slate-300">—</span>}</td><td>{value === 'Total' ? <PermissionCell value={value}/> : <span className="text-slate-300">—</span>}</td></tr>
              })}</tbody>
            </table>
          </div>
        </div>}
      </div>
    </div>

    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-solar-green">Acessos</p><h3 className="text-lg font-semibold text-navy-900">Novo {modal === 'usuarios' ? 'usuário' : modal === 'grupos' ? 'grupo de usuários' : 'perfil de acesso'}</h3></div><KeyRound size={20} className="text-slate-400"/></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modal === 'usuarios' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field"><span>Usuário</span><input name="username" className="input" required /></label><label className="field"><span>E-mail</span><input name="email" type="email" className="input" required /></label><label className="field"><span>Grupo</span><select name="group" className="input">{groups.map(g=><option key={g.id}>{g.name}</option>)}</select></label><label className="field"><span>Perfil</span><select name="profile" className="input">{profiles.map(p=><option key={p.id}>{p.name}</option>)}</select></label><label className="field"><span>Nível de acesso</span><select name="access" className="input"><option>Visualização</option><option>Alteração</option><option>Total</option></select></label></>}
        {modal === 'grupos' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field md:col-span-2"><span>Descrição</span><textarea name="description" className="input min-h-24" /></label></>}
        {modal === 'perfis' && <><label className="field md:col-span-2"><span>Nome</span><input name="name" className="input" required /></label><label className="field md:col-span-2"><span>Descrição</span><textarea name="description" className="input min-h-20" /><p className="mt-1 text-xs text-slate-400">Nesta etapa, o nível escolhido será aplicado aos módulos. A edição módulo a módulo será refinada antes da integração com o banco.</p></label><label className="field"><span>Nível padrão</span><select name="level" className="input">{permissionOptions.map(option => <option key={option}>{option}</option>)}</select></label></>}
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancelar</button><button className="btn-primary">Salvar localmente</button></div>
    </form></div>}
  </section>
}
