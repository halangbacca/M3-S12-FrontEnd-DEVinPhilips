export const environment = {
  production: false,

  HEADER: { 'Content-Type': 'application/json' },

  //API
  URL_API: 'http://localhost:8081/api',
  API_PATIENT: '/pacientes',
  API_APPOINTMENT: '/consultas',
  API_COMPANY: '/empresas',
  API_EXAM: '/exames',
  API_DRUG: '/medicamentos',
  API_DIET: '/dietas',
  API_EXERCISE: '/exercicios',
  API_USER: '/usuarios',
  API_LOG: '/logs',

  //VIA CEP
  API_CEP: 'https://viacep.com.br/ws',
  FORMATO_CEP: 'json',
};
