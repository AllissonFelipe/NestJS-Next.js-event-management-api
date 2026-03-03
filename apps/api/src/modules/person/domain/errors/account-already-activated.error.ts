/* eslint-disable prettier/prettier */
export class AccountAlreadyActivatedError extends Error {
    constructor () {
        super('A conta já está ativada');
        this.name = 'AccountAlreadyActivatedError';
    }
}