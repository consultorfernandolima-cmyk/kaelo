import { useLocation, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, ClipboardList, Package, Plus, Search, Warehouse } from 'lucide-react'
import { StatusBadge, formatCurrency, ContextBack } from '../../components/ui.jsx'

const initialProducts = [
  { id: 'PR-001', codigo: 'CAB-6MM', nome: 'Cabo solar 6mm', unidade: 'm', saldo: 1250, minimo: 500, custo: 4.85, local: 'Almoxarifado' },
  { id: 'PR-002', codigo: 'DISJ-40A', nome: 'Disjuntor bipolar 40A', unidade: 'un', saldo: 42, minimo: 20, custo: 68.9, local: 'Almoxarifado' },
  { id: 'PR-003', codigo: 'CON-MC4', nome: 'Conector MC4', unidade: 'par', saldo: 86, minimo: 40, custo: 12.5, local: 'Almoxarifado' },
  { id: 'PR-004', codigo: 'LIM-KIT', nome: 'Kit de limpeza de módulos', unidade: 'un', saldo: 8, minimo: 10, custo: 185, local: 'Veículo O&M' },
]

const initialMovements = [
  { id: 'MOV-1042', tipo: 'Saída', produto: 'Cabo solar 6mm', quantidade: 120, data: '2026-10-04', origem: 'OS-1042', destino: 'Fazenda Santa Luz' },
  { id: 'MOV-1041', tipo: 'Entrada', produto: 'Disjuntor bipolar 40A', quantidade: 20, data: '2026-10-03', origem: 'Compra', destino: 'Almoxarifado' },
  { id: 'MOV-1038', tipo: 'Saída', produto: 'Kit de limpeza de módulos', quantidade: 1, data: '2026-10-02', origem: 'OS-1038', destino: 'Fazenda Santa Luz' },
]

const locations = ['Almoxarifado', 'Veículo O&M']

