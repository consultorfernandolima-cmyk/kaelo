import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Package, UsersRound, ShieldCheck, UserRound, Layers3, KeyRound } from 'lucide-react'

const cards = [
  { title: 'Parceiros', description: 'Clientes, fornecedores e demais relações comerciais.', path: '/clientes', icon: Building2, status: 'Em validação' },
  { title: 'Produtos e serviços', description: 'Itens comercializados, serviços e classificação de produtos.', path: '/cadastros/produtos', icon: Package, status: 'Próxima etapa' },
  { title: 'Grupos e famílias', description: 'Estrutura de classificação que organizará produtos e serviços.', path: '/cadastros/grupos-familias', icon: Layers3, status: 'Próxima etapa' },
  { title: 'Acessos', description: 'Usuários, grupos e perfis com módulos e níveis de permissão.', path: '/cadastros/acessos', icon: KeyRound, status: 'Em validação' },
  { title: 'Usuários', description: 'Usuários do ambiente e seus vínculos de acesso.', path: '/cadastros/usuarios', icon: UserRound, status: 'Planejado' },
  { title: 'Grupos de usuários', description: 'Agrupamento operacional: Administrador, Vendas, Operações, Financeiro etc.', path: '/cadastros/grupos-usuarios', icon: UsersRound, status: 'Planejado' },
  { title: 'Perfis de acesso', description: 'Módulos e níveis de permissão: visualização, alteração ou acesso total.', path: '/cadastros/perfis', icon: ShieldCheck, status: 'Planejado' },
]

export default function CadastrosPage() {
  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Cadastros</p>
        <h2 className="page-title">Cadastros base</h2>
        <p className="page-subtitle">A estrutura que alimentará os módulos comerciais, operacionais, financeiros e de estoque.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, description, path, icon: Icon, status }) => (
          <Link key={path} to={path} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800"><Icon size={19} /></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{status}</span>
            </div>
            <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-navy-800">Abrir cadastro <ArrowRight size={14} /></div>
          </Link>
        ))}
      </div>
    </section>
  )
}
