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
  Request,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { PersonRoleEnum } from 'src/modules/person-role/domain/person-role.enum';
import { FiltersOfUserDto } from '../application/dtos/filters-of-user.dto';
import { PaginationResultInterface } from 'src/shared/interfaces/pagination-result.interface';
import { UserResponseDto } from '../application/response/user/user-response.dto';
import { type AuthRequest } from 'src/modules/auth/types/auth-request';
import { AdminUpdateUserDto } from '../application/dtos/update-user.dto';
import { AdminFindUsersUseCase } from '../application/usecase/user/admin-find-users.usecase';
import { AdminUpdateUserUseCase } from '../application/usecase/user/update-user.usecase';
import { AdminDeleteUserUseCase } from '../application/usecase/user/delete-user.usecase';

@Roles(PersonRoleEnum.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(
    @Inject()
    private readonly adminFindUsersUseCase: AdminFindUsersUseCase,
    @Inject()
    private readonly adminUpdateUserUseCase: AdminUpdateUserUseCase,
    @Inject()
    private readonly adminDeleteUserUseCase: AdminDeleteUserUseCase,
  ) {}

  // ---------- ÁREA DE GERENCIAMENTO DO USUÁRIO ---------------
  // ---------- ÁREA DE GERENCIAMENTO DO USUÁRIO ---------------
  // PROCURAR TODOS OS USERS COM FILTROS
  @Get()
  @HttpCode(HttpStatus.OK)
  async listOfUsersWithFilters(
    @Request() req: AuthRequest,
    @Query() filtersDto: FiltersOfUserDto,
  ): Promise<PaginationResultInterface<UserResponseDto>> {
    return await this.adminFindUsersUseCase.withFilters(
      req.user.sub,
      filtersDto,
    );
  }
  // PROCURAR USER byUserPersonId
  @Get(':userPersonId')
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
  ): Promise<UserResponseDto> {
    return await this.adminFindUsersUseCase.byId(req.user.sub, userPersonId);
  }
  // ATUALIZAR UM USUÁRIO byUserPersonId
  @Patch(':userPersonId')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.adminUpdateUserUseCase.execute(
      req.user.sub,
      userPersonId,
      dto,
    );
  }
  // DELETAR UM USUÁRIO byUserPersonId
  @Delete(':userPersonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Request() req: AuthRequest,
    @Param('userPersonId') userPersonId: string,
  ): Promise<void> {
    await this.adminDeleteUserUseCase.execute(req.user.sub, userPersonId);
  }
}
