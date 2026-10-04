// Motor de pré-dimensionamento de Energia Solar.
// As funções são transparentes e mantêm as premissas editáveis.
// O resultado híbrido é um pré-dimensionamento: a validação final depende
// dos dados horários, equipamentos selecionados, fabricante e distribuidora.

export function calcOnGrid({ consumoMensal, hsp, performanceRatio, potenciaModuloWp }) {
  const consumo = Number(consumoMensal || 0)
  const hspValue = Number(hsp || 0)
  const pr = Number(performanceRatio || 0) / 100
  const modulo = Number(potenciaModuloWp || 0)
  const geracaoNecessaria = hspValue * pr * 30
  const potenciaKwp = geracaoNecessaria > 0 ? consumo / geracaoNecessaria : 0
  const quantidadeModulos = modulo > 0 ? Math.ceil((potenciaKwp * 1000) / modulo) : 0
  const potenciaRealKwp = quantidadeModulos * modulo / 1000
  const geracaoEstimada = potenciaRealKwp * hspValue * pr * 30
  const atendimento = consumo > 0 ? geracaoEstimada / consumo : 0
  return { geracaoNecessaria, potenciaKwp, quantidadeModulos, potenciaRealKwp, geracaoEstimada, atendimento }
}

export function calcHybrid({
  objetivo,
  energiaDiaria,
  potenciaCriticaKw,
  potenciaPicoKva,
  duracaoHoras,
  autonomiaDias,
  dod,
  eficiencia,
  degradacao,
  margem,
  bateriaNominalKwh,
  bateriaPotenciaKw,
  inversorPotenciaKva,
}) {
  const energia = Number(energiaDiaria || 0)
  const pico = Number(potenciaPicoKva || potenciaCriticaKw || 0)
  const critica = Number(potenciaCriticaKw || 0)
  const horas = Number(duracaoHoras || 0)
  const dias = Number(autonomiaDias || 1)
  const depth = Number(dod || 0) / 100
  const eff = Number(eficiencia || 0) / 100
  const degr = Number(degradacao || 0) / 100
  const margin = 1 + Number(margem || 0) / 100

  let energiaBase
  if (objetivo === 'backup') energiaBase = critica * horas * dias
  else if (objetivo === 'peak-shaving') energiaBase = Math.max(0, pico - critica) * horas * dias
  else energiaBase = energia * dias

  const energiaUtil = energiaBase * margin
  const denom = Math.max(depth * eff * Math.max(0.01, 1 - degr), 0.01)
  const capacidadeNominal = energiaUtil / denom
  const qtdBaterias = Number(bateriaNominalKwh) > 0 ? Math.ceil(capacidadeNominal / Number(bateriaNominalKwh)) : 0
  const capacidadeInstalada = qtdBaterias * Number(bateriaNominalKwh || 0)
  const potenciaBateriaDisponivel = qtdBaterias * Number(bateriaPotenciaKw || 0)
  const potenciaInversorNecessaria = Math.max(pico, critica) * margin
  const inversorAtende = Number(inversorPotenciaKva || 0) >= potenciaInversorNecessaria
  const bateriaAtendePotencia = potenciaBateriaDisponivel >= Math.max(critica, pico)

  return {
    energiaBase,
    energiaUtil,
    capacidadeNominal,
    qtdBaterias,
    capacidadeInstalada,
    potenciaBateriaDisponivel,
    potenciaInversorNecessaria,
    inversorAtende,
    bateriaAtendePotencia,
  }
}
