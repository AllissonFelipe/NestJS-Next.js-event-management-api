/* eslint-disable prettier/prettier */
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER')

export interface PasswordHasherInterface {
    hash(rawPassword: string): Promise<string>;
    compare(rawPassword: string, hashPassword: string): Promise<boolean>;
}