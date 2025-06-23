import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';

// Mapeo de códigos de estado HTTP a códigos de estado gRPC
const httpToRpcStatus: Record<number, number> = {
  400: status.INVALID_ARGUMENT, // Bad Request
  401: status.UNAUTHENTICATED,  // Unauthorized
  403: status.PERMISSION_DENIED, // Forbidden
  404: status.NOT_FOUND,         // Not Found
  409: status.ALREADY_EXISTS,    // Conflict
  // ... puedes añadir más mapeos si los necesitas
};

@Injectable()
export class HttpToRpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // Si no es una excepción HTTP de NestJS, la relanzamos tal cual.
        if (!(err instanceof HttpException)) {
          return throwError(() => new RpcException(err.message));
        }

        // Es una excepción HTTP, la convertimos a RpcException
        const httpStatus = err.getStatus();
        const rpcStatus = httpToRpcStatus[httpStatus] || status.UNKNOWN;

        // Creamos una RpcException con el mensaje y el código gRPC
        const rpcException = new RpcException({
          code: rpcStatus,
          message: err.message,
        });
        
        return throwError(() => rpcException);
      }),
    );
  }
}