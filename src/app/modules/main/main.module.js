import {routerConfig} from './main.route';
import {MainController} from './controllers/main.controller';
import {ListAddModalController} from './controllers/listAdd.controller';

angular.module('spisoknado.main')
  .config(routerConfig)
  .controller('mainController', MainController)
  .controller('ListAddModalController', ListAddModalController);
