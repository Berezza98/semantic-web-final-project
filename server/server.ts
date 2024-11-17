import Fastify, { FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import { BaseController } from './common';
import { TYPES } from './dependencyInjectionTypes';
import { CachingClient } from './interfaces';

@injectable()
export class WebServer {
  private fastify: FastifyInstance = Fastify({
    // logger: true
  });

  constructor(
    @inject(TYPES.MovieController) private movieController: BaseController,
    @inject(TYPES.CachingClient) private cachingClient: CachingClient
  ) {
    this.addControllers();
  }

  private addControllers() {
    this.movieController.bindRoutes(this.fastify);
  }

  async start() {
    try {
      console.log('PORT: ', parseInt(process.env.PORT));
      await this.cachingClient.connect();
      await this.fastify.listen({
        port: parseInt(process.env.PORT),
        host: '0.0.0.0',
      });
    } catch (err) {
      console.log("Can't start: ", err);
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}
