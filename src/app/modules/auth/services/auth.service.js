class AuthService {
    constructor($q, $state, $rootScope, $stateParams, $resource, progressService, chNotify) {
        this._$q = $q;
        this._$state = $state;
        this._$resource = $resource;
        this._$rootScope = $rootScope;
        this._$stateParams = $stateParams;
        this._progressService = progressService;
        this._chNotify = chNotify;
        this.createUserId = null;
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
                        _this._progressService.hideCircular();
                        if(res.val().confirm){
                          _this._$state.go("app");
                        }else{
                          _this._chNotify.info("Для активации учётной записи, пройдите по ссылке, отправленной на указанный e-mail");
                          _this.logOut();
                        }
                      });
                });
            })
            .catch(function(error) {
              _this._chNotify.error(error);
              _this._progressService.hideCircular();
            });
    }

    singUp(email, password) {
      var _this = this;
      this.createUserId = null;
      this._progressService.showCircular();
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(data){
          _this._chNotify.info("Регистрация прошла успешно! Для активации учётной записи, пройдите по ссылке, отправленной на указанный e-mail");
          _this._progressService.hideCircular();
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
              _this.createUserId = null;
              _this.createUserInBase(email, password);
            });
        })
        .catch(function(error) {
          _this._chNotify.error(error);
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

    createUserInBase(email, password) {
        let _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if(!user){
              return;
            }
            var newUser = {};
            let code = _this.createSecretCod();
            firebase.database().ref('users/'+user.uid).once('value')
              .then(data => {
                if(_this.createUserId){
                  return;
                }
                _this.createUserId = user.uid;
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
                _this.sendConfirmEmail({email: email, code: code, password: password});
                _this.logOut();
              })
        });
    }


    /**
     *
     */
    logOut() {
        var _this = this;
        firebase.auth().signOut().then(function() {
            _this._$state.go("login");
        }, function(error) {
            _this._chNotify.error(error);
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

    createAuthToken() {
      var _this = this;
              firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                  firebase.database().ref('users/'+user.uid).once('value')
                    .then((res) => {
                      if(res.val() && res.val().confirm){
                        CONSTANT_SPISOKNADO.user_uid = user.uid;
                        CONSTANT_SPISOKNADO.user_email = user.email;
                        CONSTANT_SPISOKNADO.user_first_auth = res.val().first_auth;
                        let interval_current_user = window.setInterval(function(){
                          if(firebase.auth().currentUser!=null){
                            _this.user = firebase.auth().currentUser;
                            _this._$rootScope.$apply();
                            if(_this._$state.current.name == "app") {
                              _this._$state.go("lists.list");
                            }
                            window.clearInterval(interval_current_user);
                          }
                        },15);
                      }else{
                        _this.logOut();
                      }
                    });
                } else {
                      _this._$state.go("login");
                }
              });
    }
}

AuthService.$inject = ['$q', '$state', '$rootScope', '$stateParams', '$resource', 'progressService', 'chNotify'];

export {
    AuthService
}
