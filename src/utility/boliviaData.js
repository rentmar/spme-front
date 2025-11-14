// Datos de departamentos y municipios de Bolivia
export const departamentosBolivia = [
  'Chuquisaca',
  'La Paz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Santa Cruz',
  'Beni',
  'Pando',
]

export const municipiosPorDepartamento = {
  Chuquisaca: [
    'Sucre',
    'Yamparáez',
    'Tarabuco',
    'Zudáñez',
    'Camargo',
    'Villa Azurduy',
    'Padilla',
    'Monteagudo',
    'Villa Serrano',
    'Culpina',
    'Las Carreras',
  ],
  'La Paz': [
    'La Paz',
    'El Alto',
    'Viacha',
    'Achacachi',
    'Caranavi',
    'Patacamaya',
    'Coroico',
    'Sorata',
    'Copacabana',
    'Guanay',
    'Chulumani',
  ],
  Cochabamba: [
    'Cochabamba',
    'Quillacollo',
    'Sacaba',
    'Colcapirhua',
    'Tiquipaya',
    'Vinto',
    'Sipe Sipe',
    'Cliza',
    'Punata',
    'Arani',
    'Tarata',
  ],
  Oruro: [
    'Oruro',
    'Huanuni',
    'Challapata',
    'Caracollo',
    'Litoral',
    'Poopó',
    'Machacamarca',
    'El Choro',
    'Curahuara de Carangas',
    'Turco',
  ],
  Potosí: [
    'Potosí',
    'Villazón',
    'Tupiza',
    'Uyuni',
    'Colcha K',
    'Llallagua',
    'Uncía',
    'Betanzos',
    'Cotagaita',
    'Sacaca',
  ],
  Tarija: [
    'Tarija',
    'Yacuiba',
    'Bermejo',
    'Villamontes',
    'Padcaya',
    'Entre Ríos',
    'Uriondo',
    'Yunchará',
    'Caraparí',
  ],
  'Santa Cruz': [
    'Santa Cruz de la Sierra',
    'El Torno',
    'La Guardia',
    'Warnes',
    'Cotoca',
    'Montero',
    'Mineros',
    'Portachuelo',
    'San Ignacio de Velasco',
    'San José de Chiquitos',
  ],
  Beni: [
    'Trinidad',
    'Riberalta',
    'Guayaramerín',
    'Rurrenabaque',
    'San Borja',
    'Santa Ana del Yacuma',
    'San Ignacio de Moxos',
    'Magdalena',
    'Baures',
  ],
  Pando: [
    'Cobija',
    'Porvenir',
    'Bella Flor',
    'Puerto Rico',
    'San Lorenzo',
    'Filadelfia',
    'Santos Mercado',
    'San Pedro',
    'Bolpebra',
  ],
}

// Función para obtener municipios por departamento
export const getMunicipiosByDepartamento = (departamento) => {
  return municipiosPorDepartamento[departamento] || []
}

// Función para obtener todas las localidades (municipios) disponibles
export const getAllLocalidades = () => {
  const allLocalidades = []
  Object.values(municipiosPorDepartamento).forEach((municipios) => {
    allLocalidades.push(...municipios)
  })
  return [...new Set(allLocalidades)].sort()
}

export default {
  departamentosBolivia,
  municipiosPorDepartamento,
  getMunicipiosByDepartamento,
  getAllLocalidades,
}
