export class EventReportIsOpenError extends Error {
  constructor() {
    super('Reporte do evento está em aberto.');
    this.name = 'EventReportIsOpenError';
  }
}
