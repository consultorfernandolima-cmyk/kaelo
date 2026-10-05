import { useLocation, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Banknote, Plus, Search, WalletCards } from 'lucide-react'
import { StatusBadge, formatCurrency, formatDate } from '../../components/ui.jsx'

const initialAccounts = [
  { id: 'CF-001', nome: 'Banco Principal', tipo: 'Banco', saldo: 184500, status: 'Ativa' },
  { id: 'CF-002', nome: 'Caixa Operacional', tipo: 'Caixa', saldo: 12400, status: 'Ativa' },
  { id: 'CF-003', nome: 'Banco Investimentos', tipo: 'Banco', saldo: 76500, status: 'Ativa' },
]

const initialReceivables = [
  { id: 'CR-1042', cliente: 'Clínica Vida Plena', descricao: 'Parcela implantação UFV', vencimento: '2026-10-10', valor: 49633.33, status: 'Aberto' },
  { id: 'CR-1048', cliente: 'Fazenda Santa Luz', descricao: 'Contrato O&M — outubro', vencimento: '2026-10-12', valor: 2000, status: 'Aberto' },
  { id: 'CR-1051', cliente: 'Mercado Bom Preço', descricao: 'Manutenção preventiva', vencimento: '2026-10-05', valor: 1500, status: 'Vencendo' },
]

const initialPayables = [
  { id: 'CP-2071', fornecedor: 'Distribuidor Solar', descricao: 'Kit UFV Clínica Vida Plena', vencimento: '2026-10-08', valor: 62500, status: 'Aberto' },
  { id: 'CP-2075', fornecedor: 'Serviços Elétricos Lima', descricao: 'Projeto elétrico e ART', vencimento: '2026-10-11', valor: 4200, status: 'Aberto' },
  { id: 'CP-2081', fornecedor: 'Transportadora Minas', descricao: 'Frete equipamentos', vencimento: '2026-10-06', valor: 1850, status: 'Vencendo' },
]

const tabs = [
  ['contas', 'Contas Financeiras'],
  ['receber', 'Contas a Receber'],
  ['pagar', 'Contas a Pagar'],
  ['fluxo', 'Fluxo de Caixa'],
]

function tone(status) {
  if (status === 'Ativa' || status === 'Recebido' || status === 'Pago') return 'green'
  if (status === 'Vencendo') return 'yellow'
  return 'slate'
}

