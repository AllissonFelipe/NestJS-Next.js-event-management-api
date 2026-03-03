import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateEventAddressDto {
  @IsOptional()
  @IsString({ message: 'Rua deve ser um texto' })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  street?: string;

  @IsOptional()
  @IsString({ message: 'Número deve ser um texto' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  number?: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser um texto' })
  complement?: string;

  @IsOptional()
  @IsString({ message: 'Bairro deve ser um texto' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  neighborhood?: string;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser um texto' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Estado deve ser um texto' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'CEP deve ser um texto' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  zipCode?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'Título é obrigatório' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endAt?: string;
}

export class UserUpdateEventDto {
  @IsOptional()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdateEventDto)
  event?: UpdateEventDto;

  @IsOptional()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdateEventAddressDto)
  eventAddress?: UpdateEventAddressDto;
}
