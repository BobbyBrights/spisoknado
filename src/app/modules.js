// global app config
import {appSettings} from './app.settings.js'

// creating modules
angular.module('core', ['ui.router', 'ngResource', 'ngMdIcons', 'ngMaterial','toaster']);

angular.module('spisoknado.main', ['core']);
angular.module('spisoknado.global', ['core']);
angular.module('spisoknado.first', ['core']);
angular.module('spisoknado.auth', ['core']);


angular.module('core')
  .constant('appSettings', appSettings);

// registering modules
angular.module('spisoknado', [
  'spisoknado.main',
  'spisoknado.global',
  'spisoknado.first',
  'spisoknado.auth'
])
  .run(function ($state) {

    var config = {
      apiKey: "AIzaSyDxh2DwY1x3S8MGp9wgp0vdX0gC2wBFNSY",
      authDomain: "spisoknado.firebaseapp.com",
      databaseURL: "https://spisoknado.firebaseio.com",
      storageBucket: "spisoknado.appspot.com"
    };
    firebase.initializeApp(config);
    /*if(authService.getAuthData()){
      $state.go("app");
    }else{
      $state.go("login");
    }*/
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $state.go("app");
      } else {
        $state.go("login");
      }
    });
  });
