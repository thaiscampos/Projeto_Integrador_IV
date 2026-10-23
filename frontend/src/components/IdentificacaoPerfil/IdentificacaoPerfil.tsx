
import { useState } from 'react'
import type { DadosSimulacao } from '../../types/simulacao'

interface IdentificacaoPerfilProps {
  onContinuar: (
    tipoCliente: DadosSimulacao['tipoCliente']
  ) => void
}

function IdentificacaoPerfil({
  onContinuar,
}: IdentificacaoPerfilProps) {
  const [tipoCliente, setTipoCliente] =
    useState<DadosSimulacao['tipoCliente'] | ''>('')

  function handleContinuar() {
    if (!tipoCliente) {
      return
    }

    onContinuar(tipoCliente)
  }

  return (
    <section className="card identificacao-card">
      <div className="identificacao-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 1 DE 6
        </span>

        <h2>Identificação do perfil</h2>

        <p>
          Selecione o tipo de cliente para
          personalizar sua análise de crédito.
        </p>
      </div>

      <fieldset className="perfil-fieldset">
        <legend>Tipo de cliente</legend>

        <div className="perfil-grid">
          <label
            className={`perfil-opcao ${
              tipoCliente === 'PF'
                ? 'perfil-opcao-selecionada'
                : ''
            }`}
          >
            <input
              type="radio"
              name="tipoCliente"
              value="PF"
              checked={tipoCliente === 'PF'}
              onChange={() => setTipoCliente('PF')}
            />

            <span className="perfil-icone" aria-hidden="true">
              PF
            </span>

            <span className="perfil-conteudo">
              <strong>Pessoa Física</strong>
              <small>
                Análise de crédito para pessoas físicas
              </small>
            </span>
          </label>

          <label
            className={`perfil-opcao ${
              tipoCliente === 'PJ'
                ? 'perfil-opcao-selecionada'
                : ''
            }`}
          >
            <input
              type="radio"
              name="tipoCliente"
              value="PJ"
              checked={tipoCliente === 'PJ'}
              onChange={() => setTipoCliente('PJ')}
            />

            <span className="perfil-icone" aria-hidden="true">
              PJ
            </span>

            <span className="perfil-conteudo">
              <strong>Pessoa Jurídica</strong>
              <small>
                Análise de crédito para empresas
              </small>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleContinuar}
          disabled={!tipoCliente}
        >
          Continuar →
        </button>
      </div>
    </section>
  )
}

export default IdentificacaoPerfil
