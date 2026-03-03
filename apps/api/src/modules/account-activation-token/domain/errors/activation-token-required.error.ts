/* eslint-disable prettier/prettier */
export class ActivationTokenRequiredError extends Error {
    constructor() {
        super('Token é obrigatório');
        this.name = 'ActivationTokenRequiredError';
    }
}