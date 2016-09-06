class FriendCreateController {
    constructor($mdDialog, friendsService) {
        this._$mdDialog = $mdDialog;
        this._friendsService = friendsService;
        this.friend = {
            name: '',
            email: ''
        };
    }

    cancel() {
      this._$mdDialog.cancel();
    }

    doCreate() {
      this._friendsService.createFriend(this.friend.name, this.friend.email);
      this._$mdDialog.hide(true);
    }
}

FriendCreateController.$inject = ['$mdDialog', 'friendsService'];

export {FriendCreateController}
