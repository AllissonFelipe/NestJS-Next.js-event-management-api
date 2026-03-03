import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundError } from 'src/modules/user/domain/errors/user-not-found.error';
import { UserPersonIdNotFoundError } from 'src/modules/user/domain/errors/user-person-id-not-found.error';
import { UserRoleRequiredError } from 'src/modules/user/domain/errors/user-role-required.error';

@Catch(UserNotFoundError, UserRoleRequiredError, UserPersonIdNotFoundError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro do usuário não encontrado
    if (exception instanceof UserNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }
    // Erro de usuário que não possui a Role de USER
    if (exception instanceof UserRoleRequiredError) {
      return response.status(HttpStatus.FORBIDDEN).json({
        statusCode: 403,
        message: exception.message,
      });
    }
    // Erro de person id de user não encontrado
    if (exception instanceof UserPersonIdNotFoundError)
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
    });
  }
}
