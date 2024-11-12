import { SparqlResponse } from '../../types';

export interface SparqlParser {
  parse: <T extends Record<PropertyKey, any>>(
    sparqlResponse: SparqlResponse<T>
  ) => T[];
}
