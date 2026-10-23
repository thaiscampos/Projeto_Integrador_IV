
import { useState } from 'react'
import type { FormEvent } from 'react'

interface ModalidadeCreditoProps {
  onContinuar: (
    modalidadeCredito: string,
    valorPretendido?: number
  ) => void

  onVoltar?: () => void

  modalidadeInicial?: string
  valorPretendidoInicial?: number
}

const modalidadesCredito = [
  'Capital de Giro',
  'Crédito Pessoal',
  'Consignado',
  'Financiamento',
  'Imobiliário',
  'Rural',
  'Cartão de Crédito',
]

function ModalidadeCredito({
  onContinuar,
  onVoltar,
  modalidadeInicial = '',
  valorPretendidoInicial,
}: ModalidadeCreditoProps) {
  const [modalidadeCredito, setModalidadeCredito] =
    useState(modalidadeInicial)

  const [valorPretendido, setValorPretendido] =
    useState(
      valorPretendidoInicial !== undefined
        ? String(valorPretendidoInicial)
        : ''
    )

  const valorInformado =
    valorPretendido.trim() !== ''

  const valorNumerico = valorInformado
    ? Number(valorPretendido)
    : undefined

  const valorValido =
    !valorInformado ||
    (
      valorNumerico !== undefined &&
      Number.isFinite(valorNumerico) &&
      valorNumerico > 0
    )

  const formularioValido =
    modalidadeCredito.length > 0 &&
    valorValido

  function handleContinuar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!formularioValido) {
      return
    }

    onContinuar(
      modalidadeCredito,
      valorNumerico
    )
  }

  return (
    <section className="card modalidade-card">
      <div className="modalidade-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 3 DE 6
        </span>

        <h2>Modalidade de Crédito</h2>

        <p>
          Selecione o tipo de operação que deseja
          analisar e, se necessário, informe
          o valor pretendido.
        </p>
      </div>

      <form onSubmit={handleContinuar}>
        <fieldset className="modalidade-fieldset">
          <legend>
            Qual modalidade de crédito deseja analisar? *
          </legend>

          <p className="modalidade-descricao">
            Selecione uma das opções abaixo.
          </p>

          <div className="modalidade-grid">
            {modalidadesCredito.map((modalidade) => (
              <label
                key={modalidade}
                className={`modalidade-opcao ${
                  modalidadeCredito === modalidade
                    ? 'modalidade-opcao-selecionada'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="modalidadeCredito"
                  value={modalidade}
                  checked={
                    modalidadeCredito === modalidade
                  }
                  onChange={() =>
                    setModalidadeCredito(modalidade)
                  }
                  required
                />

                <span className="modalidade-opcao-texto">
                  {modalidade}
                </span>

                <span
                  className="modalidade-indicador"
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-group modalidade-valor">
          <label htmlFor="valorPretendido">
            Valor pretendido (opcional)
          </label>

          <input
            id="valorPretendido"
            name="valorPretendido"
            type="number"
            min="0.01"
            step="0.01"
            value={valorPretendido}
            onChange={(event) =>
              setValorPretendido(event.target.value)
            }
            placeholder="Ex.: 15000.00"
            aria-describedby="valorPretendidoAjuda"
          />

          <small id="valorPretendidoAjuda">
            Informe o valor em reais, caso deseje
            especificar o montante da operação.
          </small>
        </div>

        <p className="form-observacao">
          * Campos obrigatórios.
        </p>

        <div className="form-actions form-actions-navegacao">
          {onVoltar && (
            <button
              type="button"
              className="botao-voltar"
              onClick={onVoltar}
            >
              ← Voltar
            </button>
          )}

          <button
            type="submit"
            className="botao-continuar"
            disabled={!formularioValido}
          >
            Próxima etapa →
          </button>
        </div>
      </form>
    </section>
  )
}

export default ModalidadeCredito
