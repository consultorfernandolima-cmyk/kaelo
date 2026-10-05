/**
 * Fonte de irradiação para o pré-dimensionamento solar do Kaelo.
 *
 * Fonte primária prevista para Brasil:
 * CRESESB/CEPEL — SunData.
 *
 * O SunData fornece médias diárias mensais de irradiação solar
 * (kWh/m².dia) e média anual para uma localidade/coordenadas.
 *
 * Importante:
 * - não duplicar uma base solarimétrica estática sem registrar a fonte e a data;
 * - não transformar HSP em um valor fixo global para todas as cidades;
 * - a proposta deve guardar a localidade/coordenadas, a fonte e os 12 valores
 *   mensais usados no cálculo;
 * - a integração automática com o serviço/fonte deve ocorrer no backend,
 *   e não diretamente no navegador, quando houver endpoint estável/permitido.
 */

export const IRRADIANCE_SOURCE = {
  provider: 'CRESESB',
  dataset: 'SunData',
  country: 'BR',
  unit: 'kWh/m².dia',
  officialSite: 'https://www.cresesb.cepel.br/',
}

export const emptyMonthlyIrradiance = () => ({
  jan: null,
  fev: null,
  mar: null,
  abr: null,
  mai: null,
  jun: null,
  jul: null,
  ago: null,
  set: null,
  out: null,
  nov: null,
  dez: null,
  mediaAnual: null,
})

export function normalizeIrradianceRecord(record = {}) {
  return {
    ...emptyMonthlyIrradiance(),
    ...record,
    fonte: record.fonte || 'CRESESB SunData',
    unidade: record.unidade || IRRADIANCE_SOURCE.unit,
  }
}

/**
 * Seleciona a HSP de projeto.
 * Para propostas mensais, usar o mês correspondente.
 * Para uma estimativa simplificada anual, usar a média anual.
 */
export function selectHsp(record, month) {
  const data = normalizeIrradianceRecord(record)
  if (month && data[month] != null) return Number(data[month])
  if (data.mediaAnual != null) return Number(data.mediaAnual)
  return 0
}
