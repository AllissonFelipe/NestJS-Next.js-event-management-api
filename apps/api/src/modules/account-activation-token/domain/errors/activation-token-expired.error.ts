/* eslint-disable prettier/prettier */
export class ActivationTokenExpiredError extends Error {
    constructor () {
        super('Token expirado');
        this.name = 'ActivationTokenExpiredError';
    }
}