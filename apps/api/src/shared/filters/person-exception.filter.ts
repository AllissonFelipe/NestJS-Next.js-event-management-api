/* eslint-disable prettier/prettier */
// src/shared/filters/domain-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AccountAlreadyActivatedError } from 'src/modules/person/domain/errors/account-already-activated.error';
import { AccountNotActivatedError } from 'src/modules/person/domain/errors/account-not-activated.error';
import { CannotReuseSamePasswordError } from 'src/modules/person/domain/errors/cannot-reuse-same-password-error';
import { CpfAlreadyInUseError } from 'src/modules/person/domain/errors/cpf-already-in-use.error';
import { EmailAlreadyInUseError } from 'src/modules/person/domain/errors/email-already-In-use.error';
import { InvalidCredentialsError } from 'src/modules/person/domain/errors/invalid-credential.error';
import { InvalidPasswordError } from 'src/modules/person/domain/errors/invalid-password.error';
import { PasswordChangeDataMissingError } from 'src/modules/person/domain/errors/password-change-data-missing.error';
import { PersonNotFoundError } from 'src/modules/person/domain/errors/person-not-found.error';


@Catch(
  AccountAlreadyActivatedError,
  AccountNotActivatedError,
  CpfAlreadyInUseError,
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  InvalidPasswordError,
  PasswordChangeDataMissingError,
  PersonNotFoundError,
  CannotReuseSamePasswordError,
)
export class PersonExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro de pessoas não encontrada
    if (exception instanceof PersonNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    // Erro de Senha antiga e nova senha são obrigatórias no update person
    if (exception instanceof PasswordChangeDataMissingError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro de senha inválida
    if (exception instanceof InvalidPasswordError) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: exception.message,
      });
    }

    // Erro de credenciais inválidas
    if (exception instanceof InvalidCredentialsError) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: exception.message,
      });
    }

    // Erro de email já em uso
    if (exception instanceof EmailAlreadyInUseError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro de cpf já em uso
    if (exception instanceof CpfAlreadyInUseError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro de conta não ativada
    if (exception instanceof AccountNotActivatedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    // Erro de conta já ativada
    if (exception instanceof AccountAlreadyActivatedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    // Erro de nova senha ser igual a antiga
    if (exception instanceof CannotReuseSamePasswordError) {
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
