import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EventAddressNotFoundError } from 'src/modules/events/domain/errors/event-address-not-found.error';
import { EventEndDateInPastError } from 'src/modules/events/domain/errors/event-end-date-in-past.error';
import { EventInFinalStatusError } from 'src/modules/events/domain/errors/event-in-final-status.error';
import { EventInPendingStatusError } from 'src/modules/events/domain/errors/event-in-pending-status.error';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found-error';
import { EventStatusCannotBeChangedError } from 'src/modules/events/domain/errors/event-status-cannot-be-changed-error';
import { InvalidEventDateError } from 'src/modules/events/domain/errors/invalid-event-data.error';
import { InvalidEventDateRangeError } from 'src/modules/events/domain/errors/invalid-event-date-range-error';
import { NothingToUpdateError } from 'src/modules/events/domain/errors/nothing-to-update-error.error';

@Catch(
  EventNotFoundError,
  EventAddressNotFoundError,
  InvalidEventDateError,
  EventEndDateInPastError,
  InvalidEventDateRangeError,
  NothingToUpdateError,
  EventStatusCannotBeChangedError,
  EventInFinalStatusError,
  EventInPendingStatusError,
)
export class EventsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro de Evento não encontrado
    if (exception instanceof EventNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    // Erro de endereço do evento não encontrado
    if (exception instanceof EventAddressNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    // Erro de data inválida
    if (exception instanceof InvalidEventDateError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro da data final do evento menor que o presente momento
    if (exception instanceof EventEndDateInPastError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro de data final maior que inicial
    if (exception instanceof InvalidEventDateRangeError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // Erro de não haver dados para realizar o update do evento
    if (exception instanceof NothingToUpdateError) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: 422,
        message: exception.message,
      });
    }
    // erro do status do evento is final
    if (exception instanceof EventInFinalStatusError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }
    // erro do evento ainda estar in PENDING status
    if (exception instanceof EventInPendingStatusError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message,
      });
    }
    // ERRO DO STATUS DO EVENTO NÃO PODENDO SER ALTERADO
    if (exception instanceof EventStatusCannotBeChangedError) {
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
