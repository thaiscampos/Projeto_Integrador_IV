
import { useState } from 'react'
import type { FormEvent } from 'react'

interface PessoaFisicaProps {
  onContinuar: (
    profissao: string,
    faixaRenda: string
  ) => void

  onVoltar?: () => void

  profissaoInicial?: string
  faixaRendaInicial?: string
}

const faixasRenda = [
  'Até 1 SM',
  '1 a 2 SM',
  '2 a 3 SM',
  '3 a 5 SM',
  '5 a 10 SM',
  '10 a 20 SM',
  'Acima de 20 SM',
]

function PessoaFisica({
  onContinuar,
  onVoltar,
  profissaoInicial = '',
  faixaRendaInicial = '',
}: PessoaFisicaProps) {
  const [profissao, setProfissao] =
    useState(profissaoInicial)

  const [faixaRenda, setFaixaRenda] =
    useState(faixaRendaInicial)

  const formularioValido =
    profissao.trim().length > 0 &&
    faixaRenda.length > 0

  function handleContinuar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!formularioValido) {
      return
    }

    onContinuar(
      profissao.trim(),
      faixaRenda
    )
  }

  return (
    <section className="card pessoa-fisica-card">
      <div className="pessoa-fisica-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 2 DE 6
        </span>

        <h2>Dados da Pessoa Física</h2>

        <p>
          Informe sua ocupação profissional e
          selecione a faixa de renda mensal.
        </p>
      </div>

      <form onSubmit={handleContinuar}>
        <div className="form-group">
          <label htmlFor="profissao">
            Profissão ou ocupação *
          </label>

          <input
            id="profissao"
            name="profissao"
            type="text"
            value={profissao}
            onChange={(event) =>
              setProfissao(event.target.value)
            }
            placeholder="Ex.: Analista de Sistemas"
            autoComplete="organization-title"
            required
          />
        </div>

        <fieldset className="renda-fieldset">
          <legend>
            Faixa de renda mensal *
          </legend>

          <p className="renda-descricao">
            Selecione uma das opções abaixo.
            SM significa salário mínimo.
          </p>

          <div className="renda-grid">
            {faixasRenda.map((faixa) => (
              <label
                key={faixa}
                className={`renda-opcao ${
                  faixaRenda === faixa
                    ? 'renda-opcao-selecionada'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="faixaRenda"
                  value={faixa}
                  checked={faixaRenda === faixa}
                  onChange={() =>
                    setFaixaRenda(faixa)
                  }
                  required
                />

                <span className="renda-opcao-texto">
                  {faixa}
                </span>

                <span
                  className="renda-indicador"
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </fieldset>

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

export default PessoaFisica
