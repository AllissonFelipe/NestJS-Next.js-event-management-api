import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EventsStatusEnum } from '../../domain/events-status.enum';
import { Type } from 'class-transformer';

export class FindEventFilters {
  @IsOptional()
  @IsString({ message: 'Title deve ser um texto' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser um texto' })
  description?: string;

  @IsOptional()
  @IsEnum(EventsStatusEnum, { message: 'Status inválido' })
  status?: EventsStatusEnum;

  // =========================
  // FILTRO POR DATA DO EVENTO
  // =========================

  @IsOptional()
  @IsDateString({}, { message: 'startAt deve ser uma data válida ISO' })
  startAt?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endAt deve ser uma data válida ISO' })
  endAt?: string;

  // =========================
  // FILTRO POR ENDEREÇO
  // =========================

  @IsOptional()
  @IsString({ message: 'City deve ser um texto' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State deve ser um texto' })
  state?: string;

  // =========================
  // FILTRO POR CRIADOR
  // =========================

  @IsOptional()
  @IsString({ message: 'createdById deve ser um texto' })
  createdBy?: string;

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
