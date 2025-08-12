import MockAdapter from 'axios-mock-adapter';

export default function setupSolicitudesMock(mock) {
  console.log('Simulando la API de solicitudes...');
  mock.onPost('http://127.0.0.1:8000/monitoreo_api/crearUsuario/').reply(201, {
    message: 'Solicitud creada con éxito.',
  });
}
