class AuthService {
    constructor($q, $state, $stateParams, $resource, progressService, notifyService) {
        this._$q = $q;
        this._$state = $state;
        this._$resource = $resource;
        this._$stateParams = $stateParams;
        this._progressService = progressService;
        this._notifyService = notifyService;

        this._authResource = $resource(`url`, {}, {
          confirm_email: {
            method: 'GET', url: 'php/confirm_email.php'
          }})
    }

    /**
     * Узнаём авторизационные данные пользователя
     */
    getAuthData() {
        firebase.auth().onAuthStateChanged(function(user) {
            return user;
        });
    }

    /**
     *
     * @returns {Promise}
     */
    singIn(email, password) {
        var _this = this;
        this._progressService.showCircular();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(){
                firebase.auth().onAuthStateChanged(function(user) {
                  firebase.database().ref('users/'+user.uid).once('value')
                    .then((res) => {
                        if(res.val().confirm){
                          _this._progressService.hideCircular();
                          _this._$state.go("app");
                        }else{
                          _this._progressService.hideCircular();
                          _this._notifyService.info("Для активации учётной записи, пройдите по ссылке, отправленной на указанный e-mail");
                        }
                      });
                });
            })
            .catch(function(error) {
              _this._notifyService.error(error);
              _this._progressService.hideCircular();
            });
    }

    singUp(email, password) {
      var _this = this;
      this._progressService.showCircular();
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(data){
          _this._notifyService.info("Регистрация прошла успешно! Для активации учётной записи, пройдите по ссылке, отправленной на указанный e-mail");
          _this.createUserInBase(email);
          _this._progressService.hideCircular();
        })
        .catch(function(error) {
          _this._notifyService.error(error);
          _this._progressService.hideCircular();
        });
    }

    sendConfirmEmail(params) {
      return this._authResource.confirm_email(params).$promise;
    }

    createSecretCod(){
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890";

      for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    createUserInBase(email) {
        let _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if(!user){
              return;
            }
            var newUser = {};
            let code = _this.createSecretCod();
            newUser[user.uid+""] = {
                "email": email,
                "lists": "",
                "share_lists": "",
                "friends_email": "",
                "confirm": false,
                "confirm_code": code
            };
            firebase.database().ref('users').update(newUser);
            var newEmail = {};
            newEmail[_this.refactorEmail(email)+""] = user.uid;
            firebase.database().ref('emails').update(newEmail);
            _this.sendConfirmEmail({email: email, code: code});
        });
    }


    /**
     *
     */
    logOut() {
        var _this = this;
        this._progressService.showCircular();
        firebase.auth().signOut().then(function() {
            _this._progressService.hideCircular();
            if(_this._$stateParams.email){
              _this._$state.go("login",{email: _this._$stateParams.email, code: _this._$stateParams.code});
            }else{
              _this._$state.go("login");
            }
        }, function(error) {
            _this._notifyService.error(error);
            _this._progressService.hideCircular();
        });
    }

    refactorEmail(email) {
      email = email.replace(/\@/g,"_at_");
      email = email.replace(/\./g,"_pp_");
      return email+"";
    }

    getUserByEmail(email) {
      var refactoringEmail = this.refactorEmail(email);
      return firebase.database().ref('emails/' + refactoringEmail).once('value');
    }

    getUserByUserId(id) {
      return firebase.database().ref('users/' + id).once('value');
    }
}

AuthService.$inject = ['$q', '$state', '$stateParams', '$resource', 'progressService', 'notifyService'];

export {
    AuthService
}
