export class EventReportIsReviewedError extends Error {
  constructor() {
    super('Reporte do evento esta em revisão.');
    this.name = 'EventReportIsAlreadyReviewedError';
  }
}
