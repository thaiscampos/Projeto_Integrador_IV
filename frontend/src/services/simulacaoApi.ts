
import type { DadosSimulacao } from '../types/simulacao'
import { executarInferenciaML } from './mlCreditoService'

export interface FatorExplicabilidade {
  fator: string
  impacto: number
  descricao: string
}

export interface ResultadoSimulacao {
  risco: string | null
  inadimplenciaEstimada: number | null
  carteiraAtivaMedia: number | null
  operacoesSemelhantes: number | null
  score?: number | null
  probabilidadeAprovacao?: number | null
  fatoresExplicabilidade?: FatorExplicabilidade[]
  recomendacoes?: string[]
  fonteInferencia?: 'api_backend' | 'modelo_ml_local'
}

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

function validarResultado(
  valor: unknown
): valor is ResultadoSimulacao {
  if (
    typeof valor !== 'object' ||
    valor === null ||
    Array.isArray(valor)
  ) {
    return false
  }

  const dados = valor as Record<string, unknown>

  const riscoValido =
    dados.risco === null ||
    typeof dados.risco === 'string'

  const numeroOuNulo = (item: unknown) =>
    item === null ||
    (
      typeof item === 'number' &&
      Number.isFinite(item)
    )

  return (
    riscoValido &&
    numeroOuNulo(dados.inadimplenciaEstimada) &&
    numeroOuNulo(dados.carteiraAtivaMedia) &&
    numeroOuNulo(dados.operacoesSemelhantes)
  )
}

export async function analisarSimulacao(
  dados: DadosSimulacao
): Promise<ResultadoSimulacao> {
  // 1. Tenta consultar a API de backend se disponível
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(`${API_URL}/api/simulacao/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const resultadoApi = (await response.json()) as Record<string, unknown>

      if (validarResultado(resultadoApi)) {
        // Enriquecimento com Machine Learning se o backend retornar apenas métricas parciais
        const mlEnriquecido = executarInferenciaML(dados)

        return {
          risco: (resultadoApi.risco as string) || mlEnriquecido.risco,
          inadimplenciaEstimada:
            (resultadoApi.inadimplenciaEstimada as number) ?? mlEnriquecido.inadimplenciaEstimada,
          carteiraAtivaMedia:
            (resultadoApi.carteiraAtivaMedia as number) ?? mlEnriquecido.carteiraAtivaMedia,
          operacoesSemelhantes:
            (resultadoApi.operacoesSemelhantes as number) ?? mlEnriquecido.operacoesSemelhantes,
          score: (resultadoApi.score as number) ?? mlEnriquecido.score,
          probabilidadeAprovacao:
            (resultadoApi.probabilidadeAprovacao as number) ?? mlEnriquecido.probabilidadeAprovacao,
          fatoresExplicabilidade:
            (resultadoApi.fatoresExplicabilidade as FatorExplicabilidade[]) ??
            mlEnriquecido.fatoresExplicabilidade,
          recomendacoes: (resultadoApi.recomendacoes as string[]) ?? mlEnriquecido.recomendacoes,
          fonteInferencia: 'api_backend',
        }
      }
    }
  } catch {
    // Continua para o fallback de Machine Learning local sem interromper a experiência do usuário
  }

  // 2. Fallback Inteligente: Executa o Modelo de ML diretamente no Frontend (Client-side ML)
  // Baseado nas séries históricas do Banco Central do Brasil
  const resultadoLocal = executarInferenciaML(dados)
  return {
    ...resultadoLocal,
    fonteInferencia: 'modelo_ml_local',
  }
}
