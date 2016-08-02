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
    })
    .state('lists.listCard', {
        url: '/list/:id/:email/:kod',
        templateUrl: 'app/modules/lists/templates/list.html',
        controller: 'ListController',
        controllerAs: 'listCardCtrl',
        resolve: {
            listId: ['$stateParams',
                ($stateParams) => {
                    return $stateParams.id;
                }],
            email: ['$stateParams',
                ($stateParams) => {
                    return $stateParams.email;
                }],
            kod: ['$stateParams',
                ($stateParams) => {
                    return $stateParams.kod;
                }]
        }
    });
}

routerConfig.$inject = ['$stateProvider'];
