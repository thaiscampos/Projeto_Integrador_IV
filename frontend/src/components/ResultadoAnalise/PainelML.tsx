import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts'
import type { DadosSimulacao } from '../../types/simulacao'
import {
  simularCenarioWhatIf,
  type DetalhesInferenciaML,
} from '../../services/mlCreditoService'

interface PainelMLProps {
  dadosIniciais: DadosSimulacao
  resultadoML: DetalhesInferenciaML
}

export default function PainelML({
  dadosIniciais,
  resultadoML,
}: PainelMLProps) {
  // Estados para simulação "What-If" em tempo real
  const [valorSimulado, setValorSimulado] = useState<number>(
    dadosIniciais.valorPretendido ?? 15000
  )
  const [rendaSimulada, setRendaSimulada] = useState<number>(
    resultadoML.rendaEstimada ?? 4000
  )

  // Recalculo em tempo real via Client-Side ML
  const cenarioAtual = useMemo(() => {
    return simularCenarioWhatIf(dadosIniciais, valorSimulado, rendaSimulada)
  }, [dadosIniciais, valorSimulado, rendaSimulada])

  // Cor do Score de acordo com a faixa
  const corScore =
    cenarioAtual.score >= 700
      ? '#16a34a' // Verde
      : cenarioAtual.score >= 480
        ? '#d97706' // Âmbar / Amarelo
        : '#dc2626' // Vermelho

  const percentualScore = Math.min(100, Math.max(0, (cenarioAtual.score / 1000) * 100))

  // Dados para o gráfico de explicabilidade (XAI)
  const dadosGraficoXAI = useMemo(() => {
    return cenarioAtual.fatoresExplicabilidade.map((item) => ({
      fator: item.fator.length > 22 ? `${item.fator.substring(0, 20)}...` : item.fator,
      fatorCompleto: item.fator,
      impacto: item.impacto,
      descricao: item.descricao,
    }))
  }, [cenarioAtual.fatoresExplicabilidade])

  return (
    <div className="painel-ml-container">
      {/* =========================================
          SEÇÃO 1: SCORE PREDITIVO E PROBABILIDADE
          ========================================= */}
      <div className="ml-card ml-score-card">
        <div className="ml-card-header">
          <div>
            <span className="badge-ml">Modelo Preditivo BACEN</span>
            <h3>Score de Risco de Crédito</h3>
          </div>
          <span className="ml-fonte-tag">
            {resultadoML.fonteInferencia === 'api_backend'
              ? 'API Bacen / Backend'
              : 'Machine Learning Ativo'}
          </span>
        </div>

        <div className="ml-score-display">
          <div className="ml-score-circulo" style={{ borderColor: corScore }}>
            <span className="ml-score-numero" style={{ color: corScore }}>
              {cenarioAtual.score}
            </span>
            <span className="ml-score-max">/ 1000</span>
          </div>

          <div className="ml-score-info">
            <div className="ml-score-status">
              <span className="ml-status-bolinha" style={{ backgroundColor: corScore }} />
              <strong>{cenarioAtual.risco}</strong>
            </div>

            <p className="ml-score-desc">
              Probabilidade de aprovação estimada em{' '}
              <strong>{cenarioAtual.probabilidadeAprovacao}%</strong>.
            </p>

            <div className="ml-barra-termometro">
              <div
                className="ml-barra-preenchimento"
                style={{
                  width: `${percentualScore}%`,
                  backgroundColor: corScore,
                }}
              />
            </div>
            <div className="ml-termometro-legendas">
              <span>0 (Alto Risco)</span>
              <span>500 (Médio)</span>
              <span>1000 (Excelente)</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SEÇÃO 2: SIMULADOR WHAT-IF INTERATIVO
          ========================================= */}
      <div className="ml-card ml-what-if-card">
        <div className="ml-card-header">
          <div>
            <span className="badge-ml-purple">Simulação em Tempo Real</span>
            <h3>Análise de Cenários ("What-If")</h3>
          </div>
        </div>

        <p className="ml-what-if-intro">
          Ajuste os valores abaixo para observar como o algoritmo de Machine Learning reage
          à mudança do valor pretendido e da capacidade financeira:
        </p>

        <div className="ml-sliders-grid">
          <div className="ml-slider-item">
            <div className="ml-slider-topo">
              <label htmlFor="slider-valor">Valor Solicitado:</label>
              <strong>
                {valorSimulado.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
            </div>
            <input
              id="slider-valor"
              type="range"
              min={1000}
              max={Math.max(valorSimulado * 2.5, 80000)}
              step={1000}
              value={valorSimulado}
              onChange={(e) => setValorSimulado(Number(e.target.value))}
              className="ml-range-input"
            />
            <div className="ml-range-limites">
              <span>R$ 1.000</span>
              <span>R$ {(Math.max(valorSimulado * 2.5, 80000)).toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="ml-slider-item">
            <div className="ml-slider-topo">
              <label htmlFor="slider-renda">
                {dadosIniciais.tipoCliente === 'PJ' ? 'Faturamento Mensal:' : 'Renda Mensal:'}
              </label>
              <strong>
                {rendaSimulada.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
            </div>
            <input
              id="slider-renda"
              type="range"
              min={1500}
              max={Math.max(rendaSimulada * 3, 50000)}
              step={500}
              value={rendaSimulada}
              onChange={(e) => setRendaSimulada(Number(e.target.value))}
              className="ml-range-input"
            />
            <div className="ml-range-limites">
              <span>R$ 1.500</span>
              <span>R$ {(Math.max(rendaSimulada * 3, 50000)).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="ml-what-if-resumo">
          <span>Comprometimento apurado:</span>
          <strong>{cenarioAtual.comprometimentoRenda}x a renda mensal</strong>
          <span className="ml-tag-feedback" style={{ color: corScore, borderColor: corScore }}>
            {cenarioAtual.risco} ({cenarioAtual.score} pts)
          </span>
        </div>
      </div>

      {/* =========================================
          SEÇÃO 3: EXPLICABILIDADE DE IA (XAI)
          ========================================= */}
      <div className="ml-card ml-xai-card">
        <div className="ml-card-header">
          <div>
            <span className="badge-ml-blue">Explicabilidade (XAI)</span>
            <h3>Fatores Determinantes da Decisão</h3>
          </div>
        </div>

        <p className="ml-xai-intro">
          Impacto de cada atributo no cálculo do Score (pontos adicionados ou deduzidos pelo
          modelo):
        </p>

        <div className="ml-grafico-container" style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGraficoXAI}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" domain={[-220, 220]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                type="category"
                dataKey="fator"
                width={130}
                tick={{ fontSize: 11, fill: '#334155' }}
              />
              <Tooltip
                formatter={(value: any, _name: any, item: any) => [
                  `${Number(value) > 0 ? '+' : ''}${value} pontos`,
                  item.payload.descricao,
                ]}
              />
              <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Bar dataKey="impacto" radius={[4, 4, 4, 4]}>
                {dadosGraficoXAI.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.impacto >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ml-lista-explicabilidade">
          {cenarioAtual.fatoresExplicabilidade.map((fator, index) => (
            <div key={index} className="ml-fator-item">
              <div className="ml-fator-topo">
                <span className="ml-fator-nome">{fator.fator}</span>
                <span
                  className={`ml-fator-pontos ${
                    fator.impacto >= 0 ? 'pontos-positivos' : 'pontos-negativos'
                  }`}
                >
                  {fator.impacto >= 0 ? `+${fator.impacto}` : fator.impacto} pts
                </span>
              </div>
              <p className="ml-fator-desc">{fator.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SEÇÃO 4: RECOMENDAÇÕES DA IA
          ========================================= */}
      {cenarioAtual.recomendacoes && cenarioAtual.recomendacoes.length > 0 && (
        <div className="ml-card ml-recomendacoes-card">
          <div className="ml-card-header">
            <div>
              <span className="badge-ml-amber">Orientações do Modelo</span>
              <h3>Recomendações da Inteligência Artificial</h3>
            </div>
          </div>
          <ul className="ml-recomendacoes-lista">
            {cenarioAtual.recomendacoes.map((rec, i) => (
              <li key={i} className="ml-recomendacao-item">
                <span className="ml-rec-icone">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

