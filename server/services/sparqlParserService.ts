import { injectable } from 'inversify';
import { SparqlParser } from '../interfaces';
import { SparqlResponse } from '../types';

@injectable()
export class SparqlParserService implements SparqlParser {
  parse<T extends Record<keyof T, string>>(
    sparqlResponse: SparqlResponse<T>
  ): T[] {
    const results: T[] = [];

    console.log('PARSE');
    console.log(sparqlResponse);
    for (const binding of sparqlResponse.results.bindings) {
      const obj = sparqlResponse.head.vars.reduce((acc, key) => {
        acc[key] = binding[key].value as T[keyof T];

        return acc;
      }, {} as T);

      results.push(obj);
    }

    return results;
  }
}
