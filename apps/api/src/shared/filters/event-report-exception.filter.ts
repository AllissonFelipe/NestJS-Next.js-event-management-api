import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EventReportIsOpenError } from 'src/modules/event-reports/domain/errors/event-report-is-open.error';
import { EventReportIsResolvedError } from 'src/modules/event-reports/domain/errors/event-report-is-resolved.error';
import { EventReportIsReviewedError } from 'src/modules/event-reports/domain/errors/event-report-is-reviewed.error';

@Catch(EventReportIsResolvedError, EventReportIsReviewedError, EventReportIsOpenError)
export class EventReportExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json(message);
    }

    // Erro do status do reporte do evento ja estar resolvido
    if (exception instanceof EventReportIsResolvedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message
      });
    }
    // Erro do status do reporte do evento ja estar em revisão
    if (exception instanceof EventReportIsReviewedError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message
      });
    }
    // Erro do status do reporte estar em aberto
    if (exception instanceof EventReportIsOpenError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: exception.message
      });
    }

    // outros erros podem ser tratados aqui
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Erro interno do servidor'
    });
  }
}
