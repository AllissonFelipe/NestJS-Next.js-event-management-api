export class AdminEventReportNotFoundError extends Error {
  constructor() {
    super('Reporte de evento não encontrado');
    this.name = 'AdminEventReportNotFoundError';
  }
}
