import MockAdapter from 'axios-mock-adapter';

export default function setupUsuariosMock(mock) {
  console.log('Simulando la API de usuarios...');
  const usuariosFalsos = {
    usuarios: [
      { id: 1, nombre: 'Armando', paterno: 'Bronca', materno:'Segura',rol: 'coordinador' },
      { id: 2, nombre: 'Alan', paterno: 'Brito', materno:'Delgado',rol: 'responsable' },
      { id: 3, nombre: 'Domingo', paterno: 'Diaz', materno:'Festivo',rol: 'coordinador' },
      { id: 4, nombre: 'Rosa', paterno: 'Cortada', materno:'DelRosal',rol: 'administrador' },
      { id: 5, nombre: 'Jose', paterno: 'Pecho', materno:'Lanudo',rol: 'contador' },
      { id: 6, nombre: 'Zoila', paterno: 'Vaca', materno:'Gorda',rol: 'responsable' },
      { id: 7, nombre: 'Benito', paterno: 'Camelo', materno:'Delgado',rol: 'administrador' },
      { id: 8, nombre: 'Dolores', paterno: 'Fuertes', materno:'DeBarriga',rol: 'contador' },
    ],
  };
  mock.onGet('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/').reply(200, usuariosFalsos);
}
