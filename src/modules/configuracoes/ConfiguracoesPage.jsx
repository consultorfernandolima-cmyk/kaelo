import { Link } from 'react-router-dom'
import { ArrowRight, KeyRound } from 'lucide-react'

export default function ConfiguracoesPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Configurações</p>
        <h2 className="page-title">Configurações do ambiente</h2>
        <p className="page-subtitle">Parâmetros administrativos, organização e controle de acesso do Kaelo.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/cadastros/acessos" className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800">
              <KeyRound size={19} />
            </div>
            <ArrowRight size={18} className="text-slate-400 transition group-hover:translate-x-0.5" />
          </div>
          <h3 className="mt-4 font-semibold text-navy-900">Configurações de Acesso</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Usuários, grupos de usuários e perfis de acesso com seus respectivos níveis de permissão.
          </p>
          <div className="mt-4 text-xs font-semibold text-navy-800">Abrir configurações de acesso</div>
        </Link>
      </div>
    </section>
  )
}
