import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', (type) => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  /**
   * Se llama cuando una variable de GraphQL se recibe del cliente.
   * @param value El valor enviado por el cliente (ej. un string ISO).
   */
  parseValue(value: string): Date {
    return new Date(value); // Convierte el string de entrada a un objeto Date
  }

  /**
   * Se llama cuando se debe enviar un valor al cliente.
   * @param value El objeto Date de nuestra lógica de negocio.
   */
  serialize(value: Date): string {
    // Si ya es una fecha, la convertimos a un string ISO
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value; // Si ya es un string, lo devolvemos tal cual
  }

  /**
   * Se llama cuando la query de GraphQL viene como un string (inline).
   * @param ast El Abstract Syntax Tree del valor.
   */
  parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      // Intenta parsear tanto strings como timestamps numéricos
      return new Date(ast.value);
    }
    return null;
  }
}