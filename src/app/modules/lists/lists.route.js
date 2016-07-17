export function routerConfig($stateProvider) {
  $stateProvider
    .state('lists', {
        url: 'lists',
        abstract: true,
        template: '<ui-view></ui-view>',
        parent: 'app'
    })
    .state('lists.list', {
      url: '/list',
      templateUrl: 'app/modules/lists/templates/lists.html',
      controller: 'ListsController',
      controllerAs: 'lists'
    });
}

routerConfig.$inject = ['$stateProvider'];
