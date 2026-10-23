import { useState } from 'react'
import type { Cliente } from '../../types/credito'

interface FormularioCreditoProps {
  onSubmit: (cliente: Cliente) => void
  carregando: boolean
}

function FormularioCredito({
  onSubmit,
  carregando,
}: FormularioCreditoProps) {
  const [nome, setNome] = useState('')
  const [renda, setRenda] = useState('')
  const [setor, setSetor] = useState('')
  const [profissao, setProfissao] = useState('')
  const [prazo, setPrazo] = useState('')
  const [estado, setEstado] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nomeTratado = nome.trim()
    const setorTratado = setor.trim()
    const profissaoTratada = profissao.trim()
    const estadoTratado = estado.trim().toUpperCase()

    const rendaNumero = Number(renda)
    const prazoNumero = Number(prazo)

    if (!nomeTratado || !setorTratado || !profissaoTratada) {
      return
    }

    if (!Number.isFinite(rendaNumero) || rendaNumero <= 0) {
      return
    }

    if (!Number.isInteger(prazoNumero) || prazoNumero <= 0) {
      return
    }

    if (!/^[A-Z]{2}$/.test(estadoTratado)) {
      return
    }

    const cliente: Cliente = {
      nome: nomeTratado,
      renda: rendaNumero,
      setor: setorTratado,
      profissao: profissaoTratada,
      prazo: prazoNumero,
      estado: estadoTratado,
    }

    onSubmit(cliente)
  }

  return (
    <section className="card">
      <h2>Dados para análise</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="renda">Renda mensal</label>

            <input
              id="renda"
              type="number"
              value={renda}
              onChange={(event) => setRenda(event.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Ex.: 5000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="setor">Setor</label>

            <input
              id="setor"
              type="text"
              value={setor}
              onChange={(event) => setSetor(event.target.value)}
              placeholder="Ex.: Tecnologia"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profissao">Profissão</label>

            <input
              id="profissao"
              type="text"
              value={profissao}
              onChange={(event) => setProfissao(event.target.value)}
              placeholder="Ex.: Engenheiro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prazo">Prazo (meses)</label>

            <input
              id="prazo"
              type="number"
              value={prazo}
              onChange={(event) => setPrazo(event.target.value)}
              min="1"
              step="1"
              placeholder="Ex.: 24"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>

            <input
              id="estado"
              type="text"
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value.toUpperCase())
              }
              maxLength={2}
              minLength={2}
              pattern="[A-Za-z]{2}"
              placeholder="Ex.: SP"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={carregando}>
            {carregando ? 'Analisando...' : 'Analisar Crédito'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default FormularioCredito