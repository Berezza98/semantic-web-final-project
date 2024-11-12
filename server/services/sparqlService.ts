import { inject, injectable } from 'inversify';

import {
  Actor,
  DataProvider,
  DataProviderError,
  FullActorInformation,
  FullMovieInformation,
  HTTPClient,
  Movie,
  SparqlParser,
} from '../interfaces';
import { TYPES } from '../dependencyInjectionTypes';
import { SparqlResponse } from '../types';

@injectable()
export class SparqlDataProviderService implements DataProvider {
  constructor(
    @inject(TYPES.HTTPClient) private client: HTTPClient,
    @inject(TYPES.SparqlParser) private sparqlParser: SparqlParser
  ) {}

  async getMovies({ limit = 10, offset = 0 } = {}): Promise<
    Movie[] | DataProviderError
  > {
    try {
      const query = `
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX dbp: <http://dbpedia.org/property/>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT ?movie ?name ?urlName
          WHERE {
            ?movie a dbo:Film ;
                   rdfs:label ?name .
          
            FILTER (lang(?name) = "uk" || lang(?name) = "en")

            BIND(STRAFTER(STR(?movie), "resource/") AS ?urlName)
          }
  
          LIMIT ${limit}
          OFFSET ${offset}
        `;

      const moviesSparql = await this.client.get<SparqlResponse<Movie>>(
        '',
        query
      );
      const movies = this.sparqlParser.parse(moviesSparql);

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
      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT (STR(?actor_name) AS ?name) ?urlName
        WHERE {
          # Вказуємо конкретний фільм, наприклад "Назва_Фільму"
          <http://dbpedia.org/resource/${movieName}> dbo:starring ?actor .
          
          # Отримуємо ім'я актора
          ?actor rdfs:label ?actor_name .
          
          # Фільтруємо за мовою, щоб отримати англійські або українські імена
          FILTER (lang(?actor_name) = "en" || lang(?actor_name) = "uk")

          BIND(STRAFTER(STR(?actor), "resource/") AS ?urlName)
        }

        LIMIT 10
      `;

      const actorsSparql = await this.client.get<SparqlResponse<Actor>>(
        '',
        query
      );

      const actors = this.sparqlParser.parse(actorsSparql);

      return actors;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        const entries = Object.entries(e);
        console.log(entries);
      }

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

      const fullInformationSparql = await this.client.get<
        SparqlResponse<FullActorInformation>
      >('', query);
      const fullInformation = this.sparqlParser.parse(fullInformationSparql);

      return fullInformation[0];
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

        SELECT ?name (COALESCE(?releaseDate, "") AS ?releaseDate)
                      (COALESCE(?directorName, "") AS ?director)
                      (COALESCE(?producerName, "") AS ?producer)
                      (COALESCE(?runtime, "") AS ?runtime)
                      (COALESCE(?genre, "") AS ?genre)
                      (COALESCE(?abstract, "") AS ?descr)
        WHERE {
          # Використовуємо URI фільму
          <http://dbpedia.org/resource/${movieName}> rdfs:label ?name .

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
          FILTER (lang(?name) = "en")
          FILTER (lang(?abstract) = "en")
        }
      `;

      const fullInformationSparql = await this.client.get<
        SparqlResponse<FullMovieInformation>
      >('', query);
      const fullInformation = this.sparqlParser.parse(fullInformationSparql);
      console.log(fullInformation);

      return fullInformation[0];
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
