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
  energiaNecessariaOverride,
  potenciaPicoOverride,
  fatorPotencia = 0.95,
}) {
  const energia = Number(energiaDiaria || 0)
  const picoKva = Number(potenciaPicoOverride ?? potenciaPicoKva ?? 0)
  const fp = Math.min(1, Math.max(0.1, Number(fatorPotencia || 0.95)))
  const picoKw = picoKva * fp
  const critica = Number(potenciaCriticaKw || 0)
  const horas = Number(duracaoHoras || 0)
  const dias = Number(autonomiaDias || 1)
  const depth = Number(dod || 0) / 100
  const eff = Number(eficiencia || 0) / 100
  const degr = Number(degradacao || 0) / 100
  const margin = 1 + Number(margem || 0) / 100

  let energiaBase
  if (objetivo === 'backup') energiaBase = critica * horas * dias
  else if (objetivo === 'peak-shaving') energiaBase = Math.max(0, picoKw - critica) * horas * dias
  else energiaBase = energia * dias

  const energiaNecessaria = Number.isFinite(Number(energiaNecessariaOverride)) ? Number(energiaNecessariaOverride) : energiaBase
  const energiaUtil = energiaNecessaria * margin
  const denom = Math.max(depth * eff * Math.max(0.01, 1 - degr), 0.01)
  const capacidadeNominal = energiaUtil / denom
  const qtdBaterias = Number(bateriaNominalKwh) > 0 ? Math.ceil(capacidadeNominal / Number(bateriaNominalKwh)) : 0
  const capacidadeInstalada = qtdBaterias * Number(bateriaNominalKwh || 0)
  const potenciaBateriaDisponivel = qtdBaterias * Number(bateriaPotenciaKw || 0)
  const potenciaInversorNecessaria = Math.max(picoKva, critica / fp) * margin
  const potenciaBateriaNecessaria = Math.max(critica, picoKw)
  const inversorAtende = Number(inversorPotenciaKva || 0) >= potenciaInversorNecessaria
  const bateriaAtendePotencia = potenciaBateriaDisponivel >= potenciaBateriaNecessaria

  return {
    energiaBase,
    energiaNecessaria,
    energiaUtil,
    capacidadeNominal,
    qtdBaterias,
    capacidadeInstalada,
    potenciaBateriaDisponivel,
    potenciaInversorNecessaria,
    potenciaBateriaNecessaria,
    fatorPotencia: fp,
    potenciaPicoKw: picoKw,
    inversorAtende,
    bateriaAtendePotencia,
  }
}

export function calcHybridFromLoads({ loads = [], backupHours = 8 }) {
  const hours = Number(backupHours || 0)
  const normalized = loads.map(load => ({
    name: load.name || 'Carga',
    powerKw: Math.max(0, Number(load.powerKw || 0)),
    hoursPerDay: Math.max(0, Number(load.hoursPerDay || 0)),
    simultaneity: Math.max(0, Math.min(1, Number(load.simultaneity ?? 1))),
    critical: Boolean(load.critical),
  }))

  const dailyEnergy = normalized.reduce(
    (sum, load) => sum + load.powerKw * load.hoursPerDay * load.simultaneity,
    0,
  )

  const criticalPower = normalized.reduce(
    (sum, load) => sum + (load.critical ? load.powerKw * load.simultaneity : 0),
    0,
  )

  const criticalEnergy = normalized.reduce(
    (sum, load) =>
      sum +
      (load.critical
        ? load.powerKw * Math.min(load.hoursPerDay, hours) * load.simultaneity
        : 0),
    0,
  )

  const connectedPeak = normalized.reduce(
    (sum, load) => sum + load.powerKw * load.simultaneity,
    0,
  )

  return {
    dailyEnergy,
    criticalPower,
    criticalEnergy,
    connectedPeak,
    loadCount: normalized.length,
  }
}


export function calcPriceFormation({
  kit,
  instalacao,
  projetoEletrico,
  art,
  materialCc,
  materialCa,
  transformador,
  frete,
  outros,
  impostos,
  comissao,
  margem,
}) {
  const values = {
    kit, instalacao, projetoEletrico, art, materialCc, materialCa,
    transformador, frete, outros,
  }
  const custoDireto = Object.values(values).reduce((sum, value) => sum + Math.max(0, Number(value || 0)), 0)
  const imposto = Math.max(0, Number(impostos || 0))
  const comissaoValue = Math.max(0, Number(comissao || 0))
  const margemPercent = Math.max(0, Number(margem || 0))
  const baseAntesMargem = custoDireto + imposto + comissaoValue
  const precoVenda = baseAntesMargem * (1 + margemPercent / 100)
  const lucroBruto = precoVenda - custoDireto
  const lucroLiquido = precoVenda - baseAntesMargem
  const margemLiquida = precoVenda > 0 ? lucroLiquido / precoVenda : 0
  return {
    custoDireto,
    baseAntesMargem,
    precoVenda,
    lucroBruto,
    lucroLiquido,
    margemLiquida,
  }
}
