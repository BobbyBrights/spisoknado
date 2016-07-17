import {routerConfig} from './auth.route';
import {LoginController} from './controllers/login.controller';
import {AuthService} from './services/auth.service';

angular.module('spisoknado.auth')
  .config(routerConfig)
  .controller('loginController', LoginController)
  .service('authService', AuthService);
