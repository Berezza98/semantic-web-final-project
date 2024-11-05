import { Container } from "inversify";
import { TYPES } from "./dependencyInjectionTypes";
import { SrarqlDataProviderService } from "./services";
import { DataProvider } from "./interfaces";
import { BaseController } from "./common";
import { MovieController } from "./controllers";
import { WebServer } from "./server";

export const container = new Container();

container.bind<DataProvider>(TYPES.DataProvider).to(SrarqlDataProviderService);
container.bind<BaseController>(TYPES.MovieController).to(MovieController);
container.bind<WebServer>(TYPES.WebServer).to(WebServer);