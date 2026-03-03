/* eslint-disable prettier/prettier */
export class PasswordChangeDataMissingError extends Error {
    constructor() {
        super('Senha antiga e nova senha são obrigatórias');
        this.name = 'PasswordChangeDataMissingError';
    }
}