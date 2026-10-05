import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  function submit(event) {
    event.preventDefault()
    navigate('/')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-navy-950 text-white">
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-solar-yellow/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-solar-green/10 blur-3xl" />
        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
          <div className="hidden min-h-[620px] flex-col justify-between border-r border-white/10 p-10 lg:flex">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-solar-yellow text-navy-950 shadow-lg shadow-solar-yellow/20">
                  <span className="text-xl font-black">K</span>
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">Kaelo</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-solar-mint/80">ERP · Plataforma</p>
                </div>
              </div>
              <div className="mt-24 max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-solar-yellow/20 bg-solar-yellow/10 px-3 py-1.5 text-xs font-semibold text-solar-yellow">
                  <Sparkles size={14} /> Gestão inteligente
                </div>
                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">Tudo conectado em um só ambiente.</h1>
                <p className="mt-6 text-base leading-7 text-slate-300">Comercial, serviços, Gestão de UFV, financeiro e relatórios organizados por licença, perfil e necessidade da sua empresa.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Comercial', 'Serviços', 'Gestão UFV'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs font-semibold text-slate-200">{item}</p><div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-1 w-2/3 rounded-full bg-solar-yellow" /></div></div>)}
            </div>
          </div>

          <div className="flex min-h-[620px] flex-col justify-center bg-white p-7 text-navy-950 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-solar-yellow text-navy-950"><span className="text-xl font-black">K</span></div>
                  <div><p className="text-xl font-bold">Kaelo</p><p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">ERP · Plataforma</p></div>
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-solar-green">Acesso seguro</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Entrar no Kaelo</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Acesse sua organização e os módulos liberados para seu perfil.</p>

              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block text-sm font-semibold text-slate-700">Login ou e-mail
                  <div className="relative mt-1.5">
                    <UserRound size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="login" autoComplete="username" required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-solar-green focus:ring-4 focus:ring-solar-green/10" placeholder="seu.login ou e-mail" />
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-700">Senha
                  <div className="relative mt-1.5">
                    <LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 outline-none transition focus:border-solar-green focus:ring-4 focus:ring-solar-green/10" placeholder="••••••••" />
                    <button type="button" aria-label="Mostrar senha" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                  </div>
                </label>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" className="rounded" /> Lembrar acesso</label>
                  <button type="button" className="font-semibold text-navy-800 hover:underline">Esqueci minha senha</button>
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy-950/15 transition hover:-translate-y-0.5 hover:bg-navy-900">
                  Entrar <ArrowRight size={17} />
                </button>
              </form>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-solar-green" />
                <div><p className="text-xs font-semibold text-navy-900">Ambiente protegido</p><p className="mt-1 text-[11px] leading-5 text-slate-500">A autenticação real, MFA, sessão e recuperação de senha serão conectados ao serviço de autenticação na próxima etapa.</p></div>
              </div>
              <p className="mt-6 text-center text-[11px] text-slate-400">Kaelo · Ambiente demonstrativo · Versão 0.1</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
