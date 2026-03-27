import { Controller, Get, Inject, Param, Post, Request } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { type AuthRequest } from '../auth/types/auth-request';
import { FindSubscriptionPlansUseCase } from './application/usecase/find-subscription-plans.usecase';
import { SubscriptionPlanResponseDto } from './application/response/subscription-plan-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { PersonRoleEnum } from '../person-role/domain/person-role.enum';
import { CreateSubscriptionUseCase } from './application/usecase/create-subscription.usecase';
import { CreateSubscriptionResponseDto } from './application/response/create-subscription-response.dto';

@Controller('subscriptions')
@Roles(PersonRoleEnum.USER)
export class SubscriptionController {
  constructor(
    @Inject()
    private readonly findSubscriptionPlansUseCase: FindSubscriptionPlansUseCase,
    @Inject()
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase
  ) {}

  // --------------------- ROTAS PÚBLICA ------------------
  // ---- PODE PROCURAR TODOS OS PLANOS OU ESPECIFICAR UM PLANO DESEJADO ----
  // --------------------- ROTAS PÚBLICA ------------------
  @Public()
  @Get('plans')
  async findSubscriptionPlans(): Promise<SubscriptionPlanResponseDto[]> {
    return await this.findSubscriptionPlansUseCase.executeFindAll();
  }
  @Public()
  @Get('plans/:planId')
  async findSubscriptionPlan(@Param('planId') planId: string): Promise<SubscriptionPlanResponseDto> {
    return await this.findSubscriptionPlansUseCase.executeFindOne(planId);
  }

  // ---------------------- ROTAS PRIVADAS ---------------------
  // SE INSCREVER EM ALGUM PLANO
  // ---------------------- ROTAS PRIVADAS ---------------------
  @Post('plans/:planId/subscribe')
  async subscribe(
    @Request() req: AuthRequest,
    @Param('planId') planId: string
  ): Promise<CreateSubscriptionResponseDto> {
    return await this.createSubscriptionUseCase.execute(req.user.sub, planId);
  }
}
