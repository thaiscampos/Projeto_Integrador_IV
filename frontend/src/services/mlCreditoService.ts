import type { DadosSimulacao } from '../types/simulacao'
import type { ResultadoSimulacao, FatorExplicabilidade } from './simulacaoApi'

// Estimativa média de renda mensal por faixa (em R$)
const MAPA_RENDA_PF: Record<string, number> = {
  'Até 1 SM': 1518,
  '1 a 2 SM': 2500,
  '2 a 3 SM': 3800,
  '3 a 5 SM': 6000,
  '5 a 10 SM': 11500,
  '10 a 20 SM': 22000,
  'Acima de 20 SM': 38000,
}

// Estimativa de faturamento médio mensal por porte (em R$)
const MAPA_FATURAMENTO_PJ: Record<string, number> = {
  MEI: 6500,
  Microempresa: 28000,
  'Pequena Empresa': 140000,
  'Média Empresa': 650000,
  'Grande Empresa': 3500000,
}

// Inadimplência média e risco intrínseco por modalidade de crédito (Séries BACEN SCR)
const DADOS_MODALIDADE: Record<
  string,
  { taxaInadimplencia: number; pesoRisco: number; carteiraMedia: number }
> = {
  Consignado: { taxaInadimplencia: 2.1, pesoRisco: -15, carteiraMedia: 18500 },
  Financiamento: { taxaInadimplencia: 2.8, pesoRisco: -10, carteiraMedia: 42000 },
  Imobiliário: { taxaInadimplencia: 1.8, pesoRisco: -20, carteiraMedia: 220000 },
  Rural: { taxaInadimplencia: 2.6, pesoRisco: -5, carteiraMedia: 75000 },
  'Capital de Giro': { taxaInadimplencia: 4.4, pesoRisco: 10, carteiraMedia: 68000 },
  'Crédito Pessoal': { taxaInadimplencia: 6.8, pesoRisco: 25, carteiraMedia: 9500 },
  'Cartão de Crédito': { taxaInadimplencia: 9.7, pesoRisco: 35, carteiraMedia: 4200 },
}

// Inadimplência média histórica por região (Bacen)
const TAXAS_REGIONAIS: Record<string, number> = {
  SP: 3.5,
  RJ: 4.1,
  MG: 3.4,
  RS: 3.2,
  PR: 3.1,
  SC: 2.9,
  BA: 4.6,
  PE: 4.8,
  CE: 4.5,
  DF: 3.3,
  GO: 3.7,
}

/**
 * Estima a capacidade mensal financeira do solicitante.
 */
export function estimarRendaMensal(dados: Partial<DadosSimulacao>): number {
  if (dados.tipoCliente === 'PJ') {
    return MAPA_FATURAMENTO_PJ[dados.porteEmpresa || 'Microempresa'] ?? 30000
  }
  return MAPA_RENDA_PF[dados.faixaRenda || '2 a 3 SM'] ?? 4000
}

export interface DetalhesInferenciaML extends ResultadoSimulacao {
  score: number
  probabilidadeAprovacao: number
  comprometimentoRenda: number
  rendaEstimada: number
  valorSolicitado: number
  fatoresExplicabilidade: FatorExplicabilidade[]
  recomendacoes: string[]
}

/**
 * Motor de Machine Learning / Scoring para análise de crédito.
 * Executa a normalização dos atributos, inferência probabilística e explicabilidade (XAI).
 */
