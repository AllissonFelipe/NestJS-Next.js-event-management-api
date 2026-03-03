import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendActivationEmailDto {
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;
}
