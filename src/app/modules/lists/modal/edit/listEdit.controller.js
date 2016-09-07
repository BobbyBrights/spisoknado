import {findIndex} from 'lodash';

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
        console.log(email,index);
        if(index != -1) {
          this.shareEmail.push({name: this.myFriends[index].name, email: email});
        }else{
          this.shareEmail.push({name: email, email: email});
        }
      }
    }

    getEmailByShareUsers() {
      for(let x in this.list.share_users) {
        this._authService.getUserByUserId(this.list.share_users[x])
          .then(res => {
            let email = res.val().email;
            let index = findIndex(this.myFriends, item => item.email === email);
            if(index != -1) {
              this.shareEmail.push({name: this.myFriends[index].name, email: email});
            }else{
              this.shareEmail.push({name: email, email: email});
            }
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
        this._listsService.createList(this.list, this.shareEmail)
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
}


ListEditModalController.$inject = ['$mdDialog', 'progressService', 'authService',
    'notifyService', '$state', 'listsService', 'friendsService', 'list'
];

export {
  ListEditModalController
}
