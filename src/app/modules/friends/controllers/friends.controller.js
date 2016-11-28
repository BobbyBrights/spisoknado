import {FriendCreateController} from '../modal/create/controllers/friendsCreateController';
import {FriendEditController} from '../modal/edit/controllers/friendsEditController';
import {findIndex, remove} from 'lodash';

class FriendsController {
  constructor($rootScope, $mdDialog, progressService, chNotify, $scope, friendsService, $state, authService) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this._chNotify = chNotify;
    this._friendsService = friendsService;
    this._authService = authService;
    this._authService.createAuthToken();
    this.myFriends = [];

    let _this = this;
    let interval_current_user = window.setInterval(function(){
      if(CONSTANT_SPISOKNADO.user_uid!=null){
        _this.loadFriends();
        window.clearInterval(interval_current_user);
      }
    },15);
  }

  loadFriends() {
      var _this = this;
      this.refMyFriends = this._friendsService.getMyFriendsList();
      this.refMyFriends.on('child_added', function(data) {
          let friend = data.val();
          friend.key = data.key;
          _this.myFriends.push(friend);
          _this._$rootScope.$apply();
      });
  }

  openCreateFriend() {
    this._$mdDialog.show({
                templateUrl: 'app/modules/friends/modal/create/templates/friendsCreate.html',
                controller: FriendCreateController,
                controllerAs: 'createCtrl'
            })
            .then(() => {

            });
  }

  openModalEdit(friend) {
    this._$mdDialog.show({
                templateUrl: 'app/modules/friends/modal/edit/templates/friendsEdit.html',
                controller: FriendEditController,
                controllerAs: 'editCtrl',
                locals: {
                  friend: friend
                }
            })
            .then((res) => {
              this.myFriends[findIndex(this.myFriends, item => item.key === friend.key)] = res;
            });
  }

  removeFriend(friend) {
        let _confirm = this._$mdDialog.confirm()
            .title('Удаление друга')
            .textContent('Вы действительно хотите удалиль друга?')
            .ok('Удалить')
            .cancel('Отмена');

        this._$mdDialog.show(_confirm)
            .then(() => {
                this._friendsService.removeFriend(friend.key);
                remove(this.myFriends, item => item.key === friend.key)
            })
  }

}

FriendsController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'chNotify', '$scope', 'friendsService', '$state', 'authService'];

export {
  FriendsController
}
