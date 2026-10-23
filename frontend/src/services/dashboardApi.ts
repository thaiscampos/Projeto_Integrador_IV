
import type {
  DashboardCompleto,
  EvolucaoInadimplenciaItem,
  DistribuicaoModalidadeItem,
} from '../types/dashboard'

// =========================================
// CONFIGURAÇÃO DA API
// =========================================

// Desenvolvimento: utiliza a API local.
// Produção: utiliza VITE_API_URL ou o mesmo domínio.
const API_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8000' : '')
).replace(/\/+$/, '')

// =========================================
// VALIDAÇÕES BÁSICAS
// =========================================

function objetoValido(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    !Array.isArray(valor)
  )
}

function numeroValido(
  valor: unknown
): valor is number {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= 0
  )
}

function contagemValida(
  valor: unknown
): valor is number {
  return (
    numeroValido(valor) &&
    Number.isInteger(valor)
  )
}

function percentualValido(
  valor: unknown
): valor is number {
  return numeroValido(valor) && valor <= 100
}

function textoValido(
  valor: unknown
): valor is string {
  return (
    typeof valor === 'string' &&
    valor.trim().length > 0
  )
}

// =========================================
// EVOLUÇÃO DA INADIMPLÊNCIA
// =========================================

function validarEvolucaoItem(
  item: unknown
): item is EvolucaoInadimplenciaItem {
  if (!objetoValido(item)) {
    return false
  }

  return (
    typeof item.periodo === 'string' &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(item.periodo) &&
    percentualValido(item.taxa_inadimplencia)
  )
}

function validarEvolucao(
  dados: unknown
): dados is EvolucaoInadimplenciaItem[] {
  return (
    Array.isArray(dados) &&
    dados.every(validarEvolucaoItem)
  )
}

// =========================================
// DISTRIBUIÇÃO POR MODALIDADE
// =========================================

function validarModalidadeItem(
  item: unknown
): item is DistribuicaoModalidadeItem {
  if (!objetoValido(item)) {
    return false
  }

  return (
    textoValido(item.modalidade) &&
    contagemValida(item.quantidade) &&
    percentualValido(item.percentual)
  )
}

function validarDistribuicao(
  dados: unknown
): dados is DistribuicaoModalidadeItem[] {
  return (
    Array.isArray(dados) &&
    dados.every(validarModalidadeItem)
  )
}

// =========================================
// VALIDAÇÃO COMPLETA DO DASHBOARD
// =========================================

function validarDashboard(
  dados: unknown
): dados is DashboardCompleto {
  if (!objetoValido(dados)) {
    return false
  }

  // Seis indicadores originais obrigatórios.
  const indicadoresBasicosValidos =
    contagemValida(dados.total_analises) &&
    contagemValida(dados.baixo_risco) &&
    contagemValida(dados.medio_risco) &&
    contagemValida(dados.alto_risco) &&
    percentualValido(dados.inadimplencia_media) &&
    numeroValido(dados.volume_credito_total)

  if (!indicadoresBasicosValidos) {
    return false
  }

  // Indicadores adicionais opcionais.
  if (
    dados.carteira_ativa !== undefined &&
    !numeroValido(dados.carteira_ativa)
  ) {
    return false
  }

  if (
    dados.numero_operacoes !== undefined &&
    !contagemValida(dados.numero_operacoes)
  ) {
    return false
  }

  // Série histórica opcional.
  if (
    dados.evolucao_inadimplencia !== undefined &&
    !validarEvolucao(dados.evolucao_inadimplencia)
  ) {
    return false
  }

  // Distribuição por modalidade opcional.
  if (
    dados.distribuicao_modalidade !== undefined &&
    !validarDistribuicao(dados.distribuicao_modalidade)
  ) {
    return false
  }

  return true
}

// =========================================
// CONSULTA AO BACKEND
// =========================================

export async function buscarDashboard():
  Promise<DashboardCompleto> {
  let response: Response

  try {
    response = await fetch(
      `${API_URL}/api/dashboard/`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. ' +
      'Verifique se a API está disponível.'
    )
  }

  // =========================================
  // TRATAMENTO DE ERROS HTTP
  // =========================================

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        'A rota /api/dashboard/ ainda não está ' +
        'disponível no backend.'
      )
    }

    throw new Error(
      'Não foi possível consultar o Dashboard. ' +
      `O servidor retornou HTTP ${response.status}.`
    )
  }

  // =========================================
  // LEITURA DO JSON
  // =========================================

  let dados: unknown

  try {
    dados = await response.json()
  } catch {
    throw new Error(
      'A API retornou uma resposta JSON inválida.'
    )
  }

  // =========================================
  // VALIDAÇÃO DA RESPOSTA
  // =========================================

  if (!validarDashboard(dados)) {
    throw new Error(
      'A API retornou dados incompatíveis ' +
      'com o formato esperado pelo Dashboard.'
    )
  }

  return dados
}
