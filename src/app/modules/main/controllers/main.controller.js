class MainController {
    constructor($state, authService, $rootScope, $mdDialog) {
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._authService = authService;
        this._$mdDialog = $mdDialog;
        this.user = firebase.auth().currentUser;
        if(!this.user){
            $state.go("login");
        }else if($state.current.name == "app") {
            $state.go("lists.list");
        }
    }

    logout() {
        this._authService.logOut();
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

MainController.$inject = ['$state', 'authService', '$rootScope', '$mdDialog'];

export {MainController}
