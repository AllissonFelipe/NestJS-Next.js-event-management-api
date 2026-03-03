import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FiltersOfUserDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texo' })
  fullName?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
  // =========================
  // FILTRO POR DATA DE CRIAÇÃO DO USUÁRIO
  // =========================
  @IsOptional()
  @IsDateString({}, { message: 'createdAt deve ser uma data válida ISO' })
  createdAt?: string;

  // =========================
  // PAGINAÇÃO
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
