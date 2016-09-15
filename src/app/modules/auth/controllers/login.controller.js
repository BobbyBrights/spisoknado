/**
 * LoginController
 */
class LoginController {
    constructor($state, authService, $stateParams) {
        this._$state = $state;
        this._$stateParams = $stateParams;
        this._authService = authService;
        this.email = '';
        this.password = '';
        this.signin = true;
    }

    /**
     * Входим в систему
     */
    singIn() {
        this._authService.singIn(this.email, this.password);
    }

    singUp() {
        var _this = this;
        this._authService.singUp(this.email, this.password)
          .then(function(){
              _this.signin = true;
          })
    }
}

LoginController.$inject = ['$state', 'authService', '$stateParams'];

export {
    LoginController
}
