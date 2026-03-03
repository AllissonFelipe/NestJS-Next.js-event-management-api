import { IsEmail } from 'class-validator';
import { IsPublicEmail } from '../validator/is-public-email.validator';

export class ChangeUserEmailDto {
  @IsEmail()
  @IsPublicEmail()
  email: string;
}