export default function EstoquePage() {
  const location = useLocation()
  const incomingOperation = location.state?.operation
  const [tab, setTab] = useState('saldo')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [movements, setMovements] = useState(initialMovements)
  const [showForm, setShowForm] = useState(false)
  const [showMovement, setShowMovement] = useState(Boolean(incomingOperation))

  const filteredProducts = useMemo(
    () => products.filter((item) => (item.codigo + ' ' + item.nome + ' ' + item.local).toLowerCase().includes(search.toLowerCase())),
    [products, search],
  )
  const filteredMovements = useMemo(
    () => movements.filter((item) => (item.id + ' ' + item.produto + ' ' + item.origem + ' ' + item.destino).toLowerCase().includes(search.toLowerCase())),
    [movements, search],
  )

  const totalItems = products.reduce((sum, item) => sum + item.saldo, 0)
  const lowStock = products.filter((item) => item.saldo < item.minimo).length
  const inventoryValue = products.reduce((sum, item) => sum + item.saldo * item.custo, 0)

  function addMovement(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const produto = String(data.get('produto') || '')
    const tipo = data.get('tipo') || 'Entrada'
    const quantidade = Number(data.get('quantidade') || 0)
    if (!produto || quantidade <= 0) return
    const product = products.find((item) => item.id === produto)
    if (!product) return
    if (tipo === 'Saída' && quantidade > product.saldo) return
    setProducts((items) => items.map((item) => item.id === produto
      ? { ...item, saldo: item.saldo + (tipo === 'Entrada' ? quantidade : -quantidade) }
      : item))
    setMovements((items) => [{
      id: 'MOV-' + String(1043 + items.length),
      tipo,
      produto: product.nome,
      quantidade,
      data: data.get('data') || '2026-10-08',
      origem: data.get('origem') || (tipo === 'Entrada' ? 'Compra' : 'Operação'),
      destino: data.get('destino') || product.local,
    }, ...items])
    setShowMovement(false)
    event.currentTarget.reset()
  }

  function addProduct(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nome = String(data.get('nome') || '').trim()
    if (!nome) return
    setProducts((items) => [...items, {
      id: 'PR-' + String(items.length + 5).padStart(3, '0'),
      codigo: String(data.get('codigo') || '').trim(),
      nome,
      unidade: data.get('unidade') || 'un',
      saldo: Number(data.get('saldo') || 0),
      minimo: Number(data.get('minimo') || 0),
      custo: Number(data.get('custo') || 0),
      local: data.get('local') || locations[0],
    }])
    setShowForm(false)
    event.currentTarget.reset()
  }

  return (
    <section className="space-y-6">
      <header>
        <ContextBack to="/comercial" label="Voltar ao Comercial" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Operação · Estoque</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="page-title">Estoque</h2><p className="page-subtitle">Saldo, entradas, saídas e movimentações dos materiais utilizados pelo Kaelo.</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowMovement(true)}><ArrowDownToLine size={16} /> Movimentar estoque</button>
            <button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Novo produto</button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi icon={<Package size={18} />} label="Itens em estoque" value={String(totalItems)} />
        <Kpi icon={<Warehouse size={18} />} label="Valor estimado" value={formatCurrency(inventoryValue)} />
        <Kpi icon={<ClipboardList size={18} />} label="Abaixo do mínimo" value={String(lowStock)} />
      </div>

      <div className="surface-card p-2"><div className="flex flex-wrap gap-2">
        {[
          ['saldo', 'Saldo de estoque'],
          ['movimentos', 'Movimentações'],
        ].map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={tab === value ? 'rounded-lg px-4 py-2 text-sm font-semibold bg-navy-900 text-white' : 'rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100'}>{label}</button>)}
      </div></div>

      <div className="surface-card flex items-center gap-3 p-4"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tab === 'saldo' ? 'Pesquisar produto, código ou local...' : 'Pesquisar movimentação...'} className="min-w-64 flex-1 border-0 bg-transparent text-sm outline-none" /></div>

      {tab === 'saldo' && <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><Package size={18} className="text-navy-800" /><div><h3 className="font-semibold text-navy-900">Saldo por produto</h3><p className="text-xs text-slate-500">A base será conectada posteriormente às movimentações reais.</p></div></div>
        <table className="w-full text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Código</th><th className="px-5 py-3">Produto</th><th className="px-5 py-3">Local</th><th className="px-5 py-3">Saldo</th><th className="px-5 py-3">Mínimo</th><th className="px-5 py-3">Custo</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">
          {filteredProducts.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5 text-slate-500">{item.codigo}</td><td className="px-5 py-3.5 font-medium text-navy-900">{item.nome}</td><td className="px-5 py-3.5">{item.local}</td><td className="px-5 py-3.5 font-semibold">{item.saldo} {item.unidade}</td><td className="px-5 py-3.5">{item.minimo}</td><td className="px-5 py-3.5">{formatCurrency(item.custo)}</td><td className="px-5 py-3.5"><StatusBadge tone={item.saldo < item.minimo ? 'yellow' : 'green'}>{item.saldo < item.minimo ? 'Repor' : 'Normal'}</StatusBadge></td></tr>)}
        </tbody></table>
      </div>}

      {tab === 'movimentos' && <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><ClipboardList size={18} className="text-navy-800" /><div><h3 className="font-semibold text-navy-900">Movimentações</h3><p className="text-xs text-slate-500">Cada entrada ou saída deverá gerar histórico próprio.</p></div></div>
        <table className="w-full text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Movimento</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3">Produto</th><th className="px-5 py-3">Qtd.</th><th className="px-5 py-3">Origem</th><th className="px-5 py-3">Destino</th></tr></thead><tbody className="divide-y divide-slate-100">
          {filteredMovements.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5 font-medium text-navy-900">{item.id}<div className="text-xs text-slate-400">{item.data}</div></td><td className="px-5 py-3.5"><StatusBadge tone={item.tipo === 'Entrada' ? 'green' : 'yellow'}>{item.tipo}</StatusBadge></td><td className="px-5 py-3.5">{item.produto}</td><td className="px-5 py-3.5 font-semibold">{item.quantidade}</td><td className="px-5 py-3.5">{item.origem}</td><td className="px-5 py-3.5">{item.destino}</td></tr>)}
        </tbody></table>
      </div>}


      {showMovement && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
        <form onSubmit={addMovement} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-navy-900">Movimentar estoque</h3>
          <p className="mt-1 text-sm text-slate-500">Entrada de compra ou saída para operação/OS. O saldo é atualizado no demo.{incomingOperation ? ` Operação ${incomingOperation.id} recebida para consumo.` : ''}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Tipo<select name="tipo" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>Entrada</option><option>Saída</option></select></label>
            <label className="text-sm font-medium text-slate-700">Produto<select name="produto" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">{products.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Quantidade<input name="quantidade" type="number" min="0.01" step="0.01" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Data<input name="data" type="date" defaultValue="2026-10-08" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Origem<input name="origem" defaultValue={incomingOperation?.id || ''} placeholder="Ex.: Compra, OS-1055" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Destino<input name="destino" defaultValue={incomingOperation?.cliente || ''} placeholder="Ex.: Almoxarifado, cliente" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowMovement(false)} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">Registrar movimento</button></div>
        </form>
      </div>}

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
        <form onSubmit={addProduct} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-navy-900">Novo produto em estoque</h3>
          <p className="mt-1 text-sm text-slate-500">Cadastro local para validação do fluxo.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Código<input name="codigo" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Ex.: CAB-6MM" /></label>
            <label className="text-sm font-medium text-slate-700">Produto<input name="nome" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Unidade<select name="unidade" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>un</option><option>m</option><option>kg</option><option>par</option></select></label>
            <label className="text-sm font-medium text-slate-700">Local<select name="local" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Saldo inicial<input name="saldo" type="number" step="0.01" defaultValue="0" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700">Estoque mínimo<input name="minimo" type="number" step="0.01" defaultValue="0" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Custo unitário<input name="custo" type="number" step="0.01" defaultValue="0" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">Salvar produto</button></div>
        </form>
      </div>}
    </section>
  )
}

function Kpi({ icon, label, value }) {
  return <div className="surface-card p-5"><div className="flex items-center gap-2 text-slate-500">{icon}<p className="text-xs uppercase tracking-wide">{label}</p></div><p className="mt-2 text-2xl font-bold text-navy-900">{value}</p></div>
}
