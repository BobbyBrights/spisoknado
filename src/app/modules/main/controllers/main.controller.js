class MainController {
    constructor($state, authService, $rootScope) {
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._authService = authService;
        var _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
          _this.user = user
          _this._$rootScope.$apply();
        });
    }

    logout() {
        this._authService.logOut();
    }

}

MainController.$inject = ['$state', 'authService', '$rootScope'];

export {MainController}
