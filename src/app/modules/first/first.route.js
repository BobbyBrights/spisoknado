export function routerConfig($stateProvider) {
  $stateProvider
    .state('first', {
      url: 'first',
      abstract: true,
      template: '<ui-view></ui-view>',
      parent: 'app'
    })
    .state('first.index', {
      url: '/first',
      templateUrl: 'app/modules/first/templates/first.html',
      controller: 'FirstController',
      controllerAs: 'first'
    });
}

routerConfig.$inject = ['$stateProvider'];
