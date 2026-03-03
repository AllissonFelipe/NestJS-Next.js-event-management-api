import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserCreateEventAddressDto {
  @IsString({ message: 'Rua deve ser um texto' })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  street: string;

  @IsString({ message: 'Número deve ser um texto' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  number: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser um texto' })
  complement?: string;

  @IsString({ message: 'Bairro deve ser um texto' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  neighborhood: string;

  @IsString({ message: 'Cidade deve ser um texto' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city: string;

  @IsString({ message: 'Estado deve ser um texto' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state: string;

  @IsString({ message: 'CEP deve ser um texto' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  zipCode: string;
}

export class UserCreateEventDto {
  @IsNotEmpty()
  @IsString({ message: 'Título é obrigatório' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @IsDateString()
  @IsNotEmpty()
  endAt: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserCreateEventAddressDto)
  eventAddress: UserCreateEventAddressDto;
}
