export function routerConfig($stateProvider) {
  $stateProvider
    .state('friends', {
        url: 'friends',
        abstract: true,
        template: '<ui-view></ui-view>',
        parent: 'app'
    })
    .state('friends.list', {
      url: '/list',
      templateUrl: 'app/modules/friends/templates/friends.html',
      controller: 'FriendsController',
      controllerAs: 'friends'
    });
}

routerConfig.$inject = ['$stateProvider'];
