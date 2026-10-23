
import { useEffect, useRef, useState } from 'react'

interface DiagnosticoProps {
  onConcluir: () => void
}

const etapasDiagnostico = [
  'Engenharia de atributos: estruturando renda, setor e operação',
  'Normalização dos dados com séries históricas do Banco Central',
  'Inferência do modelo de Machine Learning (Classificação de Risco)',
  'Cálculo do Score de Crédito e estimativa de inadimplência',
  'Geração dos fatores de explicabilidade (XAI) e recomendações',
]

const DURACAO_INTERVALO = 500
const INCREMENTO_PROGRESSO = 10

function Diagnostico({
  onConcluir,
}: DiagnosticoProps) {
  const [progresso, setProgresso] = useState(0)

  const conclusaoExecutada = useRef(false)
  const onConcluirRef = useRef(onConcluir)

  useEffect(() => {
    onConcluirRef.current = onConcluir
  }, [onConcluir])

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setProgresso((progressoAtual) =>
        Math.min(
          progressoAtual + INCREMENTO_PROGRESSO,
          100
        )
      )
    }, DURACAO_INTERVALO)

    return () => window.clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (
      progresso >= 100 &&
      !conclusaoExecutada.current
    ) {
      conclusaoExecutada.current = true
      onConcluirRef.current()
    }
  }, [progresso])

  const etapaAtual = Math.min(
    Math.floor(progresso / 20),
    etapasDiagnostico.length - 1
  )

  return (
    <section
      className="card diagnostico-card"
      aria-busy={progresso < 100}
    >
      <div className="diagnostico-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 5 DE 6
        </span>

        <h2>Processando análise com Machine Learning</h2>

        <p>
          Aguarde enquanto os modelos preditivos analisam o risco
          e calculam os indicadores com base em dados do Banco Central.
        </p>
      </div>

      <div className="diagnostico-progresso">
        <div className="diagnostico-progresso-topo">
          <span>Preparação da solicitação</span>

          <strong>{progresso}%</strong>
        </div>

        <div
          className="diagnostico-barra"
          role="progressbar"
          aria-label="Progresso da preparação"
          aria-valuenow={progresso}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="diagnostico-barra-preenchimento"
            style={{
              width: `${progresso}%`,
            }}
          />
        </div>
      </div>

      <ol className="diagnostico-etapas">
        {etapasDiagnostico.map((etapa, index) => {
          const concluida = index < etapaAtual
          const ativa =
            index === etapaAtual && progresso < 100

          return (
            <li
              key={etapa}
              className={[
                'diagnostico-etapa',
                concluida || progresso === 100
                  ? 'diagnostico-etapa-concluida'
                  : '',
                ativa
                  ? 'diagnostico-etapa-ativa'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className="diagnostico-etapa-indicador"
                aria-hidden="true"
              >
                {concluida || progresso === 100
                  ? '✓'
                  : index + 1}
              </span>

              <span>{etapa}</span>
            </li>
          )
        })}
      </ol>

      <p className="diagnostico-aviso">
        Processamento analítico executado com base nos modelos de inteligência
        artificial e séries abertas do Sistema Financeiro Nacional (Bacen).
      </p>
    </section>
  )
}

export default Diagnostico
