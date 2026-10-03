export default function ModulePage({ title, description, eyebrow = 'Módulo' }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">{eyebrow}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="page-title">{title}</h2>
            <p className="page-subtitle">{description}</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
          >
            Nova operação
          </button>
        </div>
      </div>

      <div className="surface-card flex min-h-64 items-center justify-center border-dashed">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-navy-800">
            <span className="text-lg font-bold">K</span>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-navy-900">Estrutura do módulo preparada</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Esta área já está integrada à navegação do Kaelo. A próxima etapa é conectar
            cadastro, filtros, permissões e dados reais do módulo.
          </p>
        </div>
      </div>
    </section>
  )
}
