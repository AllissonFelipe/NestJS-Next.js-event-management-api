/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const PUBLIC_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'bol.com.br',
  'uol.com.br',
  'terra.com.br',
]);

function isPublicDomain(domain: string): boolean {
  domain = domain.toLowerCase().trim();

  // Remove possível porta (caso raro mas seguro)
  domain = domain.split(':')[0];

  // Impede bypass tipo gmail.com.fake.com
  const parts = domain.split('.');
  if (parts.length < 2) return false;

  const rootDomain = parts.slice(-2).join('.');

  return PUBLIC_DOMAINS.has(domain) || PUBLIC_DOMAINS.has(rootDomain);
}

export function IsPublicEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPublicEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          if (!value || typeof value !== 'string') return false;

          const atIndex = value.lastIndexOf('@');
          if (atIndex === -1) return false;

          const domain = value.slice(atIndex + 1);

          return isPublicDomain(domain);
        },

        defaultMessage() {
          return 'E-mail deve ser de provedor público válido';
        },
      },
    });
  };
}
