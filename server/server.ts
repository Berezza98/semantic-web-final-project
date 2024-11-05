import Fastify, { FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import { BaseController } from './common';
import { TYPES } from './dependencyInjectionTypes';

@injectable()
export class WebServer {
  private fastify: FastifyInstance = Fastify({
    logger: true
  });

  constructor (@inject(TYPES.MovieController) private movieController: BaseController) {
    this.addControllers();
  }

  private addControllers() {
    this.movieController.bindRoutes(this.fastify);
  }

  async start() {
    try {
      await this.fastify.listen({ port: 3210 })
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
  }
}