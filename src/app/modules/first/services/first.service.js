class FirstService {
  constructor($resource, progressService, notifyService, $state, $rootScope) {
    this._progressService = progressService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
  }

}
FirstService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope'];

export {
  FirstService
}
