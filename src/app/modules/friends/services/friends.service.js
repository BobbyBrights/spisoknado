import {has} from 'lodash';

class FriendsService {
  constructor($resource, progressService, notifyService, $state, $rootScope, authService, appSettings) {
    this._progressService = progressService;
    this._authService = authService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
    this._appSetting = appSettings;
  }

  getMyFriendsList() {
        return firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/friends_email');
  }

  createFriend(name, email) {
      this._authService.getUserByEmail(email)
        .then(res => {
          let user = false;
          if(res.val()){
            user = true;
          }
          let newPostKey = firebase.database().ref().child('users/' + CONSTANT_SPISOKNADO.user_uid + '/friends_email').push().key;
          let updates = {};
          updates[''+newPostKey] = {};
          updates[''+newPostKey].name = name;
          updates[''+newPostKey].email = email;
          updates[''+newPostKey].user = user;
          firebase.database().ref().child('users/' + CONSTANT_SPISOKNADO.user_uid + '/friends_email').update(updates);
          return newPostKey;
        })
  }

  editFriend(key, name, email) {
      this._authService.getUserByEmail(email)
        .then(res => {
          let user = false;
          if(res.val()){
            user = true;
          }
          let updates = {};
          updates[''+key] = {};
          updates[''+key].name = name;
          updates[''+key].email = email;
          updates[''+key].user = user;
          firebase.database().ref().child('users/' + CONSTANT_SPISOKNADO.user_uid + '/friends_email').update(updates);
          return true;
        })
  }

  removeFriend(key) {
    firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/friends_email/' + key).remove();
  }
}
FriendsService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope', 'authService', 'appSettings'];

export {
  FriendsService
}
