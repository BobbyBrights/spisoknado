import {routerConfig} from './friends.route.js';
import {FriendsService} from "./services/friends.service";
import {FriendsController} from "./controllers/friends.controller";


angular.module('spisoknado.friends')
  .config(routerConfig)
  .service('friendsService', FriendsService)
  .controller('FriendsController', FriendsController);
