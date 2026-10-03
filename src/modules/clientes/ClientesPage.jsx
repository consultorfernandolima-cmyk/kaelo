import { useMemo, useState } from 'react'
import { Building2, Eye, Filter, Mail, MoreHorizontal, Pencil, Phone, Plus, Search, UserRound, X } from 'lucide-react'
import { StatusBadge } from '../../components/ui.jsx'
import { parceiros as parceirosIniciais } from '../../data/mock.js'

const initialForm = {
  tipoPessoa: 'PJ', razaoSocial: '', nomeFantasia: '', documento: '', email: '',
  telefone: '', cidade: '', uf: '', cliente: true, fornecedor: false,
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-solar-yellow/30'

function Field({ label, children, required = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}{required ? <span className="text-red-500"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

export default function ClientesPage() {
  const [parceiros, setParceiros] = useState(parceirosIniciais)
  const [search, setSearch] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [papelFiltro, setPapelFiltro] = useState('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return parceiros.filter((item) => {
      const matchesQuery = !query || item.nome.toLowerCase().includes(query) || item.documento.toLowerCase().includes(query) || item.cidade.toLowerCase().includes(query)
      const matchesTipo = tipoFiltro === 'Todos' || item.tipo === tipoFiltro
      const matchesPapel = papelFiltro === 'Todos' || (papelFiltro === 'Cliente' && item.cliente) || (papelFiltro === 'Fornecedor' && item.fornecedor)
      return matchesQuery && matchesTipo && matchesPapel
    })
  }, [parceiros, search, tipoFiltro, papelFiltro])

  function updateForm(field, value) { setForm((current) => ({ ...current, [field]: value })) }

  function openNew() {
    setSelected(null); setForm(initialForm); setModalOpen(true)
  }

  function openEdit(item) {
    setSelected(item)
    setForm({
      tipoPessoa: item.tipo, razaoSocial: item.nome, nomeFantasia: item.nome, documento: item.documento,
      email: item.email, telefone: item.telefone, cidade: item.cidade, uf: item.uf,
      cliente: item.cliente, fornecedor: item.fornecedor,
    })
    setModalOpen(true)
  }

  function saveLocal() {
    const nome = form.nomeFantasia || form.razaoSocial
    if (!nome || !form.documento) return

    const values = {
      nome, tipo: form.tipoPessoa, documento: form.documento, email: form.email, telefone: form.telefone,
      cidade: form.cidade, uf: form.uf, cliente: form.cliente, fornecedor: form.fornecedor, status: 'Ativo',
    }

    if (selected) {
      setParceiros((current) => current.map((item) => item.id === selected.id ? { ...item, ...values } : item))
    } else {
      setParceiros((current) => [...current, { id: 'P-' + String(current.length + 1).padStart(3, '0'), ...values }])
    }

    setModalOpen(false); setSelected(null); setForm(initialForm)
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Cadastros</p>
          <h2 className="page-title">Parceiros</h2>
          <p className="page-subtitle">Cadastro base para clientes, fornecedores e demais relações comerciais.</p>
        </div>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-800">
          <Plus size={16} /> Novo parceiro
        </button>
      </header>

      <div className="surface-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_170px_170px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, documento ou cidade…" className={inputClass + ' pl-9'} />
          </label>
          <select value={tipoFiltro} onChange={(event) => setTipoFiltro(event.target.value)} className={inputClass}>
            <option>Todos</option><option>PJ</option><option>PF</option>
          </select>
          <select value={papelFiltro} onChange={(event) => setPapelFiltro(event.target.value)} className={inputClass}>
            <option>Todos</option><option>Cliente</option><option>Fornecedor</option>
          </select>
          <button type="button" onClick={() => { setSearch(''); setTipoFiltro('Todos'); setPapelFiltro('Todos') }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={15} /> Limpar
          </button>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">Lista de parceiros</h3>
            <p className="mt-0.5 text-xs text-slate-500">{filtered.length} registro(s) na visão atual</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Demonstração</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Parceiro</th><th className="px-5 py-3 font-medium">Documento</th>
                <th className="px-5 py-3 font-medium">Papel</th><th className="px-5 py-3 font-medium">Contato</th>
                <th className="px-5 py-3 font-medium">Localização</th><th className="px-5 py-3 font-medium">Status</th>
                <th className="w-24 px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-800">{item.tipo === 'PJ' ? <Building2 size={16} /> : <UserRound size={16} />}</div>
                      <div><p className="font-medium text-navy-900">{item.nome}</p><p className="text-xs text-slate-400">{item.id} · {item.tipo}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{item.documento}</td>
                  <td className="px-5 py-3.5"><div className="flex flex-wrap gap-1.5">{item.cliente ? <StatusBadge tone="navy">Cliente</StatusBadge> : null}{item.fornecedor ? <StatusBadge tone="yellow">Fornecedor</StatusBadge> : null}</div></td>
                  <td className="px-5 py-3.5"><div className="space-y-1 text-xs text-slate-500"><div className="flex items-center gap-1.5"><Mail size={12} />{item.email || '—'}</div><div className="flex items-center gap-1.5"><Phone size={12} />{item.telefone || '—'}</div></div></td>
                  <td className="px-5 py-3.5 text-slate-600">{item.cidade}/{item.uf}</td>
                  <td className="px-5 py-3.5"><StatusBadge tone={item.status === 'Ativo' ? 'green' : 'slate'}>{item.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex justify-end gap-1">
                    <button type="button" onClick={() => setSelected(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900" aria-label="Visualizar"><Eye size={15} /></button>
                    <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900" aria-label="Editar"><Pencil size={15} /></button>
                    <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Mais opções"><MoreHorizontal size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length ? <tr><td colSpan="7" className="px-5 py-12 text-center text-sm text-slate-500">Nenhum parceiro encontrado com os filtros atuais.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      {selected && !modalOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-navy-950/25" onClick={() => setSelected(null)}>
          <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Detalhes</p><h3 className="mt-1 text-xl font-semibold text-navy-900">{selected.nome}</h3><p className="mt-1 text-xs text-slate-400">{selected.documento}</p></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Papéis</p><div className="mt-2 flex gap-2">{selected.cliente ? <StatusBadge tone="navy">Cliente</StatusBadge> : null}{selected.fornecedor ? <StatusBadge tone="yellow">Fornecedor</StatusBadge> : null}</div></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-slate-400">E-mail</p><p className="mt-1 text-sm text-navy-900">{selected.email || '—'}</p></div>
                <div><p className="text-xs text-slate-400">Telefone</p><p className="mt-1 text-sm text-navy-900">{selected.telefone || '—'}</p></div>
                <div><p className="text-xs text-slate-400">Cidade</p><p className="mt-1 text-sm text-navy-900">{selected.cidade}/{selected.uf}</p></div>
                <div><p className="text-xs text-slate-400">Status</p><div className="mt-1"><StatusBadge tone="green">{selected.status}</StatusBadge></div></div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-green">Cadastro base</p><h3 className="mt-1 text-xl font-semibold text-navy-900">{selected ? 'Editar parceiro' : 'Novo parceiro'}</h3><p className="mt-1 text-sm text-slate-500">Nesta etapa, o cadastro funciona localmente para validação do fluxo visual.</p></div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Tipo de pessoa" required><select value={form.tipoPessoa} onChange={(event) => updateForm('tipoPessoa', event.target.value)} className={inputClass}><option value="PJ">Pessoa jurídica</option><option value="PF">Pessoa física</option></select></Field>
                <Field label={form.tipoPessoa === 'PJ' ? 'CNPJ' : 'CPF'} required><input value={form.documento} onChange={(event) => updateForm('documento', event.target.value)} placeholder={form.tipoPessoa === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'} className={inputClass} /></Field>
                <Field label="Status"><select value="Ativo" disabled className={inputClass + ' bg-slate-50 text-slate-500'}><option>Ativo</option></select></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={form.tipoPessoa === 'PJ' ? 'Razão social' : 'Nome completo'}><input value={form.razaoSocial} onChange={(event) => updateForm('razaoSocial', event.target.value)} placeholder="Digite o nome cadastral" className={inputClass} /></Field>
                <Field label={form.tipoPessoa === 'PJ' ? 'Nome fantasia' : 'Nome de exibição'} required><input value={form.nomeFantasia} onChange={(event) => updateForm('nomeFantasia', event.target.value)} placeholder="Como aparecerá no Kaelo" className={inputClass} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail"><input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="contato@empresa.com.br" className={inputClass} /></Field>
                <Field label="Telefone"><input value={form.telefone} onChange={(event) => updateForm('telefone', event.target.value)} placeholder="(00) 00000-0000" className={inputClass} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <Field label="Cidade"><input value={form.cidade} onChange={(event) => updateForm('cidade', event.target.value)} placeholder="Cidade" className={inputClass} /></Field>
                <Field label="UF"><input maxLength="2" value={form.uf} onChange={(event) => updateForm('uf', event.target.value.toUpperCase())} placeholder="SP" className={inputClass} /></Field>
              </div>
              <div><p className="mb-2 text-xs font-semibold text-slate-600">Papéis no Kaelo</p><div className="flex flex-wrap gap-2">
                {[['cliente', 'Cliente'], ['fornecedor', 'Fornecedor']].map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-900/5 has-[:checked]:text-navy-900">
                    <input type="checkbox" checked={form[key]} onChange={(event) => updateForm(key, event.target.checked)} />{label}
                  </label>
                ))}
              </div></div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button type="button" onClick={saveLocal} disabled={!form.documento || !(form.nomeFantasia || form.razaoSocial)} className="rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-navy-800">{selected ? 'Salvar alterações' : 'Adicionar parceiro'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
