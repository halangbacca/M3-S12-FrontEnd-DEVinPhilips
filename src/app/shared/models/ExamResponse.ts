import { Patient } from "@shared/models/Patient";

export interface ExamResponse {
  id: number;
  paciente: Patient;
  descricao: string;
  dtaExame: string;
  tipo: string;
  documento: string;
  resultado: string;
}
