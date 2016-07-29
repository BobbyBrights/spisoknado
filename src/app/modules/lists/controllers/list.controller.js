/**
 * Created by gr on 29.07.16.
 */
class ListController {
  constructor($rootScope, $mdDialog, progressService, notifyService, $scope, listsService, listId, $state) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this._notifyService = notifyService;
    this._listsService = listsService;
    this.listId = listId;
    
    if(!this._listsService.iHavePermissionToList(listId)){
      this._$state.go('lists.list');
    }
    
  }

}

ListController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope', 'listsService', 'listId', '$state'];

export {
  ListController
}
