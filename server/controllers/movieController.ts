import { FastifyInstance, FastifySchema } from 'fastify';
import { inject, injectable } from 'inversify';
import { JSONSchemaType } from 'ajv';
import {
  CachingClient,
  DataProvider,
  GetActorFullInformationQuery,
  GetActorFullInformationReply,
  GetMovieActorsQuery,
  GetMovieActorsReply,
  GetMoviesQuery,
  GetMoviesReply,
  Movie,
} from '../interfaces';
import { BaseController } from '../common';
import { TYPES } from '../dependencyInjectionTypes';
import { setTimeout } from 'timers/promises';
import { isDataProviderError } from '../guards';
import {
  GetMovieFullInformationQuery,
  GetMovieFullInformationReply,
} from '../interfaces/server/GetMovieFullInformation';

@injectable()
export class MovieController extends BaseController {
  handlers: ((fastify: FastifyInstance) => void)[];

  constructor(
    @inject(TYPES.DataProvider) private dataProvider: DataProvider,
    @inject(TYPES.CachingClient) private cachingClient: CachingClient
  ) {
    super();

    this.handlers = [
      this.getMovieList,
      this.getMovieActors,
      this.getActorFullInformation,
      this.getMovieFullInformation,
    ];
  }

  async getMovieList(fastify: FastifyInstance) {
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
      Querystring: GetMoviesQuery;
      Reply: GetMoviesReply;
    }>('/get-movies', { schema }, async (request, reply) => {
      const cache = await this.cachingClient.get<Movie[]>(request.url);

      if (cache) return cache;

      const { limit, offset } = request.query;

      const movies = await this.dataProvider.getMovies({
        limit,
        offset,
      });

      await setTimeout(5000);

      if (isDataProviderError(movies)) reply.code(400);

      await this.cachingClient.set(request.url, movies);

      return movies;
    });
  }

  async getMovieActors(fastify: FastifyInstance) {
    const queryStringJsonSchema: JSONSchemaType<GetMovieActorsQuery> = {
      type: 'object',
      properties: {
        movieUrlName: { type: 'string' },
      },
      required: ['movieUrlName'],
    };

    const schema: FastifySchema = {
      querystring: queryStringJsonSchema,
    };

    fastify.get<{
      Querystring: GetMovieActorsQuery;
      Reply: GetMovieActorsReply;
    }>('/get-movie-actors', { schema }, async (request, reply) => {
      const { movieUrlName } = request.query;

      const actors = await this.dataProvider.getMovieActors(movieUrlName);

      await setTimeout(500);

      if (isDataProviderError(actors)) reply.code(400);

      return actors;
    });
  }

  async getActorFullInformation(fastify: FastifyInstance) {
    const queryStringJsonSchema: JSONSchemaType<GetActorFullInformationQuery> =
      {
        type: 'object',
        properties: {
          actorUrlName: { type: 'string' },
        },
        required: ['actorUrlName'],
      };

    const schema: FastifySchema = {
      querystring: queryStringJsonSchema,
    };

    fastify.get<{
      Querystring: GetActorFullInformationQuery;
      Reply: GetActorFullInformationReply;
    }>('/get-actor', { schema }, async (request, reply) => {
      const { actorUrlName } = request.query;

      const actorInfo = await this.dataProvider.getActorFullInformation(
        actorUrlName
      );

      await setTimeout(500);

      if (isDataProviderError(actorInfo)) reply.code(400);

      return actorInfo;
    });
  }

  async getMovieFullInformation(fastify: FastifyInstance) {
    const queryStringJsonSchema: JSONSchemaType<GetMovieFullInformationQuery> =
      {
        type: 'object',
        properties: {
          movieUrlName: { type: 'string' },
        },
        required: ['movieUrlName'],
      };

    const schema: FastifySchema = {
      querystring: queryStringJsonSchema,
    };

    fastify.get<{
      Querystring: GetMovieFullInformationQuery;
      Reply: GetMovieFullInformationReply;
    }>('/get-movie', { schema }, async (request, reply) => {
      const { movieUrlName } = request.query;

      const movieInfo = await this.dataProvider.getMovieFullInformation(
        movieUrlName
      );

      await setTimeout(500);

      if (isDataProviderError(movieInfo)) reply.code(400);

      return movieInfo;
    });
  }
}
