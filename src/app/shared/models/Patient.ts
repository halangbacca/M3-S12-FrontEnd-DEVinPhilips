import { Alergia } from "./Alergia";
import { Precaucao } from "./Precaucao";

export interface Patient {
  id: number;
  nome: string;
  genero: string;
  dtaNascimento: string;
  nroCpf: string;
  nroRg: string;
  estadoCivil: string;
  telefone: string;
  email: string;
  naturalidade: string;
  convenio: string;
  nroCarteira: string;
  dtaValidade: string;
  telefoneEmergencia: string;
  alergias: Alergia[];
  precaucoes: Precaucao[];
  cep: string;
  cidade: string;
  estado: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  pontoReferencia: string;
}
