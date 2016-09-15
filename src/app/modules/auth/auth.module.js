import {routerConfig} from './auth.route';
import {LoginController} from './controllers/login.controller';
import {ConfirmLoginController} from './controllers/confirmLogin.controller';
import {AuthService} from './services/auth.service';

angular.module('spisoknado.auth')
  .config(routerConfig)
  .controller('loginController', LoginController)
  .controller('confirmLoginController', ConfirmLoginController)
  .service('authService', AuthService);
