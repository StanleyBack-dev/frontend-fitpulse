export function formatDateToBR(dateString: string | Date) {
  const [year, month, day] = (typeof dateString === 'string' ? dateString : dateString.toISOString()).split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}