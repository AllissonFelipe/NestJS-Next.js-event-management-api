/* eslint-disable prettier/prettier */
export class ResetPasswordTokenExpiredError extends Error {
    constructor () {
        super('Password reset token expirado');
        this.name = 'ResetPasswordTokenExpiredError';
    }
}