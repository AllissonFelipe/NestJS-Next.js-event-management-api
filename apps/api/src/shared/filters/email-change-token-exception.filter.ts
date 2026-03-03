import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailChangeTokenAlreadyUsedError } from 'src/modules/email-change-token/domain/errors/email-token-change-already-used.error';
import { EmailChangeTokenExpiredError } from 'src/modules/email-change-token/domain/errors/email-token-change-expired.error';
import { EmailChangeTokenNotFoundError } from 'src/modules/email-change-token/domain/errors/email-token-change-not-found.error';

@Catch(
  EmailChangeTokenNotFoundError,
  EmailChangeTokenExpiredError,
  EmailChangeTokenAlreadyUsedError,
)
export class EmailChageTokenExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro de email change token não encontrado
    if (exception instanceof EmailChangeTokenNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }
    // Erro de email change token expirado
    if (exception instanceof EmailChangeTokenExpiredError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }
    // Erro de email change token ja usado
    if (exception instanceof EmailChangeTokenAlreadyUsedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
    });
  }
}
