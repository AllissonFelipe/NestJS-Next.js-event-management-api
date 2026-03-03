/* eslint-disable prettier/prettier */
export class AccountNotActivatedError extends Error {
    constructor () {
        super('A sua conta não está ativada');
        this.name = 'AccountNotActivatedError';
    }
}