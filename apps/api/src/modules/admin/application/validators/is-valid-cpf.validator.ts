/* eslint-disable prettier/prettier */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function isValidCpf(cpf: string): boolean {
  if (!cpf) return false;

  // remove tudo que não for número
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // rejeita sequências repetidas
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    let total = 0;

    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (factor - i);
    }

    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const base = cpf.slice(0, 9);
  const digit1 = calcDigit(base, 10);
  const digit2 = calcDigit(base + digit1, 11);

  return cpf === base + digit1 + digit2;
}

export function IsCPF(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return isValidCpf(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido`;
        },
      },
    });
  };
}
