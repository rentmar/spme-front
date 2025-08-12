import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import setupUsuariosMock from './usuarios-mock';
import setupSolicitudesMock from './solicitudes-mock';
import setupFuenteFinanciamientoMock from './fuente-financiamiento';
import setupCargoCuentaMock from './cargo-cuenta-mock'; // Importa el mock de cargo-cuenta

const mock = new MockAdapter(axios, { delayResponse: 500 });

// Configura los mocks para formulario 01
setupUsuariosMock(mock);              //validadores
setupSolicitudesMock(mock);           //solicitudes
setupFuenteFinanciamientoMock(mock);  //actividades
// Configura los mocks para formulario 02
setupCargoCuentaMock(mock);


export default mock;
