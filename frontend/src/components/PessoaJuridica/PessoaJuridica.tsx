
import { useState } from 'react'
import type { FormEvent } from 'react'

interface PessoaJuridicaProps {
  onContinuar: (
    porteEmpresa: string,
    setorEconomico: string,
    cnae: string
  ) => void

  onVoltar?: () => void

  porteEmpresaInicial?: string
  setorEconomicoInicial?: string
  cnaeInicial?: string
}

const portesEmpresa = [
  'MEI',
  'Microempresa',
  'Pequena Empresa',
  'Média Empresa',
  'Grande Empresa',
]

function PessoaJuridica({
  onContinuar,
  onVoltar,
  porteEmpresaInicial = '',
  setorEconomicoInicial = '',
  cnaeInicial = '',
}: PessoaJuridicaProps) {
  const [porteEmpresa, setPorteEmpresa] =
    useState(porteEmpresaInicial)

  const [setorEconomico, setSetorEconomico] =
    useState(setorEconomicoInicial)

  const [cnae, setCnae] =
    useState(cnaeInicial)

  const formularioValido =
    porteEmpresa.length > 0 &&
    setorEconomico.trim().length > 0

  function handleContinuar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!formularioValido) {
      return
    }

    onContinuar(
      porteEmpresa,
      setorEconomico.trim(),
      cnae.trim()
    )
  }

  return (
    <section className="card pessoa-juridica-card">
      <div className="pessoa-juridica-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 2 DE 6
        </span>

        <h2>Dados da Pessoa Jurídica</h2>

        <p>
          Informe o porte da empresa, o setor
          econômico e, se disponível, o CNAE.
        </p>
      </div>

      <form onSubmit={handleContinuar}>
        <fieldset className="porte-fieldset">
          <legend>
            Porte da empresa *
          </legend>

          <p className="porte-descricao">
            Selecione a classificação correspondente
            ao porte da sua empresa.
          </p>

          <div className="porte-grid">
            {portesEmpresa.map((porte) => (
              <label
                key={porte}
                className={`porte-opcao ${
                  porteEmpresa === porte
                    ? 'porte-opcao-selecionada'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="porteEmpresa"
                  value={porte}
                  checked={porteEmpresa === porte}
                  onChange={() =>
                    setPorteEmpresa(porte)
                  }
                  required
                />

                <span className="porte-opcao-texto">
                  {porte}
                </span>

                <span
                  className="porte-indicador"
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-grid pessoa-juridica-campos">
          <div className="form-group">
            <label htmlFor="setorEconomico">
              Setor econômico *
            </label>

            <input
              id="setorEconomico"
              name="setorEconomico"
              type="text"
              value={setorEconomico}
              onChange={(event) =>
                setSetorEconomico(event.target.value)
              }
              placeholder="Ex.: Comércio varejista"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cnae">
              CNAE (opcional)
            </label>

            <input
              id="cnae"
              name="cnae"
              type="text"
              value={cnae}
              onChange={(event) =>
                setCnae(event.target.value)
              }
              placeholder="Ex.: 4711-3/02"
              inputMode="numeric"
            />
          </div>
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

export default PessoaJuridica
