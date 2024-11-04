import { JSONSchemaType } from 'ajv';
import Fastify, { FastifyInstance, FastifySchema } from 'fastify';
import { DataProvider, GetMoviesQuery, GetMoviesReply } from './interfaces';

export class WebServer {
  fastify: FastifyInstance = Fastify({
    logger: true
  });

  dataProvider: DataProvider;

  constructor (dataProvider: DataProvider) {
    this.dataProvider = dataProvider;

    this.addHandlers();
  }

  addHandlers() {
    this.fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    });

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
    
    this.fastify.get<{
      Querystring: GetMoviesQuery,
      Reply: GetMoviesReply,
    }>('/get-movies', { schema }, async (request, reply) => {
      const { limit, offset } = request.query;

      console.log(request.query);

      const movies = await this.dataProvider.getMovies({
        limit,
        offset,
      });

      return movies;
    });
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