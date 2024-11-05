import 'reflect-metadata';

import { TYPES } from './dependencyInjectionTypes';
import { container } from './inversify.config';
import { WebServer } from './server';

async function main() {
  const webServer = container.get<WebServer>(TYPES.WebServer);

  webServer.start();
}

main();