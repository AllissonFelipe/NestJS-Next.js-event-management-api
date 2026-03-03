/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'IsCPF', async: false })
export class IsCPFValidator implements ValidatorConstraintInterface {
    validate(text: string, _args: ValidationArguments): boolean {
        return cpfValidator.isValid(text);
    }

    defaultMessage(_args: ValidationArguments): string {
        return 'CPF inválido';
    }
}
