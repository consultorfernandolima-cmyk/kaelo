import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CalendarDays, KeyRound, UserRound, UsersRound } from 'lucide-react'

export default function EmpresaPage() {
  const cards = [
    { to: '/configuracoes/acessos', icon: UserRound, title: 'Usuários', text: 'Cadastro de acesso, identificação, contato, vínculo funcional e status.' },
    { to: '/configuracoes/acessos', icon: UsersRound, title: 'Perfil e Grupo de Usuários', text: 'Defina grupo, perfil, módulos liberados, permissões e escopo por empresa.' },
  ]
  return <section className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Administração</p><h2 className="page-title">Empresa</h2><p className="page-subtitle">Identidade da organização, pessoas que acessam o Kaelo e informações da licença.</p></header>
    <div className="grid gap-4 md:grid-cols-2">{cards.map(({to,icon:Icon,title,text})=><Link key={title} to={to} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800"><Icon size={19}/></div><ArrowRight size={18} className="text-slate-400 group-hover:translate-x-0.5"/></div><h3 className="mt-4 font-semibold text-navy-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></Link>)}</div>
    <div className="grid gap-4 md:grid-cols-3">
      <Info icon={<BadgeCheck size={18}/>} title="Organização" value="Minha organização" />
      <Info icon={<CalendarDays size={18}/>} title="Licença" value="Validada automaticamente" />
      <Info icon={<KeyRound size={18}/>} title="Versão" value="Kaelo 0.1 · ambiente demo" />
    </div>
    <div className="surface-card p-5"><h3 className="font-semibold text-navy-900">Regra de acesso</h3><p className="mt-2 text-sm leading-6 text-slate-500">Usuário, grupo e perfil não substituem a licença. O acesso efetivo será resultado da licença contratada, módulo liberado, empresa autorizada e permissão do usuário.</p></div>
  </section>
}
function Info({icon,title,value}){return <div className="surface-card p-5"><div className="flex items-center gap-2 text-navy-800">{icon}<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p></div><p className="mt-3 font-semibold text-navy-900">{value}</p></div>}
