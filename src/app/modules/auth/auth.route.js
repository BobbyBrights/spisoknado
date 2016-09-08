export function routerConfig($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login/:email/:code',
      controller: 'loginController',
      templateUrl: 'app/modules/auth/templates/login.html',
      controllerAs: 'login',
      resolve:{
        email: ['$stateParams', function($stateParams){
          return $stateParams.email;
        }],
        code: ['$stateParams', function($stateParams){
          return $stateParams.code;
        }]
      }
    })
}

routerConfig.$inject = ['$stateProvider'];
