
interface RecomendacoesCreditoProps {
  modoDemonstracao?: boolean
}

const recomendacoes = [
  {
    titulo: 'Monitorar inadimplência',
    descricao:
      'Acompanhar a evolução das taxas de inadimplência ' +
      'ao longo do tempo para identificar alterações ' +
      'nos indicadores de crédito.',
  },
  {
    titulo: 'Comparar perfis',
    descricao:
      'Analisar diferenças entre perfis de clientes, ' +
      'setores econômicos e modalidades de crédito, ' +
      'considerando informações disponíveis.',
  },
  {
    titulo: 'Avaliar garantias',
    descricao:
      'Considerar o papel das garantias nas operações ' +
      'de crédito, observando critérios e políticas ' +
      'aplicáveis à modalidade analisada.',
  },
]

function RecomendacoesCredito({
  modoDemonstracao = false,
}: RecomendacoesCreditoProps) {
  return (
    <section className="card recomendacoes-card">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-sobretitulo">
            ORIENTAÇÕES GERAIS
          </span>

          <h2>Recomendações de Crédito</h2>

          <p>
            Pontos de atenção para interpretação
            dos indicadores e acompanhamento
            das operações de crédito.
          </p>
        </div>

        {modoDemonstracao && (
          <span className="grafico-badge-demo">
            Modo demonstração
          </span>
        )}
      </div>

      <div className="recomendacoes-grid">
        {recomendacoes.map((recomendacao) => (
          <article
            className="recomendacao-item"
            key={recomendacao.titulo}
          >
            <h3>{recomendacao.titulo}</h3>

            <p>{recomendacao.descricao}</p>
          </article>
        ))}
      </div>

      <div className="grafico-rodape">
        <small>
          Orientações informativas gerais.
          Não representam recomendação individual
          de concessão de crédito nem resultado
          de um modelo preditivo.
        </small>
      </div>
    </section>
  )
}

export default RecomendacoesCredito
