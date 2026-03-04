export class EventAlreadyReportedByUser extends Error {
  constructor() {
    super('Você ja reportou este evento.');
    this.name = 'EventAlreadyReportedByUser';
  }
}
