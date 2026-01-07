export const getActivityIcon = (tipos) => {
  const iconMap = {
    ACAP: 'mdi-school-outline',
    PRIN: 'mdi-microscope',
    AOP: 'mdi-cog-outline',
    CSNS: 'mdi-megaphone',
    PDES: 'mdi-home-city',
    AINC: 'mdi-bullhorn',
    AART: 'mdi-handshake',
  }
  for (const tipo of tipos) {
    if (iconMap[tipo]) return iconMap[tipo]
  }
  return 'mdi-clipboard-text-outline'
}
