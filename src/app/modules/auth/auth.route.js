export function routerConfig($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'loginController',
      templateUrl: 'app/modules/auth/templates/login.html',
      controllerAs: 'login'
    })
}

routerConfig.$inject = ['$stateProvider'];
