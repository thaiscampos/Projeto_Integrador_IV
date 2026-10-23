export interface Cliente {
  nome: string
  renda: number
  setor: string
  profissao: string
  prazo: number
  estado: string
}

export interface ResultadoCredito {
  nome: string
  renda: number
  setor: string
  profissao: string
  prazo: number
  estado: string
  taxa_media: number
  taxa_cliente: number
  risco: string
  perfil: string
}