/* eslint-disable prettier/prettier */
export class CpfAlreadyInUseError extends Error {
    constructor(cpf: string) {
        super(`CPF ${cpf} já em uso`);
        this.name = 'CpfAlreadyInUseError';
    }
}