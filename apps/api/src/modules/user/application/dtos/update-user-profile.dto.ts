/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform, Type } from 'class-transformer';
import { IsOptional, Matches, ValidateNested } from 'class-validator';
import { IsCPF } from 'src/modules/auth/application/create-account/is-cpf-decorator';

export class UpdatePersonDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, '')) // remove tudo que não for número
  @Matches(/^\d{11}$/, { message: 'CPF inválido' })   // valida 11 dígitos
  @IsCPF()
  cpf?: string;
}
export class UpdatePersonProfileDto {
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, '')) // remove tudo que não for número
  @Matches(/^\d{10,15}$/, { message: 'Telefone inválido' }) // valida 10 a 15 dígitos
  phone?: string;

  @IsOptional()
  @Type(() => Date)
  birthDate?: Date;
}
export class UpdateUserProfileDto {
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  @IsOptional()
  person?: UpdatePersonDto;

  @ValidateNested()
  @Type(() => UpdatePersonProfileDto)
  @IsOptional()
  profile?: UpdatePersonProfileDto;
}