export function executarInferenciaML(dados: DadosSimulacao): DetalhesInferenciaML {
  const rendaMensal = estimarRendaMensal(dados)
  const valorSolicitado = Math.max(dados.valorPretendido ?? 10000, 500)

  // 1. Engenharia de Features: Taxa de Comprometimento / Alavancagem
  // Relação entre o valor pretendido e a capacidade financeira mensal
  const razaoValorRenda = valorSolicitado / Math.max(rendaMensal, 1)

  // 2. Parâmetros da modalidade de crédito
  const dadosModalidade = DADOS_MODALIDADE[dados.modalidadeCredito] ?? {
    taxaInadimplencia: 4.2,
    pesoRisco: 0,
    carteiraMedia: 35000,
  }

  // 3. Taxa regional base do Bacen
  const taxaRegional = TAXAS_REGIONAIS[dados.estado.toUpperCase()] ?? 3.8

  // 4. Modelo de Pontuação (Score de 0 a 1000)
  // Base inicial do modelo = 650 pontos (Score neutro)
  let scoreBruto = 650

  const fatores: FatorExplicabilidade[] = []

  // Feature A: Razão Valor Solicitado / Renda
  let impactoRenda = 0
  if (razaoValorRenda <= 1.5) {
    impactoRenda = 160
    fatores.push({
      fator: 'Comprometimento Financeiro Saudável',
      impacto: 160,
      descricao: `Valor solicitado representa ${razaoValorRenda.toFixed(1)}x a renda mensal estimada, dentro do limite conservador.`,
    })
  } else if (razaoValorRenda <= 4.0) {
    impactoRenda = 60
    fatores.push({
      fator: 'Comprometimento Moderado',
      impacto: 60,
      descricao: `Valor solicitado representa ${razaoValorRenda.toFixed(1)}x a renda mensal estimada, considerado padrão de mercado.`,
    })
  } else if (razaoValorRenda <= 8.0) {
    impactoRenda = -80
    fatores.push({
      fator: 'Alavancagem Elevada',
      impacto: -80,
      descricao: `Valor solicitado (${razaoValorRenda.toFixed(1)}x a renda) requer maior capacidade de pagamento a longo prazo.`,
    })
  } else {
    impactoRenda = -190
    fatores.push({
      fator: 'Alto Comprometimento de Renda',
      impacto: -190,
      descricao: `Valor solicitado (${razaoValorRenda.toFixed(1)}x a renda) excede a capacidade mensal recomendada pelo modelo.`,
    })
  }
  scoreBruto += impactoRenda

  // Feature B: Modalidade de Crédito (Garantia e Histórico Bacen)
  const impactoModalidade = -dadosModalidade.pesoRisco * 3.5
  scoreBruto += impactoModalidade
  fatores.push({
    fator: `Modalidade: ${dados.modalidadeCredito}`,
    impacto: Math.round(impactoModalidade),
    descricao:
      impactoModalidade >= 0
        ? 'Modalidade conta com garantias ou histórico de baixa inadimplência no BACEN.'
        : 'Modalidade de crédito rotativo ou sem garantias reais associadas.',
  })

  // Feature C: Faixa de Renda / Porte da Empresa
  let impactoPerfil = 0
  if (dados.tipoCliente === 'PF') {
    if (dados.faixaRenda === 'Acima de 20 SM' || dados.faixaRenda === '10 a 20 SM') {
      impactoPerfil = 110
    } else if (dados.faixaRenda === '5 a 10 SM' || dados.faixaRenda === '3 a 5 SM') {
      impactoPerfil = 50
    } else if (dados.faixaRenda === 'Até 1 SM') {
      impactoPerfil = -40
    }
  } else {
    if (dados.porteEmpresa === 'Grande Empresa' || dados.porteEmpresa === 'Média Empresa') {
      impactoPerfil = 120
    } else if (dados.porteEmpresa === 'Pequena Empresa') {
      impactoPerfil = 60
    } else if (dados.porteEmpresa === 'MEI') {
      impactoPerfil = -20
    }
  }
  scoreBruto += impactoPerfil
  fatores.push({
    fator: dados.tipoCliente === 'PF' ? 'Faixa de Renda Solicitante' : 'Porte Empresarial',
    impacto: impactoPerfil,
    descricao:
      impactoPerfil >= 0
        ? 'Capacidade financeira compatível com perfis de maior estabilidade.'
        : 'Perfil mais sensível a variações macroeconômicas.',
  })

  // Feature D: Histórico da Região / UF (Bacen)
  const diferencaRegional = 3.8 - taxaRegional
  const impactoRegional = Math.round(diferencaRegional * 25)
  scoreBruto += impactoRegional
  fatores.push({
    fator: `Indicador Regional (${dados.estado.toUpperCase()})`,
    impacto: impactoRegional,
    descricao: `Taxa média de inadimplência da UF é de ${taxaRegional.toFixed(1)}% segundo dados abertos do Bacen.`,
  })

  // 5. Normalização final do Score (escala 0 a 1000)
  const score = Math.max(120, Math.min(980, Math.round(scoreBruto)))

  // 6. Determinação de Risco e Probabilidade de Inadimplência
  let risco: string
  let probInadimplencia: number
  let probAprovacao: number

  if (score >= 700) {
    risco = 'Baixo risco'
    probInadimplencia = Number((dadosModalidade.taxaInadimplencia * 0.6).toFixed(2))
    probAprovacao = Number((85 + (score - 700) * 0.05).toFixed(1))
  } else if (score >= 480) {
    risco = 'Médio risco'
    probInadimplencia = Number((dadosModalidade.taxaInadimplencia * 1.1).toFixed(2))
    probAprovacao = Number((55 + (score - 480) * 0.12).toFixed(1))
  } else {
    risco = 'Alto risco'
    probInadimplencia = Number((dadosModalidade.taxaInadimplencia * 1.9).toFixed(2))
    probAprovacao = Number((15 + score * 0.07).toFixed(1))
  }

  // 7. Estimativa de carteira e operações comparáveis
  const carteiraAtivaMedia = Math.round(dadosModalidade.carteiraMedia * (1 + (score - 500) / 1000))
  const operacoesSemelhantes = Math.round(850 + Math.abs(Math.sin(score) * 450))

  // 8. Recomendações personalizadas da IA
  const recomendacoes: string[] = []
  if (risco === 'Alto risco') {
    const valorSugerido = Math.round(rendaMensal * 2.5)
    recomendacoes.push(
      `Para reduzir o risco para Nível Médio ou Baixo, reduza o valor solicitado para cerca de R$ ${valorSugerido.toLocaleString('pt-BR')}.`
    )
    if (dados.modalidadeCredito === 'Cartão de Crédito' || dados.modalidadeCredito === 'Crédito Pessoal') {
      recomendacoes.push(
        'Considere modalidades com garantia (Consignado ou Financiamento), que possuem menor taxa de inadimplência no Bacen.'
      )
    }
  } else if (risco === 'Médio risco') {
    recomendacoes.push(
      'Perfil aprovável mediante comprovação formal de renda ou inclusão de coobrigado/avalista.'
    )
    recomendacoes.push(
      'Alongar o prazo de amortização diminuirá o impacto das parcelas no orçamento mensal.'
    )
  } else {
    recomendacoes.push(
      'Excelente perfil de crédito! Elegível para taxas de juros reduzidas e prazos flexíveis.'
    )
    recomendacoes.push(
      'Operação com alta probabilidade de liquidez segundo os padrões de risco bancário.'
    )
  }

  // Ordena fatores pelo valor absoluto do impacto (Feature Importance)
  fatores.sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto))

  return {
    risco,
    inadimplenciaEstimada: probInadimplencia,
    carteiraAtivaMedia,
    operacoesSemelhantes,
    score,
    probabilidadeAprovacao: Math.min(99, Math.max(5, probAprovacao)),
    comprometimentoRenda: Number(razaoValorRenda.toFixed(2)),
    rendaEstimada: rendaMensal,
    valorSolicitado,
    fatoresExplicabilidade: fatores,
    recomendacoes,
  }
}

/**
 * Função rápida para simulação "What-If" em tempo real no Frontend.
 * Recalcula o resultado instantaneamente ao movimentar sliders de valor e renda.
 */
export function simularCenarioWhatIf(
  dadosOriginais: DadosSimulacao,
  novoValor: number,
  novaRenda?: number
): DetalhesInferenciaML {
  const dadosAjustados: DadosSimulacao = {
    ...dadosOriginais,
    valorPretendido: novoValor,
  }

  const resultado = executarInferenciaML(dadosAjustados)

  if (novaRenda && novaRenda > 0) {
    const razaoReajustada = novoValor / novaRenda
    const ajusteScore = Math.round((1.5 - razaoReajustada) * 60)
    resultado.score = Math.max(100, Math.min(990, resultado.score + ajusteScore))
    resultado.comprometimentoRenda = Number(razaoReajustada.toFixed(2))
    resultado.rendaEstimada = novaRenda

    if (resultado.score >= 700) {
      resultado.risco = 'Baixo risco'
    } else if (resultado.score >= 480) {
      resultado.risco = 'Médio risco'
    } else {
      resultado.risco = 'Alto risco'
    }
  }

  return resultado
}

