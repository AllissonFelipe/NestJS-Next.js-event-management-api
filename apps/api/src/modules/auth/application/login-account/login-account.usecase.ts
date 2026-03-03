/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { PASSWORD_HASHER, type PasswordHasherInterface } from "../create-account/password-hasher.interface";
import { InvalidCredentialsError } from "src/modules/person/domain/errors/invalid-credential.error";
import { JwtService } from "@nestjs/jwt";
import { JwtPayLoad } from "../../types/jwt-payload";
import { AuthResponse } from "./auth.response";
import { AccountNotActivatedError } from "src/modules/person/domain/errors/account-not-activated.error";

@Injectable()
export class LoginAccountUseCase {
    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasherInterface,
        @Inject()
        private readonly jwtService: JwtService,
    ) {}

    async executeLogin(email: string, password: string): Promise<AuthResponse> {
        const person = await this.personRepository.findPersonByEmail(email);
        if (!person || !await this.passwordHasher.compare(password, person.passwordHash)) {
            throw new InvalidCredentialsError()
        }
        if (!person.isAccountActivated()) {
            throw new AccountNotActivatedError();
        }
        const payload: JwtPayLoad = {
            sub: person.id,
            role: person.personRole.role,
        }
        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: '7d'
            }),
        }
    }
}