/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        { message: 'Senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial' })
    newPassword: string;
}