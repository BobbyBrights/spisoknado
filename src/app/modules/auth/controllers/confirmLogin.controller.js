/**
 * ConfirmLoginController
 */
class ConfirmLoginController {
    constructor($state, authService, chNotify, $stateParams, listsService, progressService, email, code, password) {
        this._$state = $state;
        this._$stateParams = $stateParams;
        this._authService = authService;
        this._chNotify = chNotify;
        this._progressService = progressService;
        this._listsService = listsService;
        this.email = email;
        this.code = code;
        this.password = password;
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
                                  "confirm": true,
                                  "first_auth": false
                                };
                                firebase.database().ref('users/'+data.val()).set(user);
                                this._chNotify.info('подтверждение прошло успешно');
                                var _this = this;
                                this._authService.singIn(this.email, this.password);
                              }else{
                                this._chNotify.error('неверный код подтвеждения');
                              }
                            })
                        }else{
                          this._chNotify.error('такого email не существует');
                        }
                      })
            })
            .catch((error) => {
              this._chNotify.error(error);
            });
    }
}

ConfirmLoginController.$inject = ['$state', 'authService', 'chNotify', '$stateParams', 'listsService', 'progressService', 'email', 'code', 'password'];

export {
    ConfirmLoginController
}
