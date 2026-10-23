
import { useState } from 'react'
import type { FormEvent } from 'react'

interface LocalidadeProps {
  onAnalisar: (
    estado: string,
    cidade: string,
    dataBase: string
  ) => void

  onVoltar?: () => void

  estadoInicial?: string
  cidadeInicial?: string
  dataBaseInicial?: string
}

function Localidade({
  onAnalisar,
  onVoltar,
  estadoInicial = '',
  cidadeInicial = '',
  dataBaseInicial = '',
}: LocalidadeProps) {
  const [estado, setEstado] =
    useState(estadoInicial)

  const [cidade, setCidade] =
    useState(cidadeInicial)

  const [dataBase, setDataBase] =
    useState(dataBaseInicial)

  const formularioValido =
    estado.trim().length > 0 &&
    dataBase.length > 0

  function handleAnalisar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!formularioValido) {
      return
    }

    onAnalisar(
      estado.trim(),
      cidade.trim(),
      dataBase
    )
  }

  return (
    <section className="card localidade-card">
      <div className="localidade-cabecalho">
        <span className="identificacao-etapa">
          ETAPA 4 DE 6
        </span>

        <h2>Localidade da análise</h2>

        <p>
          Informe a região e o período de referência
          para a simulação de crédito.
        </p>
      </div>

      <form onSubmit={handleAnalisar}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="estado">
              Estado *
            </label>

            <input
              id="estado"
              name="estado"
              type="text"
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value)
              }
              placeholder="Ex.: São Paulo"
              autoComplete="address-level1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cidade">
              Cidade (opcional)
            </label>

            <input
              id="cidade"
              name="cidade"
              type="text"
              value={cidade}
              onChange={(event) =>
                setCidade(event.target.value)
              }
              placeholder="Ex.: Campinas"
              autoComplete="address-level2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataBase">
              Data-base *
            </label>

            <input
              id="dataBase"
              name="dataBase"
              type="month"
              value={dataBase}
              onChange={(event) =>
                setDataBase(event.target.value)
              }
              required
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
            Analisar crédito →
          </button>
        </div>
      </form>
    </section>
  )
}

export default Localidade
