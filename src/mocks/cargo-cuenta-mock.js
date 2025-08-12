import MockAdapter from 'axios-mock-adapter';

export default function setupFuenteFinanciamientoMock(mock) {
  console.log('Simulando la API de usuarios...');
  const cargo = {
    cuenta: [
      { id: 2, formulario_numero: 1, fuente_financiamiento: 'CAFOD - Tres Cursos sobre Litigio Estrategico.',
        monto: 5000, manual: true },
    ],
  };
  mock.onGet('http://127.0.0.1:8000/autenticacion_api/cargo_cuenta/').reply(200, cargo);
}
