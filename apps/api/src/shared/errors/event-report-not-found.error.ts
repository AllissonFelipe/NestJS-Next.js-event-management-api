export class EventReportNotFoundError extends Error {
  constructor() {
    super('Reporte de evendo não encontrado');
    this.name = 'EventReportNotFoundError';
  }
}
