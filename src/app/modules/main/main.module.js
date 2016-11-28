import {routerConfig} from './main.route';
import {MainController} from './controllers/main.controller';
import {ListAddModalController} from './controllers/listAdd.controller';
import {SpinnerService} from './services/spinnerService';

angular.module('spisoknado.main')
  .config(routerConfig)
  .controller('mainController', MainController)
  .service('spinnerService', SpinnerService)
  .controller('ListAddModalController', ListAddModalController);
