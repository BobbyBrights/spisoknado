class ListsService {
  constructor($resource, progressService, notifyService, $state, $rootScope) {
    this._progressService = progressService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
  }

  getMyListsList() {
        return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/lists');
  }

  getMyListsId() {
        return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/lists').once('value');
  }

  getListById(uid) {
        return firebase.database().ref('lists/' + uid).once('value');
  }

  createList(list) {
      var newPostKey = firebase.database().ref().child('lists').push().key;
      var updates = {};
      updates[''+newPostKey] = list;
      firebase.database().ref().child('lists').update(updates);
      var newPostKey1 = firebase.database().ref().child('users/'+ firebase.auth().currentUser.uid+'/lists').push().key;
      updates = {};
      updates[''+newPostKey1] = newPostKey;
      return firebase.database().ref().child('users/'+ firebase.auth().currentUser.uid+'/lists').update(updates);
  }

}
ListsService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope'];

export {
  ListsService
}
