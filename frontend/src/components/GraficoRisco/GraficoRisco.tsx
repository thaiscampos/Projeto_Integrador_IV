
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface GraficoRiscoProps {
  baixoRisco: number
  medioRisco: number
  altoRisco: number
  modoDemonstracao?: boolean
}

const formatadorNumero = new Intl.NumberFormat('pt-BR')

function GraficoRisco({
  baixoRisco,
  medioRisco,
  altoRisco,
  modoDemonstracao = false,
}: GraficoRiscoProps) {
  const dados = [
    {
      categoria: 'Baixo risco',
      quantidade: baixoRisco,
      cor: '#16a34a',
    },
    {
      categoria: 'Médio risco',
      quantidade: medioRisco,
      cor: '#d97706',
    },
    {
      categoria: 'Alto risco',
      quantidade: altoRisco,
      cor: '#dc2626',
    },
  ]

  const totalClassificado =
    baixoRisco + medioRisco + altoRisco

  const possuiDados = totalClassificado > 0

  return (
    <section
      className="card grafico-card"
      aria-labelledby="grafico-risco-titulo"
    >
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-sobretitulo">
            DISTRIBUIÇÃO POR CATEGORIA
          </span>

          <h2 id="grafico-risco-titulo">
            Distribuição de risco
          </h2>

          <p>
            Quantidade de análises em cada
            categoria de risco de crédito.
          </p>
        </div>

        {modoDemonstracao && (
          <span className="grafico-badge-demo">
            Dados fictícios
          </span>
        )}
      </div>

      <div className="grafico-resumo">
        {dados.map((item) => (
          <div
            className="grafico-resumo-item"
            key={item.categoria}
          >
            <span
              className="grafico-resumo-cor"
              style={{ backgroundColor: item.cor }}
              aria-hidden="true"
            />

            <div>
              <span className="grafico-resumo-label">
                {item.categoria}
              </span>

              <strong>
                {formatadorNumero.format(
                  item.quantidade
                )}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {possuiDados ? (
        <div
          className="grafico-container"
          role="img"
          aria-label={
            `Distribuição de risco: ` +
            `${baixoRisco} análises de baixo risco, ` +
            `${medioRisco} de médio risco e ` +
            `${altoRisco} de alto risco.`
          }
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={dados}
              margin={{
                top: 15,
                right: 15,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="categoria"
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
                width={40}
              />

              <Tooltip
                formatter={(valor) => [
                  formatadorNumero.format(
                    Number(valor ?? 0)
                  ),
                  'Análises',
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              />

              <Bar
                dataKey="quantidade"
                name="Análises"
                maxBarSize={90}
                radius={[6, 6, 0, 0]}
              >
                {dados.map((item) => (
                  <Cell
                    key={item.categoria}
                    fill={item.cor}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className="grafico-sem-dados"
          role="status"
        >
          Não há análises classificadas para
          apresentar neste gráfico.
        </div>
      )}

      <div className="grafico-rodape">
        <span>
          Total de análises classificadas:
          <strong>
            {' '}
            {formatadorNumero.format(
              totalClassificado
            )}
          </strong>
        </span>

        {modoDemonstracao && (
          <small>
            Visualização ilustrativa com dados
            fictícios, sem relação com operações reais.
          </small>
        )}
      </div>
    </section>
  )
}

export default GraficoRisco
