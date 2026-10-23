import type { Cliente, ResultadoCredito } from '../types/credito'

const API_URL = import.meta.env.VITE_API_URL

export async function analisarCredito(
  cliente: Cliente
): Promise<ResultadoCredito> {
  const response = await fetch(`${API_URL}/api/credito/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })

  if (!response.ok) {
    throw new Error('Erro ao consultar a API de crédito.')
  }

  const resultado: ResultadoCredito = await response.json()

  return resultado
}