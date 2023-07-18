export interface AppointmentResponse {
  id: number;
  motivo: string;
  dtaConsulta: string;
  problema: string;
  medicacao: string;
  precaucao: string;
  paciente: {
    id: number,
    nome: string
  }
}
