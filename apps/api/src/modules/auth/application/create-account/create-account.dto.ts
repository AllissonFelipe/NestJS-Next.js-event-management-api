/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { IsCPF } from "./is-cpf-decorator";
import { Transform } from "class-transformer";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;
    
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.replace(/\D/g, ''))
    @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
    @IsCPF({ message: 'CPF inválido' })
    cpf: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        { message: 'Senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial' })
    password: string;
}