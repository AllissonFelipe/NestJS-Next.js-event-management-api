import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { type AuthRequest } from 'src/modules/auth/types/auth-request';
import { FindEventFilters } from 'src/modules/events/application/dto/find-event-filters.dto';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import {
  EventResponseDto,
  EventResponseWithPaginationDto,
} from '../application/response/event/event-response.dto';
import { AdminFindEventsUseCase } from '../application/usecase/events/find-events.usecase';
import { AdminDeleteEventUseCase } from '../application/usecase/events/delete-event.usecase';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin/users/:userPersonId/events')
export class AdminUserEventsController {
  constructor(
    @Inject()
    private readonly adminFindEventsUseCase: AdminFindEventsUseCase,
    @Inject()
    private readonly adminDeleteEventUseCase: AdminDeleteEventUseCase,
  ) {}

  // -------- ÁREA DE GERENCIAMENTO DE EVENTOS DO USUÁRIO ---------
  // -------- ÁREA DE GERENCIAMENTO DE EVENTOS DO USUÁRIO ---------
  // PROCURAR TODOS EVENTOS DO USUÁRIO byUserPersonId COM FILTROS
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllEventsOfUserByPersonId(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
    @Query() filters: FindEventFilters,
  ): Promise<EventResponseWithPaginationDto> {
    return await this.adminFindEventsUseCase.allEventsOfUserByPersonId(
      req.user.sub,
      userPersonId,
      filters,
    );
  }
  // PROCURAR UM EVENTO ESPECÍFICO DO USUÁRIO ByUserPersonId && ByEventId
  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  async findEventByUserIdAndEventId(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
    @Param('eventId') eventId: string,
  ): Promise<EventResponseDto> {
    return await this.adminFindEventsUseCase.byUserIdAndEventId(
      req.user.sub,
      userPersonId,
      eventId,
    );
  }
  // DELETAR UM EVENTO DO USUÁRIO byUserPersonId && byEventId
  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserEvent(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
    @Param('eventId') eventId: string,
  ): Promise<void> {
    await this.adminDeleteEventUseCase.deleteUserEvent(req.user.sub, userPersonId, eventId);
  }
}
