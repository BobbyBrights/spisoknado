import {findIndex, differenceBy} from 'lodash';

class ListEditModalController {
    constructor($mdDialog, progressService, authService, notifyService, $state, listsService, friendsService, list) {
        this._$mdDialog = $mdDialog;
        this._listsService = listsService;
        this._progressService = progressService;
        this._authService = authService;
        this._$state = $state;
        this._notifyService = notifyService;
        this._friendsService = friendsService;
        this.loadingFlag = false;
        this.selectedItem = null;
        this.searchText = null;
        this.list = list;
        this.shareEmail = [];
        this.startShareEmail = [];

        this.myFriends = [];
        this.newShareEmail = '';

        this._friendsService.getMyFriendsListOnce()
          .then(res => {
            for(let x in res.val()){
              this.myFriends.push(res.val()[x]);
            }
            this.getEmailByShareEmail();
            this.getEmailByShareUsers();
          })
    }

    getEmailByShareEmail() {
      for(let x in this.list.share_email) {
        let email = this.list.share_email[x];
        let index = findIndex(this.myFriends, item => item.email === email);
        if(index != -1) {
          this.shareEmail.push({name: this.myFriends[index].name, email: email, user: this.myFriends[index].user});
        }else{
          this.shareEmail.push({name: email, email: email, user: false});
        }
        this.startShareEmail = angular.copy(this.shareEmail);
      }
    }

    getEmailByShareUsers() {
      for(let x in this.list.share_users) {
        this._authService.getUserByUserId(this.list.share_users[x])
          .then(res => {
            let email = res.val().email;
            let index = findIndex(this.myFriends, item => item.email === email);
            if(index != -1) {
              this.shareEmail.push({name: this.myFriends[index].name, email: email, user: this.myFriends[index].user});
            }else{
              this.shareEmail.push({name: email, email: email, user: false});
            }
            this.startShareEmail = angular.copy(this.shareEmail);
          })
      }
    }

    /**
     * Закрываем диалог
     */
    closeDialog() {
        this._$mdDialog.hide();
    }

    edit() {
        this.loadingFlag = true;
        let create = differenceBy(this.shareEmail, this.startShareEmail, 'email');
        let remove = differenceBy(this.startShareEmail, this.shareEmail, 'email');
        this._listsService.updateList(this.list.title, create, remove)
          .then((data) => {
              this.closeDialog();
          })
          .catch((error) => {
              this._notifyService.error(error);
              this.loadingFlag = false;
          });
    }

    removeEmail(email) {
      this.shareEmail.forEach((item, i) => {
        if(item==email){
          this.shareEmail.splice(i,1);
          return;
        }
      })
    }

    transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      }

      return { name: chip, email: chip }
    }

    myFriendsWithoutChange() {
      return differenceBy(this.myFriends, this.shareEmail, 'email');
    }

    checkoutLastChip() {
      let lastEmail = this.shareEmail[this.shareEmail.length-1].email;
      let findIndex = -1;
      for(let i = 0; i<this.shareEmail.length-1; i++) {
        if(this.shareEmail[i].email === lastEmail) {
          findIndex = i;
          break;
        }
      }
      if(findIndex != -1) {
        this.shareEmail.splice(this.shareEmail.length-1,1);
      }
    }
}


ListEditModalController.$inject = ['$mdDialog', 'progressService', 'authService',
    'notifyService', '$state', 'listsService', 'friendsService', 'list'
];

export {
  ListEditModalController
}
