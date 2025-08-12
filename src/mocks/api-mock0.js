import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import setupUsuariosMock from './usuarios-mock';
import setupSolicitudesMock from './solicitudes-mock';
import setupFuenteFinanciamientoMock from './fuente-financiamiento';

const mock = new MockAdapter(axios, { delayResponse: 500 });

setupUsuariosMock(mock);
setupSolicitudesMock(mock);
setupFuenteFinanciamientoMock(mock);

export default mock;
