export class EventIdNotFoundError extends Error {
    constructor () {
        super('Rota ADMIN - Event id não encontrado');
        this.name = 'EventIdNotFoundError';
    }
}