import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PasswordResetTokenAlreadyUsedError } from 'src/modules/password-reset-token/domain/errors/reset-token-already-used.error';
import { ResetPasswordTokenExpiredError } from 'src/modules/password-reset-token/domain/errors/reset-token-expired.error';
import { PasswordResetTokenNotFoundError } from 'src/modules/password-reset-token/domain/errors/reset-token-not-found.error';
import { Response } from 'express';

@Catch(
  PasswordResetTokenAlreadyUsedError,
  ResetPasswordTokenExpiredError,
  PasswordResetTokenNotFoundError,
)
export class PasswordResetTokenExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro de password reset já usado
    if (exception instanceof PasswordResetTokenAlreadyUsedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    // Erro de token já expirado
    if (exception instanceof ResetPasswordTokenExpiredError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    // Erro de token não encontrado
    if (exception instanceof PasswordResetTokenNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }
    // outros erros podem ser tratados aqui

    // e nenhum erro acima ocorrer - lançar internal_server_error / code: 500
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
    });
  }
}
