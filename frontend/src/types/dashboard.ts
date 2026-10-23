
/**
 * Indicadores gerais do Dashboard.
 *
 * Os seis campos originais continuam obrigatórios
 * para preservar a compatibilidade com o frontend.
 *
 * Os novos indicadores são opcionais enquanto
 * o backend não disponibilizar esses dados.
 */
export interface DashboardResumo {
  total_analises: number
  baixo_risco: number
  medio_risco: number
  alto_risco: number
  inadimplencia_media: number
  volume_credito_total: number

  // Indicadores adicionais da Figura 11.
  carteira_ativa?: number
  numero_operacoes?: number
}

/**
 * Registro de inadimplência em determinado período.
 *
 * Exemplo:
 * {
 *   periodo: '2026-01',
 *   taxa_inadimplencia: 4.2
 * }
 */
export interface EvolucaoInadimplenciaItem {
  periodo: string
  taxa_inadimplencia: number
}

/**
 * Distribuição das operações por modalidade.
 *
 * Exemplo:
 * {
 *   modalidade: 'Capital de Giro',
 *   quantidade: 120,
 *   percentual: 35.5
 * }
 */
export interface DistribuicaoModalidadeItem {
  modalidade: string
  quantidade: number
  percentual: number
}

/**
 * Informações complementares para
 * visualização dos indicadores de crédito.
 *
 * Esses campos são opcionais para permitir
 * integração gradual com a API.
 */
export interface DashboardDetalhes {
  evolucao_inadimplencia?: EvolucaoInadimplenciaItem[]
  distribuicao_modalidade?: DistribuicaoModalidadeItem[]
}

/**
 * Resposta completa esperada do Dashboard.
 *
 * Mantém os dados atuais e permite receber
 * as novas informações quando disponíveis.
 */
export type DashboardCompleto =
  DashboardResumo & DashboardDetalhes
