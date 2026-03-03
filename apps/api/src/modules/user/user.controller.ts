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
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { type AuthRequest } from '../auth/types/auth-request';
import { PersonRoleEnum } from '../person-role/domain/person-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { FindUserProfileUseCase } from './application/usecase/find-user-profile.usecase';
import { UserResponseDto } from '../../shared/responses/user/user-response.dto';
import { UpdateUserProfileDto } from './application/dtos/update-user-profile.dto';
import { UpdateUserProfileUsecase } from './application/usecase/update-user-profile.usecase';
import { ChangeUserEmailDto } from './application/dtos/change-user-email.dto';
import { ChangeUserEmailUseCase } from './application/usecase/change-user-email.usecase';
import { UserCreateEventUseCase } from './application/usecase/create-event.usecase';
import { UserCreateEventDto } from './application/dtos/create-event.dto';
import { UserFindEventsUseCase } from './application/usecase/find-events.usecase';
import { FindEventFilters } from '../events/application/dto/find-event-filters.dto';
import {
  EventPaginationReponseDto,
  EventResponseDto,
} from './application/response/event/event-response.dto';
import { UserUpdateEventDto } from './application/dtos/update-event.dto';
import { UserUpdateEventUseCase } from './application/usecase/update-event.usecase';
import { UserDeleteEventUseCase } from './application/usecase/delete-event.usecase';

@Roles(PersonRoleEnum.USER)
@Controller('user')
export class UserController {
  constructor(
    @Inject()
    private readonly findUserProfileUseCase: FindUserProfileUseCase,
    @Inject()
    private readonly updateUserProfileUseCase: UpdateUserProfileUsecase,
    @Inject()
    private readonly updateUserEmailUseCase: ChangeUserEmailUseCase,
    @Inject()
    private readonly createEventUseCase: UserCreateEventUseCase,
    @Inject()
    private readonly findEventsUseCase: UserFindEventsUseCase,
    @Inject()
    private readonly updateEventUseCase: UserUpdateEventUseCase,
    @Inject()
    private readonly deleteEventUseCase: UserDeleteEventUseCase,
  ) {}

  // -------------------- ÁREA DE GERENCIAMENTO DO USUÁRIO ----------------
  // -------------------- ÁREA DE GERENCIAMENTO DO USUÁRIO ----------------
  // Find user profile
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async findUserProfileByPersonId(
    @Request() req: AuthRequest,
  ): Promise<UserResponseDto> {
    return await this.findUserProfileUseCase.findUserProfileByPersonId(
      req.user.sub,
    );
  }
  // Update user Profile
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateUserProfileByPersonId(
    @Request() req: AuthRequest,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    return await this.updateUserProfileUseCase.updateUserProfileByPersonId(
      req.user.sub,
      dto,
    );
  }

  // --------- ÁREA DE GERENCIAMENTO DE TROCA DE EMAIL ---------------
  // --------- ÁREA DE GERENCIAMENTO DE TROCA DE EMAIL ---------------
  // Request email change
  @Patch('profile/email-change/request')
  @HttpCode(HttpStatus.OK)
  async sendRequestToEmailChange(
    @Request() req: AuthRequest,
    @Body() dto: ChangeUserEmailDto,
  ) {
    await this.updateUserEmailUseCase.requestEmailChange(req.user.sub, dto);
    return {
      message: `Email enviado para ${dto.email}`,
    };
  }
  // Reset email
  @Patch('profile/email-change/reset/:token')
  @HttpCode(HttpStatus.OK)
  async resetEmail(@Param('token') rawToken: string) {
    await this.updateUserEmailUseCase.resetEmail(rawToken);
  }

  // ------------------ ÁREA DE GERENCIAMENTO DE EVENTOS ----------------
  // ------------------ ÁREA DE GERENCIAMENTO DE EVENTOS ----------------
  // Criar evento
  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  async createEvent(
    @Request() req: AuthRequest,
    @Body() dto: UserCreateEventDto,
  ): Promise<EventResponseDto> {
    return await this.createEventUseCase.execute(req.user.sub, dto);
  }
  // Achar todos os eventos - com filtros
  @Get('events')
  @HttpCode(HttpStatus.OK)
  async findAllMyEvents(
    @Request() req: AuthRequest,
    @Query() filter: FindEventFilters,
  ): Promise<EventPaginationReponseDto> {
    return await this.findEventsUseCase.findAll(req.user.sub, filter);
  }
  // Achar um evento
  @Get('events/:eventId')
  @HttpCode(HttpStatus.OK)
  async findOneEvent(
    @Request() req: AuthRequest,
    @Param('eventId') eventId: string,
  ): Promise<EventResponseDto> {
    return await this.findEventsUseCase.findOneEventByUserAndEventId(
      req.user.sub,
      eventId,
    );
  }
  // Atualizar um evento
  @Patch('events/:eventId')
  @HttpCode(HttpStatus.OK)
  async updateOneEvent(
    @Request() req: AuthRequest,
    @Param('eventId') eventId: string,
    @Body() dto: UserUpdateEventDto,
  ): Promise<EventResponseDto> {
    return await this.updateEventUseCase.execute(req.user.sub, eventId, dto);
  }
  // Deletat um evento
  @Delete('events/:eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneEvent(
    @Request() req: AuthRequest,
    @Param('eventId') eventId: string,
  ): Promise<void> {
    await this.deleteEventUseCase.execute(req.user.sub, eventId);
  }
}
