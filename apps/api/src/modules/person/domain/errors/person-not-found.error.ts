/* eslint-disable prettier/prettier */
export class PersonNotFoundError extends Error {
    constructor() {
        super(`Pessoa não encontrada`);
        this.name = 'PersonNotFoundError';
    }
}