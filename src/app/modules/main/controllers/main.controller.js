class MainController {
    constructor($state, authService, $rootScope, $stateParams, $mdDialog, appSettings) {
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._authService = authService;
        this._$stateParams = $stateParams;
        this._$mdDialog = $mdDialog;
        this._appSetting = appSettings;
        this.user = firebase.auth().currentUser;

        var _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {

            firebase.database().ref('users/'+user.uid).once('value')
              .then((res) => {
                if(res.val().confirm){
                  CONSTANT_SPISOKNADO.user_uid = user.uid;
                  let interval_current_user = window.setInterval(function(){
                    if(firebase.auth().currentUser!=null){
                      _this.user = firebase.auth().currentUser;
                      _this._$rootScope.$apply();
                      if($state.current.name == "app") {
                        $state.go("lists.list");
                      }
                      window.clearInterval(interval_current_user);
                    }
                  },15);
                }else{
                  _this._authService.logOut();
                }
              });
          } else {
            if($state.current.name!='lists.listCard' && $state.current.name!='lists.confirmLogin') {
                $state.go("login");
            }
          }
        });
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

MainController.$inject = ['$state', 'authService', '$rootScope', '$stateParams', '$mdDialog', 'appSettings'];

export {MainController}
