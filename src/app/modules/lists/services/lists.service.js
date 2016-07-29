class ListsService {
  constructor($resource, progressService, notifyService, $state, $rootScope, authService) {
    this._progressService = progressService;
    this._authService = authService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
  }

  getMyListsList() {
        return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/lists');
  }

  getMyShareListsList() {
        return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/share_lists');
  }

  getListById(uid) {
        return firebase.database().ref('lists/' + uid).once('value');
  }

  createList(list, shareEmail) {
      var newPostKey = firebase.database().ref().child('lists').push().key;
      var updates = {};
      updates[''+newPostKey] = list;
      updates[''+newPostKey].author = firebase.auth().currentUser.uid;
      updates[''+newPostKey].share_users = "";
      updates[''+newPostKey].share_email = "";
      updates[''+newPostKey].secret_key = this.createSecretCod();
      firebase.database().ref().child('lists').update(updates);

      var _this = this;
      shareEmail.forEach((item) => {
        this._authService.getUserByEmail(item)
        .then((data) => {
          if(data.A.B!=undefined){
            _this.writeShareUser(newPostKey, data.A.B);
          }else{
            _this.writeShareEmail(newPostKey, item);
          }
        })
      });

      var newPostKey1 = firebase.database().ref().child('users/'+ firebase.auth().currentUser.uid+'/lists').push().key;
      updates = {};
      updates[''+newPostKey1] = {
        key: newPostKey,
        last_update: new Date()
      };
      return firebase.database().ref().child('users/'+ firebase.auth().currentUser.uid+'/lists').update(updates);
  }

  writeShareUser(newPostKey, shareUser){
      let newPostKey1 = firebase.database().ref().child('lists/'+newPostKey+'/share_users').push().key;
      let updates = {};
      updates[''+newPostKey1] = shareUser;
      firebase.database().ref().child('lists/'+newPostKey+'/share_users').update(updates);

      let newPostKey2 = firebase.database().ref().child('users/'+ shareUser+'/share_lists').push().key;
      updates = {};
      updates[''+newPostKey2] = {
        key: newPostKey,
        last_update: new Date()
      };
      firebase.database().ref().child('users/'+ shareUser+'/share_lists').update(updates);
  }

  writeShareEmail(newPostKey, shareEmail){
      let newPostKey1 = firebase.database().ref().child('lists/'+newPostKey+'/share_email').push().key;
      let updates = {};
      updates[''+newPostKey1] = shareEmail;
      firebase.database().ref().child('lists/'+newPostKey+'/share_email').update(updates);
  }

  createSecretCod(){
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890";

        for( var i=0; i < 32; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
  }

  iHavePermissionToList(key) {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/lists').once('value')
      .then((res) => {
        var flag = false;
        for(var x in res.val()){
          if(res.val()[x]==key){
            flag = true;
            break;
          }
        }
        if(!flag){
          firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/share_lists').once('value')
            .then((res) => {
              var flag = false;
              for(var x in res.val()){
                if(res.val()[x]==key){
                  flag = true;
                  break;
                }
              }
              if(!flag){
                return 0;
              }else{
                return 2;
              }
            });
        }else{
          return 1;
        }
      });
  }

}
ListsService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope', 'authService'];

export {
  ListsService
}
