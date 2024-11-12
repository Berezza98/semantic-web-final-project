import { injectable } from 'inversify';
import { Configurations } from '../interfaces';

@injectable()
export class ConfigurationsService implements Configurations {
  baseUrl: string;

  constructor() {
    this.baseUrl =
      'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on&query=';
  }
}
