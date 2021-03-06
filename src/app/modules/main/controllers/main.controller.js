import {BaseController} from '../../global/controllers/baseController';

class MainController extends BaseController {
    constructor($state, authService, $rootScope, $stateParams, $mdDialog, spinnerService, appSettings, $window, chNotify) {
        super(spinnerService, chNotify);
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._authService = authService;
        this._$stateParams = $stateParams;
        this._$mdDialog = $mdDialog;
        this._appSetting = appSettings;
        this._$window = $window;
        this.user = firebase.auth().currentUser;
        var _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            firebase.database().ref('users/'+user.uid).once('value')
              .then((res) => {
                if(res.val() && res.val().confirm){
                  _this.showSpinner = true;
                  CONSTANT_SPISOKNADO.user_uid = user.uid;
                  let interval_current_user = window.setInterval(function(){
                    if(firebase.auth().currentUser!=null){
                      _this.user = firebase.auth().currentUser;
                      _this.showSpinner = false;
                      _this._$rootScope.$apply();
                      window.clearInterval(interval_current_user);
                      _this._$state.go('lists.list');
                    }
                  },15);
                }else{
                  _this._chNotify.error('Вы не авторизованы или ваш аккаунт не подтверждён');
                }
              });
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

MainController.$inject = ['$state', 'authService', '$rootScope', '$stateParams', '$mdDialog', 'spinnerService', 'appSettings', '$window', 'chNotify'];

export {MainController}
