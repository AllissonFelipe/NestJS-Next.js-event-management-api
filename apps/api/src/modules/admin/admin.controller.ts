/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Patch, Query, Request } from "@nestjs/common";
import { PersonRoleEnum } from "../person-role/domain/person-role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { type AuthRequest } from "../auth/types/auth-request";
import { FindAdminProfileUseCase } from "./application/usecase/find-admin-profile.usecase";
import { AdminResponseDto } from "./application/response/admin/admin-response.dto";
import { FindUsersUseCase } from "./application/usecase/user/find-users.usecase";
import { FiltersOfUserDto } from "./application/dtos/filters-of-user.dto";
import { PaginationResultInterface } from "src/shared/interfaces/pagination-result.interface";
import { FindEventsUseCase } from "./application/usecase/events/find-events.usecase";

import { FindEventFilters } from "../events/application/dto/find-event-filters.dto";
import { UpdateEventStatusUseCase } from "./application/usecase/events/update-event-status.usecase";
import { UpdateEventStatusDto } from "./application/dtos/update-event-status.dto";
import { DeleteEventUseCase } from "./application/usecase/events/delete-event.usecase";
import { AdminUpdateUserUseCase } from "./application/usecase/user/update-user.usecase";
import { AdminUpdateUserDto } from "./application/dtos/update-user.dto";
import { UserResponseDto } from "src/shared/responses/user/user-response.dto";
import { AdminDeleteUserUseCase } from "./application/usecase/user/delete-user.usecase";
import { EventResponseDto, EventResponseWithPaginationDto } from "./application/response/event/event-response.dto";
import { AdminFindEventReportUseCase } from "./application/usecase/event-reports/find-event-report.usecase";
import { FindEventReportQueryDto } from "./application/dtos/find-event-report-query.dto";
import { AdminEventReportResponseDto, AdminEventsReportsWithQueryResponseDto } from "./application/response/event-report/admin-event-report-response.dto";
import { AdminPatchEventReportStatusUseCase } from "./application/usecase/event-reports/patch-event-report-status.usecase";
import { AdminApproveEventUseCase } from "./application/usecase/events/approve-event.usecase";
import { AdminRejectEventUseCase } from "./application/usecase/events/reject-event.usecase";

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
        private readonly adminApproveEventUseCase: AdminApproveEventUseCase,
        @Inject()
        private readonly adminRejectEventUseCase: AdminRejectEventUseCase,
        @Inject()
        private readonly updateEventStatusUseCase: UpdateEventStatusUseCase,
        @Inject()
        private readonly deleteEventUseCase: DeleteEventUseCase,
        @Inject()
        private readonly updateUserUseCase: AdminUpdateUserUseCase,
        @Inject()
        private readonly deleteUserUseCase: AdminDeleteUserUseCase,
        @Inject()
        private readonly adminFindEventReportUseCase: AdminFindEventReportUseCase,
        @Inject()
        private readonly adminPatchEventReportStatusUseCase: AdminPatchEventReportStatusUseCase,
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
    
    // --------- ÁREA DE GERENCIAMENTO DE REPORTES DE EVENTOS ------------
    // --------- ÁREA DE GERENCIAMENTO DE REPORTES DE EVENTOS ------------
    // ACHAR TODOS O REPORTES DA PLATAFORMA
    @Get('events/reports')
    @HttpCode(HttpStatus.OK)
    async findAll(@Request() req: AuthRequest, @Query() query: FindEventReportQueryDto): Promise<AdminEventsReportsWithQueryResponseDto> {
        return await this.adminFindEventReportUseCase.findAllReports(req.user.sub, query);
    }
    // ACHAR TODOS OS REPORTES DE UM EVENTO
    @Get('events/:eventId/reports')
    @HttpCode(HttpStatus.OK)
    async findAllReportsOfEvent(@Request() req: AuthRequest, @Param('eventId', new ParseUUIDPipe()) eventId: string, @Query() query: FindEventReportQueryDto): Promise<AdminEventsReportsWithQueryResponseDto> {
        return await this.adminFindEventReportUseCase.findAllReportsOfEvent(req.user.sub, eventId, query)
    }
    // ACHAR UM REPORTE ESPECIFICO DE UM EVENTO ESPECIFICO
    @Get('events/:eventId/reports/:eventReportId')
    @HttpCode(HttpStatus.OK)
    async findOneReportOfEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Param('eventReportId') eventReportId: string): Promise<AdminEventReportResponseDto> {
        return await this.adminFindEventReportUseCase.findOneReportOfEvent(req.user.sub, eventId, eventReportId);
    }
    // MARCAR O REPORTE DO EVENTO COMO -REVIEWED-
    @Patch('events/:eventId/reports/:eventReportId/reviewed')
    @HttpCode(HttpStatus.OK)
    async markReportAsReviewed(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Param('eventReportId') eventReportId: string): Promise<AdminEventReportResponseDto> {
        return await this.adminPatchEventReportStatusUseCase.executeReviewed(req.user.sub, eventId, eventReportId);
    }
    // MARCAR O REPORTE DO EVENTO COMO -RESOLVED-
    @Patch('events/:eventId/reports/:eventReportId/resolved')
    @HttpCode(HttpStatus.OK)
    async markReportAsResolved(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Param('eventReportId') eventReportId: string): Promise<AdminEventReportResponseDto> {
        return await this.adminPatchEventReportStatusUseCase.executeResolved(req.user.sub, eventId, eventReportId);
    }
    // MARCAR O REPORTE DO EVENTO COMO -OPEN-
    @Patch('events/:eventId/reports/:eventReportId/open')
    @HttpCode(HttpStatus.OK)
    async markReportAsOpen(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Param('eventReportId') eventReportId: string): Promise<AdminEventReportResponseDto> {
        return await this.adminPatchEventReportStatusUseCase.executeOpen(req.user.sub, eventId, eventReportId);
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
    // APROVAR UM EVENTO ESPECIFICO
    @Patch('events/:eventId/approve')
    @HttpCode(HttpStatus.OK)
    async approveEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<EventResponseDto> {
        return await this.adminApproveEventUseCase.execute(req.user.sub, eventId)
    }
    // REJEITAR UM EVENTO ESPECIFICO
    @Patch('events/:eventId/reject')
    @HttpCode(HttpStatus.OK)
    async rejectEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string, @Body() reason?: string): Promise<EventResponseDto> {
        return await this.adminRejectEventUseCase.execute(req.user.sub, eventId, reason)
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