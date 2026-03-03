/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, Req } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { PersonRoleEnum } from "../person-role/domain/person-role.enum";
import { FindEventsUseCase } from "./application/usecase/find-event.usecase";
import { FindEventFilters } from "./application/dto/find-event-filters.dto";
import { type AuthRequest } from "../auth/types/auth-request";
import { Public } from "../auth/decorators/public.decorator";
import { SetEventParticipationStatusUseCase } from "./application/usecase/set-event-participation-status.usecase";
import { SetParticipationStatusDto } from "./application/dto/set-participation-status.dto";
import { EventParticipantsResponseDto } from "./application/responses/event-participants/event-participants.response-dto";
import { EventWithPaginationResponseDto, EventWithParticipantsResponseDto } from "./application/responses/event/event.response-dto";

@Controller('events')
@Roles(PersonRoleEnum.USER)
export class EventsController {
    constructor (
        @Inject()
        private readonly findEventUseCase: FindEventsUseCase,
        @Inject()
        private readonly setEventParticipationStatusUseCase: SetEventParticipationStatusUseCase,
    ) {}

    // ----- ROTAS PÚBLICA -----
    // ----- ROTAS PÚBLICA -----
    // ----- ROTAS PÚBLICA -----
    // Achar todos os eventos do banco com filtros
    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllPublicEvents(@Query() filters: FindEventFilters): Promise<EventWithPaginationResponseDto> {
        return await this.findEventUseCase.findAllPublicEvents(filters);
    }
    @Public()
    @Get(':eventId')
    @HttpCode(HttpStatus.OK)
    async findOnePublicEvents(@Param('eventId') eventId: string): Promise<EventWithParticipantsResponseDto> {
        return await this.findEventUseCase.findOnePublicEvent(eventId);
    }
    // ------------------------ ROTAS DE USUÁRIO -------------------- //
    // ------------------------ ROTAS DE USUÁRIO -------------------- //
    // Define o status de participação do usuário no evento
    @Post(':eventId/participation')
    @HttpCode(HttpStatus.OK)
    async setParticipationStatus(@Req() req: AuthRequest, @Param('eventId') eventId: string, @Body() status: SetParticipationStatusDto): Promise<EventParticipantsResponseDto> {
        return await this.setEventParticipationStatusUseCase.execute(req.user.sub, eventId, status);
    }
}