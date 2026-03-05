export class EventReportNotFoundError extends Error {
  constructor() {
    super('Reporte de evento não encontrado.');
    this.name = 'EventReportNotFoundError';
  }
}
