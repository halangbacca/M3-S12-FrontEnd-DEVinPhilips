export interface AppointmentRequest {
  id: number;
  idPaciente: number;
  motivo: string;
  dtaConsulta: string;
  problema: string;
  medicacao: string;
  precausao: string;
}
