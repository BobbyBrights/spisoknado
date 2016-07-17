export function routerConfig ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'app/modules/main/templates/main.html',
      controller: 'mainController',
      controllerAs: 'mainCtrl',
      data: {
        requiresLogin: true
      }
    });

  $urlRouterProvider.otherwise('/');
}

routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
