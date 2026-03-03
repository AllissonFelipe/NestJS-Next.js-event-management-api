/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { IsCPF } from '../validators/is-valid-cpf.validator';

export class AdminUpdatePersonDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, '')) // remove tudo que não for número
  @Matches(/^\d{11}$/, { message: 'CPF inválido' })   // valida 11 dígitos
  @IsCPF()
  cpf?: string;
}
export class AdminUpdatePersonProfileDto {
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.replace(/\D/g, '')) // remove tudo que não for número
  @Matches(/^\d{10,15}$/, { message: 'Telefone inválido' }) // valida 10 a 15 dígitos
  phone?: string;

  @IsOptional()
  @Type(() => Date)
  birthDate?: Date;
}
export class AdminUpdateUserDto {
  @ValidateNested()
  @Type(() => AdminUpdatePersonDto)
  @IsOptional()
  person?: AdminUpdatePersonDto;

  @ValidateNested()
  @Type(() => AdminUpdatePersonProfileDto)
  @IsOptional()
  profile?: AdminUpdatePersonProfileDto;
}
