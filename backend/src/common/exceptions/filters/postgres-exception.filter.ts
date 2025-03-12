import { Catch, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { Response } from "express";
import { AbstractExceptionFilter } from "./abstract-exception.filter";

@Catch(QueryFailedError)
export class PostgresExceptionFilter extends AbstractExceptionFilter {
  handleException(exception: QueryFailedError, response: Response): void {
    const statusCode = HttpStatus.BAD_REQUEST;
    let errorMessage = "There is an error, please try again with valid data";

    // Access the `driverError` and ensure it's cast correctly
    const driverError = exception.driverError as {
      code?: string;
      detail?: string;
    }; // Cast to include code and detail properties

    if (driverError?.code) {
      errorMessage = driverError?.detail ?? errorMessage;
    }

    // Use the abstract method to create the standardized error response
    const errorResponse = this.createErrorResponse(statusCode, errorMessage);

    // Send the standardized error response
    response.status(statusCode).json(errorResponse);
  }
}
