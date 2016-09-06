class FriendEditController {
    constructor($mdDialog, friendsService, friend) {
        this._$mdDialog = $mdDialog;
        this._friendsService = friendsService;
        this.friend = angular.copy(friend);
    }

    cancel() {
      this._$mdDialog.cancel();
    }

    doCreate() {
      this._friendsService.editFriend(this.friend.key, this.friend.name, this.friend.email);
      this._$mdDialog.hide(this.friend);
    }
}

FriendEditController.$inject = ['$mdDialog', 'friendsService', 'friend'];

export {FriendEditController}
