import {routerConfig} from './first.route.js';
import {FirstService} from "./services/first.service";
import {FirstController} from "./controllers/first.controller";


angular.module('spisoknado.first')
  .config(routerConfig)
  .service('firstService', FirstService)
  .controller('FirstController', FirstController);
