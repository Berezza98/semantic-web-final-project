import SparqlClient from 'sparql-http-client';
import { injectable } from 'inversify';

import { Actor, DataProvider, DataProviderError, Movie } from "../interfaces";

@injectable()
export class SrarqlDataProviderService implements DataProvider {
  client: SparqlClient;

  constructor() {
    this.client = new SparqlClient({ endpointUrl: 'https://dbpedia.org/sparql' });
  }

  async getMovies({ limit = 10, offset = 0 } = {}): Promise<Movie[] | DataProviderError> {
      try {
        const movies: Movie[] = [];
  
        const query = `
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX dbp: <http://dbpedia.org/property/>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT ?movie ?name ?url_name
          WHERE {
            ?movie a dbo:Film ;
                   rdfs:label ?name .
          
            FILTER (lang(?name) = "uk" || lang(?name) = "en")

            BIND(STRAFTER(STR(?movie), "resource/") AS ?url_name)
          }
  
          LIMIT ${limit}
          OFFSET ${offset}
        `;
  
        const stream = this.client.query.select(query);
  
        for await (const row of stream) {
          movies.push({
            name: row.name.value,
            urlName: row.url_name.value,
          });
        }
  
        return movies;
      } catch (e) {
        console.log(e);
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

  async getMovieActors(movieName: string): Promise<DataProviderError | Actor[]> {
    try {
      const actors: Actor[] = [];

      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT STR(?actor_name) AS ?actor_name
        WHERE {
          # Вказуємо конкретний фільм, наприклад "Назва_Фільму"
          dbr:${movieName} dbo:starring ?actor .
          
          # Отримуємо ім'я актора
          ?actor rdfs:label ?actor_name .
          
          # Фільтруємо за мовою, щоб отримати англійські або українські імена
          FILTER (lang(?actor_name) = "en" || lang(?actor_name) = "uk")
        }

        LIMIT 10
      `;

      const stream = this.client.query.select(query);

      for await (const row of stream) {
        console.log(row);
        actors.push({
          name: row.actor_name.value,
        });
      }


      return actors;
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