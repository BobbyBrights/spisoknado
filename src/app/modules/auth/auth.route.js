export function routerConfig($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'loginController',
      templateUrl: 'app/modules/auth/templates/login.html',
      controllerAs: 'login'
    })
    .state('confirmLogin', {
      url: '/confirmLogin/:email/:code/:password',
      controller: 'confirmLoginController',
      template: '',
      resolve:{
        email: ['$stateParams', function($stateParams){
          return $stateParams.email;
        }],
        code: ['$stateParams', function($stateParams){
          return $stateParams.code;
        }],
        password: ['$stateParams', function($stateParams){
          return $stateParams.password;
        }]
      }
    })
}

routerConfig.$inject = ['$stateProvider'];
