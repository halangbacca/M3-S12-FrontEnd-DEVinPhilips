export interface AppointmentRequest {
  id: number;
  idPaciente: number;
  motivo: string;
  dtaConsulta: string;
  horaConsulta: string;
  problema: string;
  medicacao: string;
  precaucao: string;
}
