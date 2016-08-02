// global app config
import {appSettings} from './app.settings.js'

// creating modules
angular.module('core', ['ui.router', 'ngResource', 'ngMdIcons', 'ngMaterial','toaster'])
.config(function () {
      var config = {
        apiKey: "AIzaSyDxh2DwY1x3S8MGp9wgp0vdX0gC2wBFNSY",
        authDomain: "spisoknado.firebaseapp.com",
        databaseURL: "https://spisoknado.firebaseio.com",
        storageBucket: "spisoknado.appspot.com"
      };
      firebase.initializeApp(config);
  });

angular.module('spisoknado.main', ['core']);
angular.module('spisoknado.global', ['core']);
angular.module('spisoknado.lists', ['core']);
angular.module('spisoknado.auth', ['core']);


angular.module('core')
  .constant('appSettings', appSettings);

// registering modules
angular.module('spisoknado', [
  'spisoknado.main',
  'spisoknado.global',
  'spisoknado.lists',
  'spisoknado.auth'
])
  .run(function ($state) {
    $state.go("app");
  });
