
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  DistribuicaoModalidadeItem,
} from '../../types/dashboard'

interface DistribuicaoModalidadeProps {
  dados: DistribuicaoModalidadeItem[]
  modoDemonstracao?: boolean
}

const formatadorNumero = new Intl.NumberFormat('pt-BR')

const formatadorPercentual = new Intl.NumberFormat(
  'pt-BR',
  {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }
)

function abreviarModalidade(nome: string) {
  if (nome === 'Cartão de Crédito') {
    return 'Cartão de Créd.'
  }

  if (nome.length > 18) {
    return `${nome.slice(0, 16)}…`
  }

  return nome
}

function DistribuicaoModalidade({
  dados,
  modoDemonstracao = false,
}: DistribuicaoModalidadeProps) {
  const dadosValidos = dados.filter(
    (item) =>
      item.modalidade.trim().length > 0 &&
      Number.isFinite(item.quantidade) &&
      Number.isInteger(item.quantidade) &&
      item.quantidade >= 0 &&
      Number.isFinite(item.percentual) &&
      item.percentual >= 0 &&
      item.percentual <= 100
  )

  return (
    <section className="card distribuicao-modalidade-card">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-sobretitulo">
            OPERAÇÕES DE CRÉDITO
          </span>

          <h2>Distribuição por Modalidade</h2>

          <p>
            Participação percentual de cada
            modalidade nas operações analisadas.
          </p>
        </div>

        {modoDemonstracao && (
          <span className="grafico-badge-demo">
            Dados fictícios
          </span>
        )}
      </div>

      {dadosValidos.length === 0 ? (
        <div className="grafico-sem-dados">
          Não existem dados disponíveis para
          apresentar a distribuição por modalidade.
        </div>
      ) : (
        <>
          <div
            className="grafico-container"
            role="img"
            aria-label="Gráfico de barras com distribuição percentual por modalidade de crédito"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={dadosValidos}
                layout="vertical"
                barCategoryGap="28%"
                margin={{
                  top: 12,
                  right: 14,
                  left: 0,
                  bottom: 12,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(valor: number) =>
                    `${valor}%`
                  }
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />

                <YAxis
                  type="category"
                  dataKey="modalidade"
                  width={124}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={abreviarModalidade}
                  interval={0}
                />

                <Tooltip
                  cursor={false}
                  formatter={(valor) =>
                    `${formatadorPercentual.format(
                      Number(valor)
                    )}%`
                  }
                  labelFormatter={(valor) =>
                    `Modalidade: ${String(valor)}`
                  }
                  wrapperStyle={{
                    pointerEvents: 'none',
                  }}
                />

                <Bar
                  name="Participação"
                  dataKey="percentual"
                  fill="#2563eb"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={30}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="distribuicao-modalidade-resumo">
            {dadosValidos.map((item) => (
              <div
                className="distribuicao-modalidade-item"
                key={item.modalidade}
              >
                <strong>{item.modalidade}</strong>

                <span>
                  {formatadorPercentual.format(
                    item.percentual
                  )}%
                </span>

                <small>
                  {formatadorNumero.format(
                    item.quantidade
                  )} operações
                </small>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="grafico-rodape">
        <span>
          Distribuição das operações por
          modalidade de crédito.
        </span>

        {modoDemonstracao && (
          <small>
            Valores fictícios utilizados somente
            para demonstração da interface.
          </small>
        )}
      </div>
    </section>
  )
}

export default DistribuicaoModalidade
