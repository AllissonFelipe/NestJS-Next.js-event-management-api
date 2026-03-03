/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateAccountUseCase } from './application/create-account/create-account.usecase';
import { CreateAccountDto } from './application/create-account/create-account.dto';
import { Public } from './decorators/public.decorator';
import { ActivateAccountUseCase } from './application/activate-account/activate-account.usecase';
import { ResendActivationEmailDto } from './application/activate-account/resend-activation-email.dto';
import { ForgotPasswordUseCase } from './application/password-reset/forgot-password.usecase';
import { ForgotPasswordDto } from './application/password-reset/forgot-password.dto';
import { ResetPasswordDto } from './application/password-reset/reset-password.dto';
import { ResetPasswordUseCase } from './application/password-reset/reset-password.usecase';
import { LoginAccountDto } from './application/login-account/login-account.dto';
import { LoginAccountUseCase } from './application/login-account/login-account.usecase';
import { AuthResponse } from './application/login-account/auth.response';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject()
    private readonly createUseCase: CreateAccountUseCase,
    @Inject()
    private readonly activateAccountUseCase: ActivateAccountUseCase,
    @Inject()
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @Inject()
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @Inject()
    private readonly loginAccountUseCase: LoginAccountUseCase,
  ) {}

  // CRIAR CONTA
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() dto: CreateAccountDto) {
    await this.createUseCase.execute(dto);
    return {
      message: 'Conta criada com sucesso. Uma mensagem de ativação foi enviado para o seu email.'
    }
  }

  // ATIVAR CONTA
  @Get('activate-account/:token')
  async activateAccount(@Param('token') token: string) {
    await this.activateAccountUseCase.executeActivateAccount(token);
    return {
      message: 'Conta ativada com sucesso.',
    };
  }
  // REENVIAR EMAIL DE ATIVAÇÃO DE CONTA
  @Post('resend-activation-email')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async resendActivationEmail(@Body() dto: ResendActivationEmailDto) {
    await this.activateAccountUseCase.executeResendActivationEmail(dto.email);
    return {
      message:
        'Se conta estiver inativa e email existir, um email de ativação será logo enviado',
    };
  }

  // LOGIN
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginAccountDto): Promise<AuthResponse> {
    return await this.loginAccountUseCase.executeLogin(dto.email, dto.password);
  }

  // FORGOT PASSWORD
  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.executeForgotPassword(dto.email);
    return {
      message:
        'Se conta com este email existir, um email de alteração da senha será logo enviado',
    };
  }
  // RESET PASSWORD
  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.executeResetPassword(
      token,
      dto.newPassword,
    );
    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
