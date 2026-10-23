export interface DadosSimulacao {
  tipoCliente: 'PF' | 'PJ'

  nome?: string
  // Pessoa Física
  profissao?: string
  faixaRenda?: string

  // Pessoa Jurídica
  porteEmpresa?: string
  setorEconomico?: string
  cnae?: string

  // Modalidade de crédito
  modalidadeCredito: string
  valorPretendido?: number

  // Localidade
  estado: string
  cidade?: string
  dataBase: string
}