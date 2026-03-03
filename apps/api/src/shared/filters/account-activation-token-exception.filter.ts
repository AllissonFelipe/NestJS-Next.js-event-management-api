/* eslint-disable prettier/prettier */
// src/shared/filters/domain-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ActivationTokenAlreadyUsedError } from 'src/modules/account-activation-token/domain/errors/activation-token-already-used.error';
import { ActivationTokenExpiredError } from 'src/modules/account-activation-token/domain/errors/activation-token-expired.error';
import { ActivationTokenNotFoundError } from 'src/modules/account-activation-token/domain/errors/activation-token-not-found.error';
import { ActivationTokenRequiredError } from 'src/modules/account-activation-token/domain/errors/activation-token-required.error';

@Catch( ActivationTokenRequiredError,
  ActivationTokenNotFoundError,
  ActivationTokenAlreadyUsedError,
  ActivationTokenExpiredError)
export class AccountActivationTokenExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro de token já usado
    if (exception instanceof ActivationTokenAlreadyUsedError) {
            return response.status(HttpStatus.CONFLICT).json({
            statusCode: 409,
            message: exception.message,
        });
    }

    // Erro de token já expirado
    if (exception instanceof ActivationTokenExpiredError) {
            return response.status(HttpStatus.CONFLICT).json({
            statusCode: 409,
            message: exception.message,
        });
    }

    // Erro de token não encontrado
    if (exception instanceof ActivationTokenNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
            statusCode: 404,
            message: exception.message,
        });
    }

    // Erro de token requirido
    if (exception instanceof ActivationTokenRequiredError) {
            return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: exception.message,
        });
    }

    // outros erros podem ser tratados aqui
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
    });
  }
}
