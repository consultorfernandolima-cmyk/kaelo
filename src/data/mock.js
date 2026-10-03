export const kpis = {
  parceiros: 128,
  oportunidades: 27,
  propostasAbertas: 14,
  contratosAtivos: 38,
  contasReceber: 284500,
  contasPagar: 173200,
  ordensAbertas: 11,
  estoqueCritico: 6,
}

export const funil = [
  { etapa: 'Prospecção', quantidade: 12, valor: 184000 },
  { etapa: 'Proposta enviada', quantidade: 7, valor: 326500 },
  { etapa: 'Negociação', quantidade: 5, valor: 412000 },
  { etapa: 'Ganho', quantidade: 3, valor: 219800 },
]

export const atividadesRecentes = [
  { id: 1, tipo: 'Proposta', descricao: 'Proposta P-220 enviada para Clínica Vida Plena', quando: 'Hoje, 09:42' },
  { id: 2, tipo: 'CRM', descricao: 'Novo contato agendado com Escola Horizonte', quando: 'Hoje, 08:15' },
  { id: 3, tipo: 'Financeiro', descricao: 'Recebimento conciliado — R$ 18.450,00', quando: 'Ontem, 16:20' },
  { id: 4, tipo: 'Operação', descricao: 'OS-1051 confirmada para execução', quando: 'Ontem, 14:08' },
]

export const proximasManutencoes = [
  { id: 'OS-1042', cliente: 'Fazenda Santa Luz', usina: 'Usina SL-12 kWp', tipo: 'Limpeza de módulos', data: '2026-10-04', tecnico: 'Ana Souza', status: 'Agendada' },
  { id: 'OS-1048', cliente: 'Mercado Bom Preço', usina: 'Cobertura 45 kWp', tipo: 'Manutenção preventiva', data: '2026-10-06', tecnico: 'Carlos Lima', status: 'Agendada' },
  { id: 'OS-1051', cliente: 'Residencial Aurora', usina: 'Telhado 8,2 kWp', tipo: 'Limpeza de módulos', data: '2026-10-07', tecnico: 'Pedro Alves', status: 'Confirmada' },
  { id: 'OS-1055', cliente: 'Clínica Vida Plena', usina: 'Carport 28 kWp', tipo: 'Inspeção elétrica', data: '2026-10-09', tecnico: 'Ana Souza', status: 'Pendente' },
]

export const clientes = [
  { id: 'C-001', nome: 'Fazenda Santa Luz', cidade: 'Uberaba/MG', usinas: 2, status: 'Ativo' },
  { id: 'C-002', nome: 'Mercado Bom Preço', cidade: 'Ribeirão Preto/SP', usinas: 1, status: 'Ativo' },
  { id: 'C-003', nome: 'Residencial Aurora', cidade: 'Campinas/SP', usinas: 1, status: 'Ativo' },
  { id: 'C-004', nome: 'Clínica Vida Plena', cidade: 'Goiânia/GO', usinas: 1, status: 'Prospecto' },
  { id: 'C-005', nome: 'Indústria Vale Verde', cidade: 'Londrina/PR', usinas: 3, status: 'Ativo' },
]

export const usinas = [
  { id: 'U-12', nome: 'Usina SL-12 kWp', cliente: 'Fazenda Santa Luz', potenciaKwp: 12, status: 'Operando' },
  { id: 'U-45', nome: 'Cobertura 45 kWp', cliente: 'Mercado Bom Preço', potenciaKwp: 45, status: 'Operando' },
  { id: 'U-08', nome: 'Telhado 8,2 kWp', cliente: 'Residencial Aurora', potenciaKwp: 8.2, status: 'Operando' },
  { id: 'U-28', nome: 'Carport 28 kWp', cliente: 'Clínica Vida Plena', potenciaKwp: 28, status: 'Em instalação' },
  { id: 'U-180', nome: 'Solo 180 kWp', cliente: 'Indústria Vale Verde', potenciaKwp: 180, status: 'Operando' },
]

export const propostas = [
  { id: 'P-220', cliente: 'Clínica Vida Plena', valor: 148900, etapa: 'Enviada', validade: '2026-10-15' },
  { id: 'P-221', cliente: 'Escola Horizonte', valor: 312000, etapa: 'Em elaboração', validade: '2026-10-22' },
  { id: 'P-218', cliente: 'Condomínio Solar Park', valor: 890500, etapa: 'Negociação', validade: '2026-10-05' },
]
