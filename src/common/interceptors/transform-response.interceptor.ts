import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { priceToReais } from '../transformers/price.transformer';

// Define typed response item structure
export interface ResponseItem {
  [key: string]: unknown;
  id?: number;
  price?: number;
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        return this.transformData(data);
      }),
    );
  }

  private transformData(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map(item => this.transformItem(item));
    }
    return this.transformItem(data);
  }

  private transformItem(item: unknown): unknown {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const result = { ...item } as Record<string, unknown>;

    // Remove internal ID
    if ('id' in result) {
      delete result.id;
    }

    // Transform price from cents to reais
    if ('price' in result && typeof result.price === 'number') {
      result.price = priceToReais(result.price);
    }

    // Process nested objects
    for (const key in result) {
      if (
        Object.prototype.hasOwnProperty.call(result, key) &&
        result[key] &&
        typeof result[key] === 'object'
      ) {
        if (Array.isArray(result[key])) {
          result[key] = (result[key] as Array<unknown>).map(nestedItem =>
            this.transformItem(nestedItem),
          );
        } else {
          result[key] = this.transformItem(result[key]);
        }
      }
    }

    return result;
  }
}
