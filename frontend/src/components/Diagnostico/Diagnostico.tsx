
import { useEffect, useRef, useState } from 'react'

interface DiagnosticoProps {
  onConcluir: () => void
}

const etapasDiagnostico = [
  'Preparando os dados informados',
  'Organizando o perfil do cliente',
  'Conferindo os dados da operação',
  'Preparando a solicitação de análise',
  'Finalizando o processamento visual',
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

        <h2>Preparando análise de crédito</h2>

        <p>
          Aguarde enquanto organizamos as informações
          fornecidas para a solicitação de análise.
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
        Esta barra representa uma etapa visual de
        preparação. O progresso exibido não mede
        uma consulta real ao Banco Central.
      </p>
    </section>
  )
}

export default Diagnostico
