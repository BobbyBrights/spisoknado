class FirstController {
  constructor($rootScope, $mdDialog, progressService, notifyService, $scope) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._notifyService = notifyService;
  }

}

FirstController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope'];

export {
  FirstController
}
