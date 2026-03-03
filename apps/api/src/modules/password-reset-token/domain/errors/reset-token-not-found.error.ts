/* eslint-disable prettier/prettier */
export class PasswordResetTokenNotFoundError extends Error {
    constructor () {
        super('Token do reset de password não encontrado');
        this.name = 'PasswordResetTokenNotFounError'
    }
}