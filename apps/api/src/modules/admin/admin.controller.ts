/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Query, Request } from "@nestjs/common";
import { PersonRoleEnum } from "../person-role/domain/person-role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { type AuthRequest } from "../auth/types/auth-request";
import { FindAdminProfileUseCase } from "./application/usecase/find-admin-profile.usecase";
import { AdminResponseDto } from "./application/response/admin/admin-response.dto";
import { FindUsersUseCase } from "./application/usecase/find-users.usecase";
import { FiltersOfUserDto } from "./application/dtos/filters-of-user.dto";
import { PaginationResultInterface } from "src/shared/interfaces/pagination-result.interface";
import { FindEventsUseCase } from "./application/usecase/find-events.usecase";

import { FindEventFilters } from "../events/application/dto/find-event-filters.dto";
import { UpdateEventStatusUseCase } from "./application/usecase/update-event-status.usecase";
import { UpdateEventStatusDto } from "./application/dtos/update-event-status.dto";
import { DeleteEventUseCase } from "./application/usecase/delete-event.usecase";
import { AdminUpdateUserUseCase } from "./application/usecase/update-user.usecase";
import { AdminUpdateUserDto } from "./application/dtos/update-user.dto";
import { UserResponseDto } from "src/shared/responses/user/user-response.dto";
import { AdminDeleteUserUseCase } from "./application/usecase/delete-user.usecase";
import { EventResponseDto, EventResponseWithPaginationDto } from "./application/response/event/event-response.dto";


@Roles(PersonRoleEnum.ADMIN)
@Controller('admin')
export class AdminController {
    constructor (
        @Inject()
        private readonly findAdminProfileUseCase: FindAdminProfileUseCase,
        @Inject()
        private readonly findUsersUseCase: FindUsersUseCase,
        @Inject()
        private readonly findEventsUseCase: FindEventsUseCase,
        @Inject()
        private readonly updateEventStatusUseCase: UpdateEventStatusUseCase,
        @Inject()
        private readonly deleteEventUseCase: DeleteEventUseCase,
        @Inject()
        private readonly updateUserUseCase: AdminUpdateUserUseCase,
        @Inject()
        private readonly deleteUserUseCase: AdminDeleteUserUseCase,
    ) {}

    // PROCURAR O PROFILE DO ADMIN LOGADO
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    async findAdminProfileByPersonId(@Request() req: AuthRequest): Promise<AdminResponseDto> {
        return await this.findAdminProfileUseCase.execute(req.user.sub);
    }

    // ---------- ÁREA DE GERENCIAMENTO DO USUÁRIO ---------------
    // ---------- ÁREA DE GERENCIAMENTO DO USUÁRIO ---------------
    // PROCURAR TODOS OS USERS COM FILTROS
    @Get('users')
    @HttpCode(HttpStatus.OK)
    async listOfUsersWithFilters(@Request() req: AuthRequest, @Query() filtersDto: FiltersOfUserDto): Promise<PaginationResultInterface<UserResponseDto>> {
        return await this.findUsersUseCase.withFilters(req.user.sub, filtersDto);
    }
    // PROCURAR USER byUserPersonId
    @Get('users/:userPersonId')
    @HttpCode(HttpStatus.OK)
    async findUserById(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string): Promise<UserResponseDto> {
        return await this.findUsersUseCase.byId(req.user.sub, userPersonId);
    }
    // ATUALIZAR UM USUÁRIO byUserPersonId
    @Patch('users/:userPersonId')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string, @Body() dto: AdminUpdateUserDto): Promise<UserResponseDto> {
        return await this.updateUserUseCase.execute(req.user.sub, userPersonId, dto);
    }
    // DELETAR UM USUÁRIO byUserPersonId
    @Delete('users/:userPersonId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string): Promise<void> {
        await this.deleteUserUseCase.execute(req.user.sub, userPersonId)
    }

    // -------- ÁREA DE GERENCIAMENTO DE EVENTOS DO USUÁRIO ---------
    // -------- ÁREA DE GERENCIAMENTO DE EVENTOS DO USUÁRIO ---------
    // PROCURAR TODOS EVENTOS DO USUÁRIO byUserPersonId COM FILTROS
    @Get('users/:userPersonId/events')
    @HttpCode(HttpStatus.OK)
    async findAllEventsOfUserByPersonId(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string, @Query() filters: FindEventFilters): Promise<EventResponseWithPaginationDto> {
        return await this.findEventsUseCase.allEventsOfUserByPersonId(req.user.sub, userPersonId, filters)
    }
    // PROCURAR UM EVENTO ESPECÍFICO DO USUÁRIO ByUserPersonId && ByEventId
    @Get('users/:userPersonId/events/:eventId')
    @HttpCode(HttpStatus.OK)
    async findEventByUserIdAndEventId(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string, @Param('eventId') eventId: string): Promise<EventResponseDto> {
        return await this.findEventsUseCase.byUserIdAndEventId(req.user.sub, userPersonId, eventId);
    }
    // ATUALIZAR O STATUS DE UM EVENTO DO USUÁRIO ByUserPersonId && ByEventId
    @Patch('users/:userPersonId/events/:eventId')
    @HttpCode(HttpStatus.OK)
    async updateUserEventStatus(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string, @Param('eventId') eventId: string, @Body() dto: UpdateEventStatusDto): Promise<EventResponseDto> {
        return await this.updateEventStatusUseCase.updateUserEventStatus(req.user.sub, userPersonId, eventId, dto)
    }
    // DELETAR UM EVENTO DO USUÁRIO byUserPersonId && byEventId
    @Delete('users/:userPersonId/events/:eventId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserEvent(@Request() req: AuthRequest, @Param('userPersonId') userPersonId: string, @Param('eventId') eventId: string): Promise<void> {
        await this.deleteEventUseCase.deleteUserEvent(req.user.sub, userPersonId, eventId)
    }
    

    // ------------ ÁREA DE GERENCIAMENTO DE EVENTOS ---------------
    // ------------ ÁREA DE GERENCIAMENTO DE EVENTOS ---------------
    // PROCURAR TODOS OS EVENTOS COM FILTROS
    @Get('events')
    @HttpCode(HttpStatus.OK)
    async listOfEventsWithFilters(@Request() req: AuthRequest, @Query() filters: FindEventFilters): Promise<EventResponseWithPaginationDto> {
        return await this.findEventsUseCase.allEventsWithFilters(req.user.sub, filters);
    }
    // PROCURAR UM EVENTO ESPECÍFICO byEventId
    @Get('events/:eventId')
    @HttpCode(HttpStatus.OK)
    async findEventById(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<EventResponseDto> {
        return await this.findEventsUseCase.byEventId(req.user.sub, eventId);
    }
    // ATUALIZAR STATUS DE UM EVENTO byEventId
    @Patch('events/:eventId')
    @HttpCode(HttpStatus.OK)
    async updateEventStatus(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Body() dto: UpdateEventStatusDto): Promise<EventResponseDto> {
        return await this.updateEventStatusUseCase.updateEventStatus(req.user.sub, eventId, dto);
    }
    // DELETAR UM EVENTO
    @Delete('events/:eventId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<void> {
        await this.deleteEventUseCase.deleteEventById(req.user.sub, eventId);
    }
}