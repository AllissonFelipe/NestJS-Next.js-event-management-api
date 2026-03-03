/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { IsCPF } from "../../../auth/application/create-account/is-cpf-decorator";

export class UpdatePersonDto {
    @IsString()
    @IsOptional()
    fullName?: string;
    
    @IsString()
    @IsOptional()
    @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
    @IsCPF({ message: 'CPF inválido' })
    cpf?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        { message: 'Senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial' })
    oldPassword?: string;
    
    @IsString()
    @IsOptional()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        { message: 'Senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial' })
    newPassword?: string;
}