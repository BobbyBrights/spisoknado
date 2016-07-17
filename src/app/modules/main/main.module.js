import {routerConfig} from './main.route';
import {MainController} from './controllers/main.controller';

angular.module('spisoknado.main')
  .config(routerConfig)
  .controller('mainController', MainController);
