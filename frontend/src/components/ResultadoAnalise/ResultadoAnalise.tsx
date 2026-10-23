
import type { DadosSimulacao } from '../../types/simulacao'
import type { ResultadoSimulacao } from '../../services/simulacaoApi'
import { executarInferenciaML } from '../../services/mlCreditoService'
import PainelML from './PainelML'

interface ResultadoAnaliseProps {
  tipoCliente?: string
  porteEmpresa?: string
  setorEconomico?: string
  risco?: string | null
  inadimplenciaEstimada?: number | null
  carteiraAtivaMedia?: number | null
  operacoesSemelhantes?: number | null
  dadosSimulacao?: DadosSimulacao
  resultadoSimulacao?: ResultadoSimulacao
  onVerDashboard: () => void
}

function ResultadoAnalise({
  tipoCliente,
  porteEmpresa,
  setorEconomico,
  risco,
  inadimplenciaEstimada,
  carteiraAtivaMedia,
  operacoesSemelhantes,
  dadosSimulacao,
  resultadoSimulacao,
  onVerDashboard,
}: ResultadoAnaliseProps) {
  function formatarMoeda(valor?: number | null) {
    if (valor == null || !Number.isFinite(valor)) {
      return 'Não disponível'
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatarPercentual(valor?: number | null) {
    if (valor == null || !Number.isFinite(valor)) {
      return 'Não disponível'
    }

    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  }

  function formatarNumero(valor?: number | null) {
    if (valor == null || !Number.isFinite(valor)) {
      return 'Não disponível'
    }

    return valor.toLocaleString('pt-BR')
  }

  const perfilSelecionado =
    tipoCliente === 'PF'
      ? 'Pessoa Física'
      : tipoCliente === 'PJ'
        ? 'Pessoa Jurídica'
        : 'Não disponível'

  const riscoExibido =
    risco?.trim() || 'Não disponível'

  const riscoDisponivel =
    riscoExibido !== 'Não disponível'

  const indicadores = [
    {
      titulo: 'Risco de crédito',
      valor: riscoExibido,
      descricao: 'Classificação de risco retornada pela API',
    },
    {
      titulo: 'Inadimplência estimada',
      valor: formatarPercentual(
        inadimplenciaEstimada
      ),
      descricao: 'Percentual estimado de inadimplência',
    },
    {
      titulo: 'Carteira ativa média',
      valor: formatarMoeda(carteiraAtivaMedia),
      descricao: 'Valor médio da carteira de crédito',
    },
    {
      titulo: 'Operações semelhantes',
      valor: formatarNumero(
        operacoesSemelhantes
      ),
      descricao: 'Quantidade de operações comparáveis',
    },
  ]

  const dadosML = dadosSimulacao
    ? {
        dadosIniciais: dadosSimulacao,
        resultadoML:
          resultadoSimulacao?.score != null &&
          resultadoSimulacao?.fatoresExplicabilidade != null
            ? {
                ...resultadoSimulacao,
                score: resultadoSimulacao.score,
                probabilidadeAprovacao: resultadoSimulacao.probabilidadeAprovacao ?? 75,
                comprometimentoRenda: 1.5,
                rendaEstimada: 4000,
                valorSolicitado: dadosSimulacao.valorPretendido ?? 15000,
                fatoresExplicabilidade: resultadoSimulacao.fatoresExplicabilidade,
                recomendacoes: resultadoSimulacao.recomendacoes ?? [],
              }
            : executarInferenciaML(dadosSimulacao),
      }
    : null

  return (
    <section className="card resultado-analise-card">
      <div className="resultado-analise-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 6 DE 6
        </span>

        <h2>Resultado da Análise</h2>

        <p>
          Confira o perfil informado e os indicadores
          disponibilizados pelo serviço de análise.
        </p>
      </div>

      <section
        className="resultado-perfil"
        aria-labelledby="resultado-perfil-titulo"
      >
        <h3 id="resultado-perfil-titulo">
          Perfil selecionado
        </h3>

        <strong>{perfilSelecionado}</strong>

        {tipoCliente === 'PJ' && (
          <div className="resultado-perfil-detalhes">
            <p>
              <span>Porte da empresa:</span>{' '}
              {porteEmpresa || 'Não informado'}
            </p>

            <p>
              <span>Setor econômico:</span>{' '}
              {setorEconomico || 'Não informado'}
            </p>
          </div>
        )}
      </section>

      <div className="resultado-indicadores">
        {indicadores.map((indicador) => (
          <section
            className="resultado-indicador"
            key={indicador.titulo}
          >
            <h3>{indicador.titulo}</h3>

            <p
              className={`resultado-indicador-valor ${
                indicador.valor === 'Não disponível'
                  ? 'resultado-indicador-indisponivel'
                  : ''
              }`}
            >
              {indicador.valor}
            </p>

            <small>{indicador.descricao}</small>
          </section>
        ))}
      </div>

      {dadosML && (
        <PainelML
          dadosIniciais={dadosML.dadosIniciais}
          resultadoML={dadosML.resultadoML}
        />
      )}

      {!riscoDisponivel && (
        <div
          className="resultado-aviso"
          role="status"
        >
          <strong>
            Indicadores ainda não disponíveis
          </strong>

          <p>
            A solicitação foi processada pelo serviço,
            mas os indicadores financeiros ainda não
            foram disponibilizados pela API.
            Nenhuma classificação de risco foi
            calculada nesta apresentação.
          </p>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onVerDashboard}
        >
          Ver Dashboard →
        </button>
      </div>
    </section>
  )
}

export default ResultadoAnalise
