import { FastifyInstance } from 'fastify';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  abstract handlers: ((fastify: FastifyInstance) => void)[];

  bindRoutes(fastify: FastifyInstance) {
    for (const handler of this.handlers) {
      handler.bind(this)(fastify);
    }
  }
}
