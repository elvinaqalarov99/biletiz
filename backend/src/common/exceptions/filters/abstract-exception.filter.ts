import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Response, Request } from "express";

export abstract class AbstractExceptionFilter implements ExceptionFilter {
  // Abstract method to handle the exception
  abstract handleException(
    exception: unknown,
    response: Response,
    request: Request,
  ): void;

  // Define the structure of the standardized error response
  protected createErrorResponse(statusCode: number, message: string) {
    return {
      statusCode,
      message,
    };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    this.handleException(exception, response, request);
  }
}
