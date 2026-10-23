import type { ResultadoCredito as ResultadoCreditoType } from '../../types/credito'

interface ResultadoCreditoProps {
  resultado: ResultadoCreditoType
}

function ResultadoCredito({ resultado }: ResultadoCreditoProps) {
  return (
    <section className="card resultado">
      <h2>Resultado da análise</h2>

      <div className="resultado-grid">
        <div className="resultado-item">
          <strong>Cliente</strong>
          <span>{resultado.nome}</span>
        </div>

        <div className="resultado-item">
          <strong>Profissão</strong>
          <span>{resultado.profissao}</span>
        </div>

        <div className="resultado-item">
          <strong>Renda</strong>
          <span>R$ {resultado.renda}</span>
        </div>

        <div className="resultado-item">
          <strong>Setor</strong>
          <span>{resultado.setor}</span>
        </div>

        <div className="resultado-item">
          <strong>Prazo</strong>
          <span>{resultado.prazo} meses</span>
        </div>

        <div className="resultado-item">
          <strong>Estado</strong>
          <span>{resultado.estado}</span>
        </div>

        <div className="resultado-item">
          <strong>Taxa média</strong>
          <span>{resultado.taxa_media}%</span>
        </div>

        <div className="resultado-item">
          <strong>Taxa do cliente</strong>
          <span>{resultado.taxa_cliente}%</span>
        </div>

        <div className="resultado-item">
          <strong>Classificação de risco</strong>
          <span>{resultado.risco}</span>
        </div>

        <div className="resultado-item">
          <strong>Perfil</strong>
          <span>{resultado.perfil}</span>
        </div>
      </div>
    </section>
  )
}

export default ResultadoCredito