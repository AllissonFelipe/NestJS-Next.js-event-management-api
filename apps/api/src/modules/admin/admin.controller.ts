import { Controller, Get, HttpCode, HttpStatus, Inject, Request } from '@nestjs/common';
import { PersonRoleEnum } from '../person-role/domain/person-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { type AuthRequest } from '../auth/types/auth-request';
import { FindAdminProfileUseCase } from './application/usecase/find-admin-profile.usecase';
import { AdminResponseDto } from './application/response/admin/admin-response.dto';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject()
    private readonly findAdminProfileUseCase: FindAdminProfileUseCase
  ) {}

  // PROCURAR O PROFILE DO ADMIN LOGADO
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async findAdminProfileByPersonId(@Request() req: AuthRequest): Promise<AdminResponseDto> {
    return await this.findAdminProfileUseCase.execute(req.user.sub);
  }
}
