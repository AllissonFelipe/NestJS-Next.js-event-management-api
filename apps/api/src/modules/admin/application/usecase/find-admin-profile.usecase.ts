/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { AdminIdNotFoundError } from "../../domain/errors/admin-id-not-found.error";
import { IsAdminValidator } from "../validators/is-admin.validator";
import { AdminPresenter } from "../response/admin/admin-presenter";
import { AdminResponseDto } from "../response/admin/admin-response.dto";

@Injectable()
export class FindAdminProfileUseCase {
    constructor (
        @Inject()
        private readonly isAdminValidator: IsAdminValidator,
    ) {}

    async execute(adminPersonId: string): Promise<AdminResponseDto> {
        if (!adminPersonId) {
            throw new AdminIdNotFoundError();
        }
        const admin = await this.isAdminValidator.validate(adminPersonId);
        return AdminPresenter.toResponse(admin);
    }
}