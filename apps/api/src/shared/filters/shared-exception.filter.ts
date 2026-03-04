/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { PersonIdNotFoundError } from "../errors/person-id-not-found.error";
import { EmptyUpdatePayloadError } from "../errors/empty-update-payload.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { PersonNotFoundError } from "../errors/person-not-found.error";
import { PersonRoleNotAllowedError } from "../errors/person-role-not-allowed.error";
import { EventIdNotFoundError } from "../errors/event-id-not-found.error";
import { EventNotFoundError } from "../errors/event-not-found.error";
import { EventParticipantNotFoundError } from "../errors/event-participant-not-found-error";
import { EventAddressNotFoundError } from "../errors/event-address-not-found-error";
import { EventAlreadyReportedByUser } from "../errors/event-already-reported-by-user.error";
import { EventReportNotFoundError } from "../errors/event-report-not-found.error";

@Catch(
    PersonIdNotFoundError,
    EmptyUpdatePayloadError,
    UserNotFoundError,
    PersonNotFoundError,
    PersonRoleNotAllowedError,
    EventIdNotFoundError,
    EventNotFoundError,
    EventParticipantNotFoundError,
    EventAddressNotFoundError,
    EventAlreadyReportedByUser,
    EventReportNotFoundError,
)
export class SharedExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        // 1️⃣ Se for erro HTTP do NestJS, apenas repassa
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const message = exception.getResponse();
            return response.status(status).json(message);
        }

        // erro de personId não encontrado
        if (exception instanceof PersonIdNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message
            })
        }
        // erro de person não encontrado
        if (exception instanceof PersonNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // erro de person.role não permitido
        if (exception instanceof PersonRoleNotAllowedError) {
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: 403,
                message: exception.message,
            })
        }
        // erro de eventId não encontrado
        if (exception instanceof EventIdNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            })
        }
        // erro de evento não encontrado
        if (exception instanceof EventNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            })
        }
        // erro de event participant não encontrado
        if (exception instanceof EventParticipantNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            })
        }
        // erro de nenhum campo para atualização preenchido
        if (exception instanceof EmptyUpdatePayloadError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message
            })
        }
        // erro de endereço do evento não encontrado
        if (exception instanceof EventAddressNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            })
        }
        // ERRO DE USUÁRIO NÃO ENCONTRADO
        if (exception instanceof UserNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message
            })
        }
        // Erro de evento ja reportado pelo usuário
        if (exception instanceof EventAlreadyReportedByUser) {
            return response.status(HttpStatus.CONFLICT).json({
                statuscode: 409,
                message: exception.message,
            });
        }
        // Erro de reporte de evento não encontrado
        if (exception instanceof EventReportNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statuscode: 404,
                message: exception.message,
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            message: 'Erro interno do servidor',
        });
    }
}