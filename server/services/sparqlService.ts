import SparqlClient from 'sparql-http-client';
import { injectable } from 'inversify';

import {
  Actor,
  DataProvider,
  DataProviderError,
  FullActorInformation,
  FullMovieInformation,
  Movie,
} from '../interfaces';

@injectable()
export class SrarqlDataProviderService implements DataProvider {
  client: SparqlClient;

  constructor() {
    this.client = new SparqlClient({
      endpointUrl: 'https://dbpedia.org/sparql',
    });
  }

  async getMovies({ limit = 10, offset = 0 } = {}): Promise<
    Movie[] | DataProviderError
  > {
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
        status: 0,
      };
    }
  }

  async getMovieActors(
    movieName: string
  ): Promise<DataProviderError | Actor[]> {
    try {
      const actors: Actor[] = [];

      console.log('getMovieActors: ', movieName);

      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT (STR(?actor_name) AS ?actor_name) ?url_name
        WHERE {
          # Вказуємо конкретний фільм, наприклад "Назва_Фільму"
          <http://dbpedia.org/resource/${movieName}> dbo:starring ?actor .
          
          # Отримуємо ім'я актора
          ?actor rdfs:label ?actor_name .
          
          # Фільтруємо за мовою, щоб отримати англійські або українські імена
          FILTER (lang(?actor_name) = "en" || lang(?actor_name) = "uk")

          BIND(STRAFTER(STR(?actor), "resource/") AS ?url_name)
        }

        LIMIT 10
      `;

      const stream = this.client.query.select(query);

      for await (const row of stream) {
        console.log(row);
        actors.push({
          name: row.actor_name.value,
          urlName: row.url_name.value,
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
        status: 0,
      };
    }
  }

  async getActorFullInformation(
    actorName: string
  ): Promise<FullActorInformation | DataProviderError> {
    try {
      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?name 
              (COALESCE(?birthDate_dbo, ?birthDate_dbp, "") AS ?birthDate)
              (COALESCE(?birthPlaceFinal_dbo, ?birthPlaceFinal_dbp, "") AS ?birthPlace)
              (COALESCE(?nationality_dbo, ?nationality_dbp, "") AS ?nationality)
              (COALESCE(?occupation_dbo, ?occupation_dbp, "") AS ?occupation)
              (COALESCE(?abstract_dbo, ?abstract_dbp, "") AS ?abstract)
        WHERE {
          # Використовуємо префікс dbr для актора
          dbr:${actorName} rdfs:label ?name .

          # OPTIONAL для кожної властивості
          OPTIONAL { dbr:${actorName} dbo:birthDate ?birthDate_dbo }
          OPTIONAL { dbr:${actorName} dbp:birthDate ?birthDate_dbp }
          
          # Обробка birthPlace: якщо URI, то беремо мітку
          OPTIONAL { dbr:${actorName} dbo:birthPlace ?birthPlace_dbo .
                    BIND(IF(isIRI(?birthPlace_dbo), ?birthPlace_dbo, "") AS ?birthPlaceURI_dbo)
                    OPTIONAL { ?birthPlaceURI_dbo rdfs:label ?birthPlaceLabel_dbo }
                    BIND(COALESCE(?birthPlaceLabel_dbo, ?birthPlace_dbo) AS ?birthPlaceFinal_dbo)
                  }
          
          OPTIONAL { dbr:${actorName} dbp:birthPlace ?birthPlace_dbp .
                    BIND(IF(isIRI(?birthPlace_dbp), ?birthPlace_dbp, "") AS ?birthPlaceURI_dbp)
                    OPTIONAL { ?birthPlaceURI_dbp rdfs:label ?birthPlaceLabel_dbp }
                    BIND(COALESCE(?birthPlaceLabel_dbp, ?birthPlace_dbp) AS ?birthPlaceFinal_dbp)
                  }

          OPTIONAL { dbr:${actorName} dbo:nationality ?nationality_dbo }
          OPTIONAL { dbr:${actorName} dbp:nationality ?nationality_dbp }
          
          OPTIONAL { dbr:${actorName} dbo:occupation ?occupation_dbo }
          OPTIONAL { dbr:${actorName} dbp:occupation ?occupation_dbp }
          
          OPTIONAL { dbr:${actorName} dbo:abstract ?abstract_dbo }
          OPTIONAL { dbr:${actorName} dbp:abstract ?abstract_dbp }

          # Фільтр для вибору англійської мови для імені та опису
          FILTER (lang(?name) = "en")
          FILTER (lang(?abstract_dbo) = "en" || !BOUND(?abstract_dbo))
          FILTER (lang(?abstract_dbp) = "en" || !BOUND(?abstract_dbp))
        }
      `;

      const stream = this.client.query.select(query);

      const actors: FullActorInformation[] = [];

      for await (const row of stream) {
        console.log(row);
        actors.push({
          name: row.name?.value || '',
          abstract: row.abstract?.value || '',
          birthDate: row.birthDate?.value || '',
          birthPlace: row.birthPlace?.value || '',
          nationality: row.nationality?.value || '',
          occupation: row.occupation?.value || '',
        });
      }

      console.log(actors);
      return actors[0];
    } catch (e) {
      console.log(e);
      // return {
      //   status: e.status,
      //   message: e.message,
      // }

      return {
        message: 'err',
        status: 0,
      };
    }
  }

  async getMovieFullInformation(
    movieName: string
  ): Promise<FullMovieInformation | DataProviderError> {
    try {
      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?title (COALESCE(?releaseDate, "") AS ?releaseDate)
                      (COALESCE(?directorName, "") AS ?director)
                      (COALESCE(?producerName, "") AS ?producer)
                      (COALESCE(?runtime, "") AS ?runtime)
                      (COALESCE(?genre, "") AS ?genre)
                      (COALESCE(?abstract, "") AS ?abstract)
        WHERE {
          # Використовуємо URI фільму
          <http://dbpedia.org/resource/${movieName}> rdfs:label ?title .

          # OPTIONAL для кожної властивості
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:releaseDate ?releaseDate }
          
          # Обробляємо випадок, коли директор є URI або рядковим значенням
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:director ?director .
                    BIND(IF(isIRI(?director), ?director, "") AS ?directorURI)
                    OPTIONAL { ?directorURI rdfs:label ?directorLabel }
                    BIND(COALESCE(?directorLabel, ?director) AS ?directorName)
                    FILTER (lang(?directorName) = "en")
                  }

          # Обробляємо випадок, коли продюсер є URI або рядковим значенням
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:producer ?producer .
                    BIND(IF(isIRI(?producer), ?producer, "") AS ?producerURI)
                    OPTIONAL { ?producerURI rdfs:label ?producerLabel }
                    BIND(COALESCE(?producerLabel, ?producer) AS ?producerName)
                    FILTER (lang(?producerName) = "en")
                  }
          
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:runtime ?runtime }
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:genre ?genre }
          OPTIONAL { <http://dbpedia.org/resource/${movieName}> dbo:abstract ?abstract }

          # Фільтруємо назву та опис для англійської мови
          FILTER (lang(?title) = "en")
          FILTER (lang(?abstract) = "en")
        }
      `;

      const stream = this.client.query.select(query);

      const movies: FullMovieInformation[] = [];

      for await (const row of stream) {
        console.log(row);
        movies.push({
          name: row.title?.value || '',
          descr: row.abstract?.value || '',
          director: row.director?.value || '',
          genre: row.birthPlace?.genre || '',
          producer: row.producer?.value || '',
          releaseDate: row.releaseDate?.value || '',
          runtime: row.runtime?.value || '',
        });
      }

      console.log(movies);
      return movies[0];
    } catch (e) {
      console.log(e);
      // return {
      //   status: e.status,
      //   message: e.message,
      // }

      return {
        message: 'err',
        status: 0,
      };
    }
  }
}
