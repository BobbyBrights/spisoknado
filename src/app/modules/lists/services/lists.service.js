class ListsService {
  constructor($resource, progressService, notifyService, $state, $rootScope, authService, appSettings) {
    this._progressService = progressService;
    this._authService = authService;
    this._notifyService = notifyService;
    this._$state = $state;
    this._$rootScope = $rootScope;
    this._appSetting = appSettings;
    this._listResource = $resource(`url`, {}, {
              share_list_email: {
                method: 'GET', url: 'php/share_list_email.php'
              },
              share_list_user: {
                method: 'GET', url: 'php/share_list_user.php'
              }})
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

  removeItemById(listId, itemKey) {
        firebase.database().ref('items/' + itemKey).remove();
        firebase.database().ref('lists/' + listId + '/items').once('value')
          .then((res) => {
            for(var x in res.val()){
              if(res.val()[x] == itemKey){
                firebase.database().ref('lists/' + listId + '/items/' + x).remove();
                break;
              }
            }
          });
        this.writeChangeToList(listId, itemKey, "remove")
  }

  writeChangeToList(uid, itemKey, action) {
        let update = new Date();
        update += "";
        let updateObject = {
          date: update,
          item: itemKey,
          action: action,
          user: CONSTANT_SPISOKNADO.user_uid
        };
        let ref = firebase.database().ref().child('lists/' + uid + '/last_update');
        ref.set(updateObject);
        this.getListById(uid)
          .then((res) => {
            let author = res.val().author;
            firebase.database().ref('users/' + author + '/lists').once('value')
              .then((res) => {
                for(let x in res.val()){
                  if(res.val()[x].key == uid) {
                    firebase.database().ref('users/' + author + '/lists/' + x + '/last_update').set(updateObject);
                    break;
                  }
                }
              });


            for(let y in res.val().share_users){
              firebase.database().ref('users/' + res.val().share_users[y].user_id + '/share_lists').once('value')
              .then((res) => {
                for(let x in res.val()){
                  if(res.val()[x].key == uid) {
                    res.ref.child(x+'/last_update').set(updateObject);
                    break;
                  }
                }
              });
            }
          })
  }

  removeShareEmail(key, email) {
    this._authService.getUserByEmail(email)
      .then((data) => {
        let idUser = data.val();
        if(idUser){
          this.removeShareListByUser(key, idUser);
        }else{
          firebase.database().ref().child('lists/'+key+'/share_email').once('value')
            .then(res => {
              for(let x in res.val()) {
                if(res.val()[x] === email){
                  firebase.database().ref().child('lists/'+idList+'/share_email/'+x).remove();
                  break;
                }
              }
            });
        }
      })
  }

  removeShareListByUser(idList, idUser){
    firebase.database().ref().child('lists/'+idList+'/share_users').once('value')
      .then(res => {
        for(let x in res.val()) {
          if(res.val()[x].user_id === idUser){
            firebase.database().ref().child('lists/'+idList+'/share_users/'+x).remove();
            break;
          }
        }
      });
    firebase.database().ref().child('users/'+idUser+'/share_lists').once('value')
      .then(res => {
        for(let x in res.val()) {
          if(res.val()[x].key === idList){
            firebase.database().ref().child('users/'+idUser+'/share_lists'+x).remove();
            break;
          }
        }
      });
  }

  updateList(list, createEmail, removeEmail) {
    let _this = this;
    removeEmail.forEach(item => {
      _this.removeShareEmail(list.key, item.email);
    });
    createEmail.forEach((item) => {
      this._authService.getUserByEmail(item.email)
        .then((data) => {
          if(data.val()){
            _this.writeShareUser(list.key, data.val(), item.email);
          }else{
            _this.writeShareEmail(list.key, item.email, list.secret_key);
          }
        })
    });
    firebase.database().ref().child('lists/'+list.key+'/title').set(list.title+"");
    this.writeChangeToList(list.key, "", "update_info");
    return firebase.database().ref().child('lists/'+list.key).once('value');
  }

  createList(list, shareEmail) {
      var newPostKey = firebase.database().ref().child('lists').push().key;
      var updates = {};
      updates[''+newPostKey] = list;
      updates[''+newPostKey].author = CONSTANT_SPISOKNADO.user_uid;
      updates[''+newPostKey].share_users = "";
      updates[''+newPostKey].share_email = "";
      updates[''+newPostKey].last_update = "";
      updates[''+newPostKey].secret_key = this.createSecretCod();
      firebase.database().ref().child('lists').update(updates);

      var _this = this;
      shareEmail.forEach((item) => {
        this._authService.getUserByEmail(item.email)
        .then((data) => {
          if(data.val()){
            _this.writeShareUser(newPostKey, data.val(), item.email);
          }else{
            _this.writeShareEmail(newPostKey, item.email, updates[''+newPostKey].secret_key);
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

  createItem(listId, itemTitle) {
      let newPostKey = firebase.database().ref().child('items').push().key;
      let updates = {};
      updates[''+newPostKey] = {};
      updates[''+newPostKey].title = itemTitle;
      updates[''+newPostKey].count = 1;
      updates[''+newPostKey].weight = 0;
      updates[''+newPostKey].complete = false;
      firebase.database().ref().child('items').update(updates);
      let newPostKey1 = firebase.database().ref().child('lists/' + listId + '/items').push().key;
      updates = {};
      updates[''+newPostKey1] = newPostKey;
      firebase.database().ref().child('lists/' + listId + '/items').update(updates);
      this.writeChangeToList(listId, newPostKey, "update");
      return newPostKey;
  }

  writeShareUser(newPostKey, shareUser, email){
      this._listResource.share_list_user({id: newPostKey, email: email});
      let newPostKey1 = firebase.database().ref().child('lists/'+newPostKey+'/share_users').push().key;
      let updates = {};
      updates[''+newPostKey1] = {
        user_id: shareUser,
        email: email
      };
      firebase.database().ref().child('lists/'+newPostKey+'/share_users').update(updates);

      let newPostKey2 = firebase.database().ref().child('users/'+ shareUser+'/share_lists').push().key;
      updates = {};
      updates[''+newPostKey2] = {
        key: newPostKey,
        last_update: new Date()
      };
      firebase.database().ref().child('users/'+ shareUser+'/share_lists').update(updates);
  }

  writeShareEmail(newPostKey, shareEmail, secret_key){
      this._listResource.share_list_email({id: newPostKey, email: share_email, key: secret_key});
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

  updateFrontItem(listId, item) {
    let ref = firebase.database().ref().child('items/' + item.key);
    ref.update({
      title: item.value.title,
      count: item.value.count,
      weight: item.value.weight,
      complete: item.value.complete
    });
    this.writeChangeToList(listId, item.key, "update");
  }

  removeList(list) {
    for(let x in list.share_email){
      this.removeShareEmail(list.key, list.share_email[x]);
    }
    for(let x in list.share_users){
      this.removeShareEmail(list.key, list.share_users[x].email);
    }
    firebase.database().ref().child('users/' + list.author + '/lists').once('value')
      .then(res => {
        for(let x in res.val()) {
          if(res.val()[x].key === list.key) {
            firebase.database().ref().child('users/' + list.author + '/lists/' + x).remove();
            break;
          }
        }
      });
    firebase.database().ref().child('lists/' + list.key + '/items').once('value')
      .then(res => {
        for(let x in res.val()) {
            firebase.database().ref().child('items/' + res.val()[x]).remove();
        }
      });
    firebase.database().ref().child('lists/' + list.key).remove();
  }



}
ListsService.$inject = ['$resource', 'progressService', 'notifyService', '$state', '$rootScope', 'authService', 'appSettings'];

export {
  ListsService
}
