/* eslint-disable prettier/prettier */
export class UserNotFoundError extends Error {
    constructor () {
        super('Usuário não encontrado')
        this.name = 'UserNotFoundError';
    }
}