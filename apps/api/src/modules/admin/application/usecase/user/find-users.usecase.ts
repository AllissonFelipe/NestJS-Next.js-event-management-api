/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { IsAdminValidator } from "../../validators/is-admin.validator";
import { AdminNotFoundError } from "../../../domain/errors/admin-not-found.error";
import { PERSON_REPOSITORY, type PersonRepositoryInterface } from "src/modules/person/domain/person.repository-interface";
import { FiltersOfUserDto } from "../../dtos/filters-of-user.dto";
import { UserResponseDto } from "src/shared/responses/user/user-response.dto";
import { PersonRepositoryFiltersInterface } from "src/modules/person/domain/person-repository-filters-interface";
import { UserPresenter } from "src/shared/responses/user/user-presenter.response";
import { PaginationResultInterface } from "src/shared/interfaces/pagination-result.interface";
import { UserNotFoundError } from "src/shared/errors/user-not-found.error";

@Injectable()
export class FindUsersUseCase {
    constructor (
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
        @Inject(PERSON_REPOSITORY)
        private readonly personRepository: PersonRepositoryInterface,
    ) {}

    async byId(adminPersonId: string, userPersonId: string): Promise<UserResponseDto> {
        if (!adminPersonId) {
            throw new AdminNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const result = await this.personRepository.findPersonById(userPersonId);
        if (!result) {
            throw new UserNotFoundError();
        }
        return UserPresenter.toResponse(result)
    }

    async withFilters(adminPersonId: string, filtersDto: FiltersOfUserDto): Promise<PaginationResultInterface<UserResponseDto>> {
        if (!adminPersonId) {
            throw new AdminNotFoundError();
        }
        await this.isAdminValidator.validate(adminPersonId);
        const filters: PersonRepositoryFiltersInterface = {
            fullName: filtersDto.fullName,
            cpf: filtersDto.cpf,
            email: filtersDto.email,
            isActive: filtersDto.isActive,
            createdAt: filtersDto.createdAt,
            page: filtersDto.page ?? 1,
            limit: filtersDto.limit ?? 10,
        }
        const result = await this.personRepository.findWithFilters(filters);
        const page = filtersDto.page ? Number(filtersDto.page) : 1;
        const limit = filtersDto.limit ? Number(filtersDto.limit) : 10;
        const totalPages = Math.max(1, Math.ceil(result.meta.total / limit));
        return {
            items: result.items.map((user) => UserPresenter.toResponse(user)),
            meta: {
                page: page,
                limit: limit,
                total: result.meta.total,
                totalPages: Math.max(1, Math.ceil(result.meta.total / limit)),
                hasNextPage: totalPages > page,
                hasPreviousPage: page > 1,
            }  
        }
    }
}