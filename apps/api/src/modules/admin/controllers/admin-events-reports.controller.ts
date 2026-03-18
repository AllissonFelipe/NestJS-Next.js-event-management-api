import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import { AdminFindEventReportUseCase } from '../application/usecase/event-reports/find-event-report.usecase';
import { AdminUpdateEventReportStatusUseCase } from '../application/usecase/event-reports/update-event-report-status.usecase';
import { type AuthRequest } from 'src/modules/auth/types/auth-request';
import { FindEventReportQueryDto } from '../application/dtos/find-event-report-query.dto';
import {
  AdminEventReportResponseDto,
  AdminEventsReportsWithQueryResponseDto,
} from '../application/response/event-report/admin-event-report-response.dto';
import { UpdateEventReportStatusDto } from '../application/dtos/update-event-report-status.dto';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin/events-reports')
export class AdminEventsReportsController {
  constructor(
    @Inject()
    private readonly adminFindEventReportUseCase: AdminFindEventReportUseCase,
    @Inject()
    private readonly adminUpdateEventReportStatusUseCase: AdminUpdateEventReportStatusUseCase,
  ) {}

  // --------- ÁREA DE GERENCIAMENTO DE REPORTES DE EVENTOS ------------
  // --------- ÁREA DE GERENCIAMENTO DE REPORTES DE EVENTOS ------------
  // ACHAR TODOS O REPORTES DA PLATAFORMA
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() req: AuthRequest,
    @Query() query: FindEventReportQueryDto,
  ): Promise<AdminEventsReportsWithQueryResponseDto> {
    return await this.adminFindEventReportUseCase.findAllReports(
      req.user.sub,
      query,
    );
  }
  // ACHAR TODOS OS REPORTES DE UM EVENTO
  @Get('event/:eventId')
  @HttpCode(HttpStatus.OK)
  async findAllReportsOfEvent(
    @Request() req: AuthRequest,
    @Param('eventId') eventId: string,
    @Query() query: FindEventReportQueryDto,
  ): Promise<AdminEventsReportsWithQueryResponseDto> {
    return await this.adminFindEventReportUseCase.findAllReportsOfEvent(
      req.user.sub,
      eventId,
      query,
    );
  }
  // ACHAR UM REPORT ESPECIFICO
  @Get(':eventReportId')
  @HttpCode(HttpStatus.OK)
  async findOneReport(
    @Request() req: AuthRequest,
    @Param('eventReportId') eventReportId: string,
  ): Promise<AdminEventReportResponseDto> {
    return await this.adminFindEventReportUseCase.findOneReport(
      req.user.sub,
      eventReportId,
    );
  }
  // ATUALIZAR O STATUS DO REPORT
  @Patch(':eventReportId/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Request() req: AuthRequest,
    @Param('eventReportId') eventReportId: string,
    @Body() dto: UpdateEventReportStatusDto,
  ): Promise<AdminEventReportResponseDto> {
    return await this.adminUpdateEventReportStatusUseCase.execute(
      req.user.sub,
      eventReportId,
      dto,
    );
  }
}
