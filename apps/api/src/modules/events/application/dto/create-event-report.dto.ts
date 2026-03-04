import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEventReportDto {
  @Transform(({ value }: TransformFnParams): string => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return '';
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(15, {
    message: 'A razão do reporte deve ter pelo menos 15 caracteres.',
  })
  @MaxLength(500, {
    message: 'A razão do reporte não deve passar de 500 caracteres.',
  })
  reason: string;
}
