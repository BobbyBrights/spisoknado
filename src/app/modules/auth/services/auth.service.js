class AuthService {
    constructor($q, $state, progressService, notifyService) {
        this._$q = $q;
        this._$state = $state;
        this._progressService = progressService;
        this._notifyService = notifyService;
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
                _this._progressService.hideCircular();
                _this._$state.go("app");
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
          _this._progressService.hideCircular();
          _this._notifyService.info("Success! Verify your email, please");
          _this.createUserInBase(email);
        })
        .catch(function(error) {
          _this._notifyService.error(error);
          _this._progressService.hideCircular();
        });
    }

    createUserInBase(email) {
        firebase.auth().onAuthStateChanged(function(user) {
            var newUser = {};
            newUser[user.uid+""] = {
                "email": email,
                "lists": "",
                "share_lists": "",
                "friends_email": ""
            };
            firebase.database().ref('users').update(newUser);
            var newEmail = {};
            newEmail[this.refactorEmail(email)+""] = user.uid;
            firebase.database().ref('emails').update(newEmail);
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
            _this._$state.go("login");
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
}

AuthService.$inject = ['$q', '$state', 'progressService', 'notifyService'];

export {
    AuthService
}
