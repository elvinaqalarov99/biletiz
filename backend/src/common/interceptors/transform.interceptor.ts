import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
// import { plainToInstance } from "class-transformer";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Transform the response using plainToClass globally
        // return plainToInstance(data.constructor, data, {
        //   excludeExtraneousValues: true,
        // });
        return data;
      }),
    );
  }
}
