import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Request
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { type AuthRequest } from 'src/modules/auth/types/auth-request';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import { FindEventFilters } from 'src/modules/events/application/dto/find-event-filters.dto';
import { EventResponseDto, EventResponseWithPaginationDto } from '../application/response/event/event-response.dto';
import { AdminFindEventsUseCase } from '../application/usecase/events/find-events.usecase';
import { AdminApproveEventUseCase } from '../application/usecase/events/approve-event.usecase';
import { AdminRejectEventUseCase } from '../application/usecase/events/reject-event.usecase';
import { AdminDeleteEventUseCase } from '../application/usecase/events/delete-event.usecase';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin/events')
export class AdminEventsController {
  constructor(
    @Inject()
    private readonly adminFindEventsUseCase: AdminFindEventsUseCase,
    @Inject()
    private readonly adminApproveEventUseCase: AdminApproveEventUseCase,
    @Inject()
    private readonly adminRejectEventUseCase: AdminRejectEventUseCase,
    @Inject()
    private readonly adminDeleteEventUseCase: AdminDeleteEventUseCase
  ) {}

  // ------------ ÁREA DE GERENCIAMENTO DE EVENTOS ---------------
  // ------------ ÁREA DE GERENCIAMENTO DE EVENTOS ---------------
  // PROCURAR TODOS OS EVENTOS COM FILTROS
  @Get()
  @HttpCode(HttpStatus.OK)
  async listOfEventsWithFilters(
    @Request() req: AuthRequest,
    @Query() filters: FindEventFilters
  ): Promise<EventResponseWithPaginationDto> {
    return await this.adminFindEventsUseCase.allEventsWithFilters(req.user.sub, filters);
  }
  // PROCURAR UM EVENTO ESPECÍFICO byEventId
  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  async findEventById(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<EventResponseDto> {
    return await this.adminFindEventsUseCase.byEventId(req.user.sub, eventId);
  }
  // APROVAR UM EVENTO ESPECIFICO
  @Patch(':eventId/approve')
  @HttpCode(HttpStatus.OK)
  async approveEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<EventResponseDto> {
    return await this.adminApproveEventUseCase.execute(req.user.sub, eventId);
  }
  // REJEITAR UM EVENTO ESPECIFICO
  @Patch(':eventId/reject')
  @HttpCode(HttpStatus.OK)
  async rejectEvent(
    @Request() req: AuthRequest,
    @Param('eventId') eventId: string,
    @Body() reason?: string
  ): Promise<EventResponseDto> {
    return await this.adminRejectEventUseCase.execute(req.user.sub, eventId, reason);
  }
  // DELETAR UM EVENTO
  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Request() req: AuthRequest, @Param('eventId') eventId: string): Promise<void> {
    await this.adminDeleteEventUseCase.deleteEventById(req.user.sub, eventId);
  }
}
