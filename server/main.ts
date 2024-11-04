import { sparqlDataProviderService } from './services';
import { WebServer } from './server';

async function main() {
  await new WebServer(sparqlDataProviderService).start();
}

main();