/* eslint-disable prettier/prettier */
export class InvalidPasswordError extends Error {
    constructor() {
        super('Senha antiga inválida');
        this.name = 'InvalidPasswordError';
    }
}