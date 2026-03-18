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
  Request,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import { AdminCreateSubscriptionPlanUseCase } from '../application/usecase/subscription-plans/create-subscription-plan.usecase';
import { AdminFindSubscriptionPlanUseCase } from '../application/usecase/subscription-plans/find-subscription-plan.usecase';
import { AdminUpdateSubscriptionPlanUseCase } from '../application/usecase/subscription-plans/update-subscription-plan.usecase';
import { AdminDeleteSubscriptionPlanUseCase } from '../application/usecase/subscription-plans/delete-subscription-plan.usecase';
import { AdminUpdateStatusSubscriptionPlanUseCase } from '../application/usecase/subscription-plans/update-status-subscription-plan.usecase';
import { type AuthRequest } from 'src/modules/auth/types/auth-request';
import { AdminSubscriptionPlanResponseDto } from '../application/response/subscription-plan/admin-subscription-plan-response.dto';
import { CreateSubscriptionPlanDto } from '../application/dtos/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../application/dtos/update-subscription-plan.dto';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin/subscriptions')
export class AdminSubscriptionPlansController {
  constructor(
    @Inject()
    private readonly adminCreateSubscriptionPlanUseCase: AdminCreateSubscriptionPlanUseCase,
    @Inject()
    private readonly adminFindSubscriptionPlanUseCase: AdminFindSubscriptionPlanUseCase,
    @Inject()
    private readonly adminUpdateSubscriptionPlanUseCase: AdminUpdateSubscriptionPlanUseCase,
    @Inject()
    private readonly adminUpdateStatusSubscriptionPlanUseCase: AdminUpdateStatusSubscriptionPlanUseCase,
    @Inject()
    private readonly adminDeleteSubscriptionPlanUseCase: AdminDeleteSubscriptionPlanUseCase,
  ) {}

  // ------------ ÁREA DE GERENCIAMENTO DOS PLANOS DE INSCRIÇÃO -------------
  // ------------ ÁREA DE GERENCIAMENTO DOS PLANOS DE INSCRIÇÃO -------------
  // CRIAR UM PLANO DE INSCRIÇÃO
  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  async createSubscriptionPlan(
    @Request() req: AuthRequest,
    @Body() dto: CreateSubscriptionPlanDto,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    return await this.adminCreateSubscriptionPlanUseCase.execute(
      req.user.sub,
      dto,
    );
  }
  // ACHAR TODOS OS PLANOS DE INSCRIÇÃO
  @Get('plans')
  @HttpCode(HttpStatus.OK)
  async findSubscriptionsPlans(
    @Request() req: AuthRequest,
  ): Promise<AdminSubscriptionPlanResponseDto[]> {
    return await this.adminFindSubscriptionPlanUseCase.executeFindAll(
      req.user.sub,
    );
  }
  // ACHAR UM PLANO DE INSCRIÇÃO
  @Get('plans/:subscriptionPlanId')
  @HttpCode(HttpStatus.OK)
  async findOneSubscriptionPlan(
    @Request() req: AuthRequest,
    @Param('subscriptionPlanId') subscriptionPlanId: string,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    return await this.adminFindSubscriptionPlanUseCase.executeFindOne(
      req.user.sub,
      subscriptionPlanId,
    );
  }
  // ATUALIZAR UM PLANO DE INSCRIÇÃO
  @Patch('plans/:subscriptionPlanId')
  @HttpCode(HttpStatus.OK)
  async updateSubscriptionPlan(
    @Request() req: AuthRequest,
    @Param('subscriptionPlanId') subscriptionPlanId: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    return await this.adminUpdateSubscriptionPlanUseCase.execute(
      req.user.sub,
      subscriptionPlanId,
      dto,
    );
  }
  // ATIVAR UM PLANO DE INSCRIÇÃO
  @Patch('plans/:subscriptionPlanId/activate')
  @HttpCode(HttpStatus.OK)
  async activateSubscriptionPlan(
    @Request() req: AuthRequest,
    @Param('subscriptionPlanId') subscriptionPlanId: string,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    return await this.adminUpdateStatusSubscriptionPlanUseCase.executeActivate(
      req.user.sub,
      subscriptionPlanId,
    );
  }
  // DESATIVAR UM PLANO DE INSCRIÇÃO
  @Patch('plans/:subscriptionPlanId/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateSubscriptionPlan(
    @Request() req: AuthRequest,
    @Param('subscriptionPlanId') subscriptionPlanId: string,
  ): Promise<AdminSubscriptionPlanResponseDto> {
    return await this.adminUpdateStatusSubscriptionPlanUseCase.executeDeactivate(
      req.user.sub,
      subscriptionPlanId,
    );
  }
  // DELETAR UM PLANO DE INSCRIÇÃO
  @Delete('plans/:subscriptionPlanId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubscriptionPlan(
    @Request() req: AuthRequest,
    @Param('subscriptionPlanId') subscriptionPlanId: string,
  ): Promise<void> {
    await this.adminDeleteSubscriptionPlanUseCase.execute(
      req.user.sub,
      subscriptionPlanId,
    );
  }
}
