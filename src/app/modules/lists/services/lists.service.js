class ListsService {
  constructor($resource, progressService, notifyService, $state, $rootScope, authService, appSettings) {
    this._progressService = progressService;
    this._authService = authService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
    this._appSetting = appSettings;
  }

  getMyListsList() {
        return firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/lists');
  }

  getMyShareListsList() {
        return firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/share_lists');
  }

  getListById(uid) {
        return firebase.database().ref('lists/' + uid).once('value');
  }

  getItemById(uid) {
        return firebase.database().ref('items/' + uid).once('value');
  }

  writeChangeToList(uid) {
        let ref = firebase.database().ref('lists/' + uid + '/last_update');
        ref.update(new Date());
        this.getListById(uid)
          .then((res) => {
            let author = res.val().author;
            firebase.database().ref('users/' + author + '/lists').once('value')
              .then((res) => {
                for(let x in res.val()){
                  if(res.val()[x].key == uid) {
                    firebase.database().ref('users/' + author + '/lists/' + x + '/last_update').update(new Date());
                    break;
                  }
                }
              });

            for(let y in res.val().share_users){
              firebase.database().ref('users/' + res.val().share_users[y] + '/share_lists').once('value')
              .then((res) => {
                for(let x in res.val()){
                  if(res.val()[x].key == uid) {
                    firebase.database().ref('users/' + res.val().share_users[y] + '/share_lists/' + x + '/last_update').update(new Date());
                    break;
                  }
                }
              });
            }
          })
  }

  createList(list, shareEmail) {
      var newPostKey = firebase.database().ref().child('lists').push().key;
      var updates = {};
      updates[''+newPostKey] = list;
      updates[''+newPostKey].author = CONSTANT_SPISOKNADO.user_uid;
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

      var newPostKey1 = firebase.database().ref().child('users/'+ CONSTANT_SPISOKNADO.user_uid+'/lists').push().key;
      updates = {};
      updates[''+newPostKey1] = {
        key: newPostKey,
        last_update: new Date()
      };
      return firebase.database().ref().child('users/'+ CONSTANT_SPISOKNADO.user_uid+'/lists').update(updates);
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
    let ref = firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/lists');
    return ref.once('value');
  }

  iHavePermissionToShareList(key) {
      let ref = firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/share_lists');
      return ref.once('value');
  }

}
ListsService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope', 'authService', 'appSettings'];

export {
  ListsService
}
