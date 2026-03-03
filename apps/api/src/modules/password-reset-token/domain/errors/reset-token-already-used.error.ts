/* eslint-disable prettier/prettier */
export class PasswordResetTokenAlreadyUsedError extends Error {
    constructor () {
        super('Password reset token já utilizado');
        this.name = 'PasswordResetTokenAlreadyUsedError';
    }
}