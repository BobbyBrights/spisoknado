class MainController {
    constructor($state, authService, $rootScope, $stateParams, $mdDialog, appSettings, $window) {
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._authService = authService;
        this._$stateParams = $stateParams;
        this._$mdDialog = $mdDialog;
        this._appSetting = appSettings;
        this._$window = $window;
        this.user = firebase.auth().currentUser;

    }

    logout() {
        this._authService.logOut();
    }

    login() {
        this._$state.go("login");
    }

    myList() {
        this._$state.go("lists.list");
    }

    myFriends() {
        this._$state.go("friends.list");
    }

    createList() {
        this._$mdDialog.show({
            clickOutsideToClose: true,
            templateUrl: 'app/modules/main/templates/listAdd.html',
            controller: 'ListAddModalController',
            controllerAs: 'con'
        });
    }

}

MainController.$inject = ['$state', 'authService', '$rootScope', '$stateParams', '$mdDialog', 'appSettings', '$window'];

export {MainController}
