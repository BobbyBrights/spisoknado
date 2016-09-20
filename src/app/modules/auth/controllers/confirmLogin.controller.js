/**
 * ConfirmLoginController
 */
class ConfirmLoginController {
    constructor($state, authService, notifyService, $stateParams, listsService, progressService, email, code, password) {
        this._$state = $state;
        this._$stateParams = $stateParams;
        this._authService = authService;
        this._notifyService = notifyService;
        this._progressService = progressService;
        this._listsService = listsService;
        this.email = email;
        this.code = code;
        this.password = password;
        console.log(this.email, this.code, this.password)
        this.confirm();
    }

    confirm() {
      let refactorEmail = this._authService.refactorEmail(this.email);
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
              firebase.database().ref('emails/'+refactorEmail).once('value')
                      .then((data) => {
                        if(data.val()){
                          firebase.database().ref('users/'+data.val()).once('value')
                            .then((res) => {
                              if(res.val().confirm_code === this.code) {
                                let user = {
                                  "email": this.email,
                                  "lists": "",
                                  "share_lists": "",
                                  "friends_email": "",
                                  "confirm": true
                                }
                                firebase.database().ref('users/'+data.val()).set(user);
                                this._notifyService.info('подтверждение прошло успешно');
                                var _this = this;
                                this._progressService.showCircular();
                                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                                    .then(function(){
                                        firebase.auth().onAuthStateChanged(function(user) {
                                          firebase.database().ref('users/'+user.uid).once('value')
                                            .then((res) => {
                                                _this._progressService.hideCircular();
                                                _this._listsService.createShareListByNewUser(_this.email, data.val());
                                              });
                                        });
                                    })
                                    .catch(function(error) {
                                      _this._notifyService.error(error);
                                      _this._progressService.hideCircular();
                                    });


                              }else{
                                this._notifyService.error('неверный код подтвеждения');
                              }
                            })
                        }else{
                          this._notifyService.error('такого email не существует');
                        }
                      })
            })
            .catch((error) => {
              this._notifyService.error(error);
            });
    }
}

ConfirmLoginController.$inject = ['$state', 'authService', 'notifyService', '$stateParams', 'listsService', 'progressService', 'email', 'code', 'password'];

export {
    ConfirmLoginController
}
