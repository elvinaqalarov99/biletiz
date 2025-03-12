import { Catch, HttpException } from "@nestjs/common";
import { Response } from "express";
import { AbstractExceptionFilter } from "./abstract-exception.filter";

@Catch(HttpException)
export class HTTPExceptionFilter extends AbstractExceptionFilter {
  handleException(exception: HttpException, response: Response): void {
    const statusCode = exception.getStatus();
    const message = exception.message;

    const errorResponse = this.createErrorResponse(statusCode, message);

    // Send the standardized error response
    response.status(statusCode).json(errorResponse);
  }
}
