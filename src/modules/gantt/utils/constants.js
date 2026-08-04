export const ESTADO_COLOR = {
  ES: '#42A5F5',
  EP: '#FFA726',
  CRD: '#BDBDBD',
  PLAN: '#64b5f6',
  RETR: '#ef5350',
  REPROG: '#ffd54f',
  EJEC: '#ffa726',
  REP: '#81c784',
  FIN: '#4CAF50',
  PEN: '#BDBDBD',
  EPROG: '#ffa726',
  COMPL: '#66BB6A',
}

export const ESTADO_LABEL = {
  ES: 'Estructuración',
  EP: 'En Planificación',
  CRD: 'Creada',
  PLAN: 'Planificada',
  RETR: 'Retraso',
  REPROG: 'Reprogramación',
  EJEC: 'En Ejecución',
  REP: 'En Reporte',
  FIN: 'Finalizado',
  PEN: 'Pendiente',
  EPROG: 'En Progreso',
  COMPL: 'Completada',
}

export const VIEWS = [
  { label: 'Día', value: 'day', icon: 'mdi-calendar-day' },
  { label: 'Semana', value: 'week', icon: 'mdi-calendar-week' },
  { label: 'Mes', value: 'month', icon: 'mdi-calendar-month' },
  { label: 'Año', value: 'year', icon: 'mdi-calendar' },
  { label: 'Lustro', value: 'lustro', icon: 'mdi-calendar-multiselect' },
]

export const VIEW_SCALES = {
  day: [
    { unit: 'month', step: 1, format: '%F %Y' },
    { unit: 'day', step: 1, format: '%d %M' },
    { unit: 'hour', step: 2, format: '%H:%i' },
  ],
  week: [
    { unit: 'month', step: 1, format: '%F %Y' },
    { unit: 'week', step: 1, format: 'Sem. %W' },
    { unit: 'day', step: 1, format: '%D %d' },
  ],
  month: [
    { unit: 'year', step: 1, format: '%Y' },
    { unit: 'month', step: 1, format: '%F' },
    { unit: 'day', step: 1, format: '%d' },
  ],
  year: [
    { unit: 'year', step: 1, format: '%Y' },
    { unit: 'month', step: 1, format: '%M' },
  ],
  lustro: [
    { unit: 'year', step: 5, format: '%Y' },
    { unit: 'year', step: 1, format: '%Y' },
  ],
}
