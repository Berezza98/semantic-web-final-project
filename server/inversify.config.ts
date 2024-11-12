import { Container } from 'inversify';
import { TYPES } from './dependencyInjectionTypes';
import {
  ConfigurationsService,
  HTTPClientService,
  SparqlDataProviderService,
  SparqlParserService,
} from './services';
import {
  Configurations,
  DataProvider,
  HTTPClient,
  SparqlParser,
} from './interfaces';
import { BaseController } from './common';
import { MovieController } from './controllers';
import { WebServer } from './server';

export const container = new Container();

container.bind<Configurations>(TYPES.Configurations).to(ConfigurationsService);
container.bind<HTTPClient>(TYPES.HTTPClient).to(HTTPClientService);
container.bind<SparqlParser>(TYPES.SparqlParser).to(SparqlParserService);
container.bind<DataProvider>(TYPES.DataProvider).to(SparqlDataProviderService);
container.bind<BaseController>(TYPES.MovieController).to(MovieController);
container.bind<WebServer>(TYPES.WebServer).to(WebServer);
