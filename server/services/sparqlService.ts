import SparqlClient from 'sparql-http-client';

import { DataProvider, DataProviderError, Movie } from "../interfaces";

class SrarqlDataProviderService implements DataProvider {
  client: SparqlClient;

  constructor() {
    this.client = new SparqlClient({ endpointUrl: 'https://dbpedia.org/sparql' });
  }

  async getMovies({ limit = 10, offset = 0 } = {}): Promise<Movie[] | DataProviderError> {
      try {
        const movies: Movie[] = [];
  
        const query = `
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX dbr: <http://dbpedia.org/resource/>
          PREFIX dbp: <http://dbpedia.org/property/>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          
          SELECT ?movie_name ?movie_comment ?director_name
          WHERE {
            ?movie a dbo:Film.
            ?movie foaf:name ?movie_name.
            ?movie rdfs:comment ?movie_comment.
            ?movie dbo:director ?director.
            ?director foaf:name ?director_name.
          
            FILTER (lang(?movie_name) = "en")
            FILTER (lang(?movie_comment) = "en")
            FILTER (lang(?director_name) = "en")
          }
  
          LIMIT ${limit}
          OFFSET ${offset}
        `;
  
        const stream = this.client.query.select(query);
  
        for await (const row of stream) {
          console.log(row);
          movies.push({
            name: row.movie_name.value,
            description: row.movie_comment.value,
            director: row.director_name.value,
          });
        }

  
        return movies;
      } catch (e) {
        // return {
        //   status: e.status,
        //   message: e.message,
        // }

        return {
          message: 'err',
          status: 0
        };
      }
  }
}

export const sparqlDataProviderService = new SrarqlDataProviderService();