import {routerConfig} from './lists.route.js';
import {ListsService} from "./services/lists.service";
import {ListsController} from "./controllers/lists.controller";


angular.module('spisoknado.lists')
  .config(routerConfig)
  .service('listsService', ListsService)
  .controller('ListsController', ListsController);
