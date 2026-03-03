/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AdminIdNotFoundError } from "src/modules/admin/domain/errors/admin-id-not-found.error";
import { Response } from 'express';
import { AdminNotFoundError } from "src/modules/admin/domain/errors/admin-not-found.error";
import { AdminRoleRequiredError } from "src/modules/admin/domain/errors/admin-role-required.error";
import { UserPersonIdNotFoundError } from "src/modules/admin/domain/errors/admin-user-person-id-not-found.error";
import { EventIdNotFoundError } from "src/modules/admin/domain/errors/admin-event-id-not-found.error";
import { EventNotFoundError } from "src/modules/admin/domain/errors/admin-event-not-found.error";
import { AdminInvalidUpdatePayloadError } from "src/modules/admin/domain/errors/admin-invalid-update-payload.error";

@Catch(AdminIdNotFoundError, AdminNotFoundError, AdminRoleRequiredError, UserPersonIdNotFoundError, EventIdNotFoundError, EventNotFoundError, AdminInvalidUpdatePayloadError)
export class AdminExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        // SE FOR ERRO HTTP DO NestJS, APENAS REPASSA
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const message = exception.getResponse();
            return response.status(status).json(message);
        }

        // ERRO DE ID DE ADMIN NÃO ENCONTRADO
        if (exception instanceof AdminIdNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // ERRO DE ADMIN NÃO ENCONTRADO
        if (exception instanceof AdminNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // ERRO DE ROLE DE ADMIN REQUIRIDO
        if (exception instanceof AdminRoleRequiredError) {
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: 403,
                message: exception.message,
            });
        }
        // ERRO DE USER(PERSON) ID NÃO ENCONTRADO
        if (exception instanceof UserPersonIdNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // ERRO DE EVENT ID NÃO ENCONTRADO - EventIdNotFoundError
        if (exception instanceof EventIdNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // ERRO DE EVENT NÃO ENCONTRADO - EventNotFoundError
        if (exception instanceof EventNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                message: exception.message,
            });
        }
        // ERRO DE UPDATE PAYLOAD VAZIO
        if (exception instanceof AdminInvalidUpdatePayloadError) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: exception.message,
            })
        }

        /* SE NÃO PASSAR POR NENHUM ERRO PERSONALIZADO - RETORNA ERRO 
        INTERNO - STATUS CODE: 500 */
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            message: 'Erro interno do servidor',
        })
    }
}