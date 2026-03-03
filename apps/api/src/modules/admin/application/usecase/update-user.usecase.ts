/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { AdminUpdateUserDto } from "../dtos/update-user.dto";
import { AdminIdNotFoundError } from "../../domain/errors/admin-id-not-found.error";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { UserNotFoundError } from "src/shared/errors/user-not-found.error";
import { EmptyUpdatePayloadError } from "src/shared/errors/empty-update-payload.error";
import { PERSON_PROFILE_REPOSITORY, type PersonProfileRepositoryInterface } from "src/modules/person-profile/domain/person-profile.repository-interface";
import { UNIT_OF_WORK } from "src/database/unit-of-work.interface";
import { TypeOrmUnitOfWork } from "src/database/typeorm-unit-of-work";
import { UserResponseDto } from "src/shared/responses/user/user-response.dto";
import { UserPresenter } from "src/shared/responses/user/user-presenter.response";
import { IsAdminValidator } from "../validators/is-admin.validator";
import { CpfAlreadyInUseError } from "src/modules/person/domain/errors/cpf-already-in-use.error";

@Injectable()
export class AdminUpdateUserUseCase {
    constructor (
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
        @Inject(PERSON_PROFILE_REPOSITORY)
        private readonly personProfileRepository: PersonProfileRepositoryInterface,
        @Inject(UNIT_OF_WORK)
        private readonly uow: TypeOrmUnitOfWork,
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
    ) {}

    async execute(adminPersonId: string, userPersonId: string, dto: AdminUpdateUserDto): Promise<UserResponseDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const user = await this.personRepository.findPersonById(userPersonId)
        if (!user) {
            throw new UserNotFoundError();
        }

        this.ensureDtoHasData(dto);

        if (dto.person?.cpf && dto.person.cpf !== user.cpf) {
            const ensureCpfIsDiferent = await this.personRepository.findPersonByCPF(dto.person.cpf)
            if (ensureCpfIsDiferent) {
                throw new CpfAlreadyInUseError(dto.person.cpf);
            }
        }

        await this.uow.execute(async (manager) => {
            if (dto.person !== undefined && Object.keys(dto.person).length > 0) {
                user.updateAll(dto.person)
                await this.personRepository.updatePerson(user, manager);
            }
            if (dto.profile !== undefined && Object.keys(dto.profile).length > 0) {
                user.personProfile.updateAll(dto.profile);
                await this.personProfileRepository.saveProfile(user.personProfile, manager);
            }
        })
        return UserPresenter.toResponse(user);
    }

    private ensureDtoHasData(dto: AdminUpdateUserDto): void {
        const hasPersonData = dto.person && Object.keys(dto.person).length > 0;
        const hasProfileData = dto.profile && Object.keys(dto.profile).length > 0;
        if (!hasPersonData && !hasProfileData) {
            throw new EmptyUpdatePayloadError();
        }
    }
}