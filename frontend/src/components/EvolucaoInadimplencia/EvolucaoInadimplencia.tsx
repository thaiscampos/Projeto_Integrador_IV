
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  EvolucaoInadimplenciaItem,
} from '../../types/dashboard'

interface EvolucaoInadimplenciaProps {
  dados: EvolucaoInadimplenciaItem[]
  modoDemonstracao?: boolean
}

const formatadorPercentual = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatarPeriodo(periodo: string) {
  const correspondencia = /^(\d{4})-(\d{2})$/.exec(periodo)

  if (!correspondencia) {
    return periodo
  }

  // Formato compacto para melhorar a leitura no celular.
  return `${correspondencia[2]}/${correspondencia[1].slice(2)}`
}

function EvolucaoInadimplencia({
  dados,
  modoDemonstracao = false,
}: EvolucaoInadimplenciaProps) {
  const dadosGrafico = dados
    .filter(
      (item) =>
        Number.isFinite(item.taxa_inadimplencia) &&
        item.taxa_inadimplencia >= 0 &&
        item.taxa_inadimplencia <= 100
    )
    .map((item) => ({
      ...item,
      periodoFormatado: formatarPeriodo(item.periodo),
    }))

  const taxas = dadosGrafico.map(
    (item) => item.taxa_inadimplencia
  )

  const menorTaxa = taxas.length > 0
    ? Math.min(...taxas)
    : 0

  const maiorTaxa = taxas.length > 0
    ? Math.max(...taxas)
    : 0

  // Acrescenta uma margem à escala sem modificar os dados.
  const margemEscala = Math.max(
    (maiorTaxa - menorTaxa) * 0.25,
    0.2
  )

  const minimoEscala = Math.max(
    0,
    Math.floor((menorTaxa - margemEscala) * 10) / 10
  )

  const maximoEscala = Math.min(
    100,
    Math.ceil((maiorTaxa + margemEscala) * 10) / 10
  )

  const limiteSuperior = Math.max(
    maximoEscala,
    minimoEscala + 0.1
  )

  return (
    <section className="card evolucao-card">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-sobretitulo">
            INDICADORES HISTÓRICOS
          </span>

          <h2>Evolução da Inadimplência</h2>

          <p>
            Acompanhe a variação da taxa de
            inadimplência ao longo dos períodos.
          </p>
        </div>

        {modoDemonstracao && (
          <span className="grafico-badge-demo">
            Dados fictícios
          </span>
        )}
      </div>

      {dadosGrafico.length === 0 ? (
        <div className="grafico-sem-dados">
          Não há dados históricos disponíveis
          para apresentar este gráfico.
        </div>
      ) : (
        <div
          className="grafico-container"
          role="img"
          aria-label="Gráfico de linhas com evolução da taxa de inadimplência por período"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dadosGrafico}
              margin={{
                top: 20,
                right: 12,
                left: 0,
                bottom: 12,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="periodoFormatado"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                interval={0}
                minTickGap={2}
              />

              <YAxis
                domain={[minimoEscala, limiteSuperior]}
                allowDataOverflow={false}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(valor: number) =>
                  `${formatadorPercentual.format(valor)}%`
                }
                width={66}
              />

              <Tooltip
                cursor={{
                  stroke: '#94a3b8',
                  strokeDasharray: '4 4',
                }}
                formatter={(valor) =>
                  `${formatadorPercentual.format(
                    Number(valor)
                  )}%`
                }
                labelFormatter={(valor) =>
                  `Período: ${String(valor)}`
                }
              />

              <Line
                type="monotone"
                dataKey="taxa_inadimplencia"
                name="Inadimplência"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: '#ffffff',
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grafico-rodape">
        <span>
          Taxa de inadimplência por período (%).
        </span>

        <small>
          O eixo vertical utiliza escala ajustada
          aos valores para facilitar a visualização
          das variações.
        </small>

        {modoDemonstracao && (
          <small>
            Valores fictícios, sem relação com
            indicadores reais do Banco Central.
          </small>
        )}
      </div>
    </section>
  )
}

export default EvolucaoInadimplencia