export default function FinanceiroPage() {
  const location = useLocation()
  const incomingOperation = location.state?.operation
  const [tab, setTab] = useState('contas')
  const [search, setSearch] = useState('')
  const [accounts, setAccounts] = useState(initialAccounts)
  const [receivables, setReceivables] = useState(() => incomingOperation ? [{ id:'CR-OP-'+incomingOperation.id, cliente:incomingOperation.cliente, descricao:'Serviço '+incomingOperation.servico, vencimento:incomingOperation.data || '2026-10-08', valor:Number(incomingOperation.valorFaturavel || 0), status:'Aberto', origem:incomingOperation.id }, ...initialReceivables] : initialReceivables)
  const [payables, setPayables] = useState(initialPayables)
  const [showForm, setShowForm] = useState(false)

  const filteredReceivables = useMemo(
    () => receivables.filter((item) => (item.id + ' ' + item.cliente + ' ' + item.descricao).toLowerCase().includes(search.toLowerCase())),
    [receivables, search],
  )
  const filteredPayables = useMemo(
    () => payables.filter((item) => (item.id + ' ' + item.fornecedor + ' ' + item.descricao).toLowerCase().includes(search.toLowerCase())),
    [payables, search],
  )

  const totalAccounts = accounts.reduce((sum, item) => sum + item.saldo, 0)
  const totalReceivable = receivables.filter((item) => item.status !== 'Recebido').reduce((sum, item) => sum + item.valor, 0)
  const totalPayable = payables.filter((item) => item.status !== 'Pago').reduce((sum, item) => sum + item.valor, 0)
  const projectedBalance = totalAccounts + totalReceivable - totalPayable

  function addAccount(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nome = String(data.get('nome') || '').trim()
    if (!nome) return
    setAccounts((items) => [...items, {
      id: 'CF-' + String(items.length + 4).padStart(3, '0'),
      nome,
      tipo: data.get('tipo') || 'Banco',
      saldo: Number(data.get('saldo') || 0),
      status: 'Ativa',
    }])
    setShowForm(false)
    event.currentTarget.reset()
  }

  function markReceived(id) {
    setReceivables((items) => items.map((item) => item.id === id ? { ...item, status: 'Recebido' } : item))
  }

  function markPaid(id) {
    setPayables((items) => items.map((item) => item.id === id ? { ...item, status: 'Pago' } : item))
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Gestão · Financeiro</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="page-title">Financeiro</h2>
            <p className="page-subtitle">Contas financeiras, receber, pagar e visão inicial do fluxo de caixa.</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Nova conta</button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Saldo atual</p><p className="mt-2 text-2xl font-bold text-navy-900">{formatCurrency(totalAccounts)}</p></div>
        <div className="surface-card p-5"><p className="text-xs uppercase tracking-wide text-slate-500">A receber</p><p className="mt-2 text-2xl font-bold text-emerald-700">{formatCurrency(totalReceivable)}</p></div>
        <div className="surface-card p-5"><p className="text-xs uppercase tracking-wide text-slate-500">A pagar</p><p className="mt-2 text-2xl font-bold text-amber-700">{formatCurrency(totalPayable)}</p></div>
        <div className="surface-card p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Saldo projetado</p><p className="mt-2 text-2xl font-bold text-navy-900">{formatCurrency(projectedBalance)}</p></div>
      </div>

      <div className="surface-card p-2"><div className="flex flex-wrap gap-2">
        {tabs.map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={tab === value ? 'rounded-lg px-4 py-2 text-sm font-semibold bg-navy-900 text-white' : 'rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100'}>{label}</button>)}
      </div></div>

      {tab !== 'fluxo' && <div className="surface-card flex flex-wrap items-center gap-3 p-4"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar no financeiro..." className="min-w-64 flex-1 border-0 bg-transparent text-sm outline-none" /></div>}

      {tab === 'contas' && <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><WalletCards size={18} className="text-navy-800" /><div><h3 className="font-semibold text-navy-900">Contas / Caixas Financeiros</h3><p className="text-xs text-slate-500">Base para caixa, bancos, lançamentos e conciliação.</p></div></div>
        <table className="w-full text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Código</th><th className="px-5 py-3">Conta / Caixa Financeiro</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3">Saldo</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">
          {accounts.filter((item) => (item.id + ' ' + item.nome + ' ' + item.tipo).toLowerCase().includes(search.toLowerCase())).map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5 text-slate-500">{item.id}</td><td className="px-5 py-3.5 font-medium text-navy-900">{item.nome}</td><td className="px-5 py-3.5">{item.tipo}</td><td className="px-5 py-3.5 font-semibold">{formatCurrency(item.saldo)}</td><td className="px-5 py-3.5"><StatusBadge tone={tone(item.status)}>{item.status}</StatusBadge></td></tr>)}
        </tbody></table>
      </div>}

      {tab === 'receber' && <FinanceTable title="Contas a Receber" icon={<ArrowDownToLine size={18} />} rows={filteredReceivables} partyLabel="Cliente" partyKey="cliente" actionLabel="Receber" onAction={markReceived} />}
      {tab === 'pagar' && <FinanceTable title="Contas a Pagar" icon={<ArrowUpFromLine size={18} />} rows={filteredPayables} partyLabel="Fornecedor" partyKey="fornecedor" actionLabel="Pagar" onAction={markPaid} />}

      {tab === 'fluxo' && <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5"><div className="flex items-center gap-3"><Banknote size={18} className="text-navy-800" /><h3 className="font-semibold text-navy-900">Visão do fluxo</h3></div><div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Saldo inicial</span><strong>{formatCurrency(totalAccounts)}</strong></div>
          <div className="flex justify-between"><span className="text-slate-500">Entradas previstas</span><strong className="text-emerald-700">{formatCurrency(totalReceivable)}</strong></div>
          <div className="flex justify-between"><span className="text-slate-500">Saídas previstas</span><strong className="text-amber-700">-{formatCurrency(totalPayable)}</strong></div>
          <div className="border-t border-slate-100 pt-3 flex justify-between text-base"><span className="font-semibold text-navy-900">Saldo projetado</span><strong>{formatCurrency(projectedBalance)}</strong></div>
        </div></div>
        <div className="surface-card p-5"><h3 className="font-semibold text-navy-900">Próxima etapa</h3><p className="mt-2 text-sm leading-6 text-slate-500">Esta versão prepara o fluxo financeiro para receber lançamentos reais. A persistência, baixas, conciliação e regras de acesso serão conectadas ao Supabase após a validação da experiência.</p></div>
      </div>}

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
        <form onSubmit={addAccount} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-navy-900">Nova Conta / Caixa Financeiro</h3>
          <p className="mt-1 text-sm text-slate-500">Cadastro local para validação do fluxo.</p>
          <div className="mt-5 grid gap-4">
            <label className="text-sm font-medium text-slate-700">Nome<input name="nome" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Ex.: Banco Principal" /></label>
            <label className="text-sm font-medium text-slate-700">Tipo<select name="tipo" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>Banco</option><option>Caixa</option></select></label>
            <label className="text-sm font-medium text-slate-700">Saldo inicial<input name="saldo" type="number" step="0.01" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" defaultValue="0" /></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">Salvar conta</button></div>
        </form>
      </div>}
    </section>
  )
}

function FinanceTable({ title, icon, rows, partyLabel, partyKey, actionLabel, onAction }) {
  return <div className="surface-card overflow-hidden">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><span className="text-navy-800">{icon}</span><div><h3 className="font-semibold text-navy-900">{title}</h3><p className="text-xs text-slate-500">Lançamentos demonstrativos para validação do processo.</p></div></div>
    <table className="w-full text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Título</th><th className="px-5 py-3">{partyLabel}</th><th className="px-5 py-3">Descrição</th><th className="px-5 py-3">Vencimento</th><th className="px-5 py-3">Valor</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr></thead><tbody className="divide-y divide-slate-100">
      {rows.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5 font-medium text-navy-900">{item.id}</td><td className="px-5 py-3.5">{item[partyKey]}</td><td className="px-5 py-3.5">{item.descricao}</td><td className="px-5 py-3.5">{formatDate(item.vencimento)}</td><td className="px-5 py-3.5 font-semibold">{formatCurrency(item.valor)}</td><td className="px-5 py-3.5"><StatusBadge tone={tone(item.status)}>{item.status}</StatusBadge></td><td className="px-5 py-3.5 text-right">{item.status !== 'Recebido' && item.status !== 'Pago' && <button type="button" onClick={() => onAction(item.id)} className="btn-secondary text-xs">{actionLabel}</button>}</td></tr>)}
    </tbody></table>
  </div>
}
