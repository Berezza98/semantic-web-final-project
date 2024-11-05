import { FastifyInstance, FastifySchema } from "fastify";
import { inject, injectable } from "inversify";
import { JSONSchemaType } from "ajv";
import { DataProvider, GetMoviesQuery, GetMoviesReply } from "../interfaces";
import { BaseController } from "../common";
import { TYPES } from "../dependencyInjectionTypes";

@injectable()
export class MovieController extends BaseController {
  constructor(@inject(TYPES.DataProvider) private dataProvider: DataProvider) {
    super();

    this.handlers = [
      this.getMovieList,
    ];
  }
  
  getMovieList(fastify: FastifyInstance) {
    const queryStringJsonSchema: JSONSchemaType<GetMoviesQuery> = {
      type: 'object',
      properties: {
        offset: { type: 'integer' },
        limit: { type: 'integer' },
      },
      required: ['limit', 'offset'],
    };

    const schema: FastifySchema = {
      querystring: queryStringJsonSchema,
    };
    
    fastify.get<{
      Querystring: GetMoviesQuery,
      Reply: GetMoviesReply,
    }>('/get-movies', { schema }, async (request, reply) => {
      const { limit, offset } = request.query;

      const movies = await this.dataProvider.getMovies({
        limit,
        offset,
      });

      return movies;
    });
  }
}