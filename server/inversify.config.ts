import { Container } from 'inversify';
import { TYPES } from './dependencyInjectionTypes';
import {
  CachingService,
  ConfigurationsService,
  HTTPClientService,
  SparqlDataProviderService,
  SparqlParserService,
} from './services';
import {
  CachingClient,
  Configurations,
  DataProvider,
  HTTPClient,
  SparqlParser,
} from './interfaces';
import { BaseController } from './common';
import { MovieController } from './controllers';
import { WebServer } from './server';

export const container = new Container();

container
  .bind<Configurations>(TYPES.Configurations)
  .to(ConfigurationsService)
  .inSingletonScope();
container
  .bind<CachingClient>(TYPES.CachingClient)
  .to(CachingService)
  .inSingletonScope();
container.bind<HTTPClient>(TYPES.HTTPClient).to(HTTPClientService);
container.bind<SparqlParser>(TYPES.SparqlParser).to(SparqlParserService);
container.bind<DataProvider>(TYPES.DataProvider).to(SparqlDataProviderService);
container.bind<BaseController>(TYPES.MovieController).to(MovieController);
container.bind<WebServer>(TYPES.WebServer).to(WebServer);
