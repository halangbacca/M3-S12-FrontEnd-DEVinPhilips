export interface ExamRequest {
  id: number;
  idPatient: number;
  descricao: string;
  dtaExame: string;
  horaExame: string;
  tipo: string;
  laboratorio: string;
  documento: string;
  resultado: string;
}
