/* eslint-disable prettier/prettier */
import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCPFValidator } from './is-cpf-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsCPF',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsCPFValidator,
        });
    };
}
