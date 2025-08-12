import MockAdapter from 'axios-mock-adapter';

export default function setupFuenteFinanciamientoMock(mock) {
  console.log('Simulando la API de usuarios...');
  const planificaciones = {
    desglosePresupuesto: [
      { id: 2, descripcion_actividad: 'Taller de JIOC y experiencias de organizaciones de tierras altas, Potosi.',
         fecha_iactividad: '2023-05-15', fecha_factividad: '2023-05-16', objetivo_actividad: 'Identificar los avances de la aplicacion de las Normas y Procedimientos Propios y ejercicio de JIOC'
, fuente_financiamiento: 'Proyecto 090240 BD K13P07 NINA POR LA VIDA', monto: 5000, manual: true },
      // { id: 3, nombre: "Fondos Propios", monto: 2, manual: false },
      // { id: 4, nombre: "Fondos Propios", monto: 78, manual: false },
      // { id: 5, nombre: "Fondos Propios", monto: 90, manual: false },
      // { id: 6, nombre: "Agregado", monto: 5, manual: true },
      // { id: 7, nombre: "Financiador Uno", monto: 30, manual: true },
      // { id: 8, nombre: "Otros", monto: 15, manual: true },
    ],
  };
  mock.onGet('http://127.0.0.1:8000/autenticacion_api/datos_actividad/').reply(200, planificaciones);
}
