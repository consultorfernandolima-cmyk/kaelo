import {
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  PackageSearch,
  Users,
  WalletCards,
} from 'lucide-react'
import StatCard from '../../components/StatCard.jsx'
import { StatusBadge, formatCurrency, formatDate } from '../../components/ui.jsx'
import { atividadesRecentes, funil, kpis, proximasManutencoes } from '../../data/mock.js'

const statusTone = {
  Agendada: 'navy',
  Confirmada: 'green',
  Pendente: 'yellow',
}

const activityIcon = {
  Proposta: FileText,
  CRM: BriefcaseBusiness,
  Financeiro: WalletCards,
  Operação: ClipboardList,
}

export default function DashboardPage() {
  const totalFunil = funil.reduce((total, item) => total + item.valor, 0)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Visão geral</p>
          <h2 className="page-title">Bom dia. Aqui está sua operação.</h2>
          <p className="page-subtitle">Indicadores consolidados da organização e da empresa selecionada.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-solar-yellow/40" defaultValue="30">
            <option value="7">Últimos 7 dias</option>
            <option value="30">Este mês</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button type="button" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-800 hover:bg-slate-50">
            Exportar
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Parceiros" value={kpis.parceiros} hint="Clientes, fornecedores e demais papéis" icon={Users} accent="navy" />
        <StatCard label="Oportunidades" value={kpis.oportunidades} hint="Em andamento no CRM" icon={BriefcaseBusiness} accent="yellow" />
        <StatCard label="Propostas abertas" value={kpis.propostasAbertas} hint="Aguardando decisão ou revisão" icon={FileText} accent="green" />
        <StatCard label="Contratos ativos" value={kpis.contratosAtivos} hint="Vigentes na empresa" icon={CheckCircle2} accent="navy" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="surface-card overflow-hidden">
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-navy-900">Funil comercial</h3>
              <p className="mt-0.5 text-xs text-slate-500">Valor estimado por etapa</p>
            </div>
            <span className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-semibold text-navy-800">{formatCurrency(totalFunil)}</span>
          </div>
          <div className="space-y-4 p-5">
            {funil.map((item) => {
              const percent = Math.max(8, Math.round((item.valor / totalFunil) * 100))
              return (
                <div key={item.etapa}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-navy-900">{item.etapa}</span>
                    <span className="text-slate-500">{item.quantidade} oportunidades · {formatCurrency(item.valor)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-navy-800" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="surface-card">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-navy-900">Financeiro</h3>
            <p className="mt-0.5 text-xs text-slate-500">Visão operacional do período</p>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs text-slate-500">Contas a receber</p>
              <p className="mt-1 text-xl font-semibold text-navy-900">{formatCurrency(kpis.contasReceber)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Contas a pagar</p>
              <p className="mt-1 text-xl font-semibold text-navy-900">{formatCurrency(kpis.contasPagar)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              Os indicadores serão filtrados por empresa, período e permissões quando conectados ao banco real.
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-navy-900">Atividade recente</h3>
              <p className="mt-0.5 text-xs text-slate-500">Eventos operacionais da demonstração</p>
            </div>
            <button type="button" className="text-xs font-semibold text-navy-800 hover:underline">Ver tudo</button>
          </div>
          <div className="divide-y divide-slate-100">
            {atividadesRecentes.map((item) => {
              const Icon = activityIcon[item.tipo] ?? ArrowUpRight
              return (
                <div key={item.id} className="flex gap-3 px-5 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-800">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-navy-900">{item.descricao}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.tipo} · {item.quando}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-navy-900">Operação</h3>
              <p className="mt-0.5 text-xs text-slate-500">Itens que pedem acompanhamento</p>
            </div>
            <PackageSearch size={17} className="text-slate-400" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            <div className="p-5">
              <p className="text-xs text-slate-500">Ordens abertas</p>
              <p className="mt-2 text-2xl font-semibold text-navy-900">{kpis.ordensAbertas}</p>
              <p className="mt-1 text-xs text-slate-400">Em execução ou aguardando</p>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-500">Estoque crítico</p>
              <p className="mt-2 text-2xl font-semibold text-navy-900">{kpis.estoqueCritico}</p>
              <p className="mt-1 text-xs text-slate-400">Itens abaixo do mínimo</p>
            </div>
          </div>
        </article>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">Próximas atividades de operação</h3>
            <p className="mt-0.5 text-xs text-slate-500">Agenda demonstrativa — substituída por dados reais na integração</p>
          </div>
          <ClipboardList size={17} className="text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">OS</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Serviço</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Técnico</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proximasManutencoes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-medium text-navy-800">{item.id}</td>
                  <td className="px-5 py-3.5">{item.cliente}</td>
                  <td className="px-5 py-3.5 text-slate-600">{item.tipo}</td>
                  <td className="px-5 py-3.5">{formatDate(item.data)}</td>
                  <td className="px-5 py-3.5">{item.tecnico}</td>
                  <td className="px-5 py-3.5"><StatusBadge tone={statusTone[item.status] ?? 'slate'}>{item.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
