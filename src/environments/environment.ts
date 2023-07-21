export const environment = {
  production: false,

  HEADER: { 'Content-Type': 'application/json' },

  //API
  URL_API: 'http://localhost:8081/api',
  API_PATIENT: '/pacientes',
  API_APPOINTMENT: '/consultas',
  API_COMPANY: '/empresas',
  API_EXAM: '/exames',
  API_DRUG: '/drug',
  API_DIET: '/diet',
  API_EXERCISE: '/exercise',
  API_USER: 'user/',


  //VIA CEP
  API_CEP: 'https://viacep.com.br/ws',
  FORMATO_CEP: 'json',
};
