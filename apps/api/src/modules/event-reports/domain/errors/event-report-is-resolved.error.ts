export class EventReportIsResolvedError extends Error {
  constructor() {
    super('Reporte do evento está resolvido');
    this.name = 'EventReportIsAlreadyResolvedError';
  }
}
