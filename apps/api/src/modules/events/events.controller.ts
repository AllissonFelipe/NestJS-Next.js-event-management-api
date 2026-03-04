import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { PersonRoleEnum } from '../person-role/domain/person-role.enum';
import { FindEventsUseCase } from './application/usecase/find-event.usecase';
import { FindEventFilters } from './application/dto/find-event-filters.dto';
import { type AuthRequest } from '../auth/types/auth-request';
import { Public } from '../auth/decorators/public.decorator';
import { SetEventParticipationStatusUseCase } from './application/usecase/set-event-participation-status.usecase';
import { SetParticipationStatusDto } from './application/dto/set-participation-status.dto';
import { EventParticipantsResponseDto } from './application/responses/event-participants/event-participants.response-dto';
import {
  EventWithPaginationResponseDto,
  EventWithParticipantsResponseDto,
} from './application/responses/event/event.response-dto';
import { DeleteEventParticipationStatusUseCase } from './application/usecase/delete-event-participation-status.usecase';
import { CreateEventReportDto } from './application/dto/create-event-report.dto';
import { MyEventReportResponseDto } from './application/responses/event-reports/my-event-report.response-dto';
import { ReportEventUseCase } from './application/usecase/report-event.usecase';
import { MyEventReportsQueryDto } from './application/dto/my-event-reports-query.dto';
import { FindMyEventReportsUseCase } from './application/usecase/find-my-event-reports.usecase';

@Controller('events')
@Roles(PersonRoleEnum.USER)
export class EventsController {
  constructor(
    @Inject()
    private readonly findEventUseCase: FindEventsUseCase,
    @Inject()
    private readonly setEventParticipationStatusUseCase: SetEventParticipationStatusUseCase,
    @Inject()
    private readonly deleteEventParticipationStatusUseCase: DeleteEventParticipationStatusUseCase,
    @Inject()
    private readonly reportEventUseCase: ReportEventUseCase,
    @Inject()
    private readonly findMyEventReportsUseCase: FindMyEventReportsUseCase,
  ) {}

  // ----- ROTAS PÚBLICA -----
  // ----- ROTAS PÚBLICA -----
  // ----- ROTAS PÚBLICA -----
  // Achar todos os eventos do banco com filtros
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllPublicEvents(
    @Query() filters: FindEventFilters,
  ): Promise<EventWithPaginationResponseDto> {
    return await this.findEventUseCase.findAllPublicEvents(filters);
  }
  // Achar um evento específico
  @Public()
  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  async findOnePublicEvents(
    @Param('eventId') eventId: string,
  ): Promise<EventWithParticipantsResponseDto> {
    return await this.findEventUseCase.findOnePublicEvent(eventId);
  }

  // ------------------------ ROTAS DE USUÁRIO -------------------- //
  // ------------------------ ROTAS DE USUÁRIO -------------------- //
  // Define o status de participação do usuário no evento
  @Post(':eventId/participation')
  @HttpCode(HttpStatus.OK)
  async setParticipationStatus(
    @Req() req: AuthRequest,
    @Param('eventId') eventId: string,
    @Body() status: SetParticipationStatusDto,
  ): Promise<EventParticipantsResponseDto> {
    return await this.setEventParticipationStatusUseCase.execute(
      req.user.sub,
      eventId,
      status,
    );
  }
  // Deleta a participação de um evento do usuário
  @Delete(':eventId/participation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteParticipationStatus(
    @Req() req: AuthRequest,
    @Param('eventId') eventId: string,
  ) {
    await this.deleteEventParticipationStatusUseCase.execute(
      req.user.sub,
      eventId,
    );
  }
  // Reporta um evento
  @Post(':eventId/report')
  @HttpCode(HttpStatus.CREATED)
  async reportEvent(
    @Req() req: AuthRequest,
    @Param('eventId') eventId: string,
    @Body() dto: CreateEventReportDto,
  ): Promise<MyEventReportResponseDto> {
    return await this.reportEventUseCase.report(req.user.sub, eventId, dto);
  }
  // Busca todos os meu reportes de eventos
  @Get('me/reports')
  @HttpCode(HttpStatus.OK)
  async findMyEventReports(
    @Req() req: AuthRequest,
    @Query() query: MyEventReportsQueryDto,
  ): Promise<MyEventReportResponseDto> {
    return await this.findMyEventReportsUseCase.execute(req.user.sub);
  }
}
