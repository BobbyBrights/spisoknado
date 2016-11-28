import {findIndex, differenceBy} from 'lodash';
/**
 * Created by gr on 10.05.16.
 */
class ListAddModalController {
    constructor($mdDialog, progressService, chNotify, $state, listsService, friendsService) {
        this._$mdDialog = $mdDialog;
        this._listsService = listsService;
        this._progressService = progressService;
        this._$state = $state;
        this._chNotify = chNotify;
        this._friendsService = friendsService;
        this.loadingFlag = false;
        this.selectedItem = null;
        this.searchText = null;
        this.list = {
            title: ""
        };
        this.myFriends = [];
        this.shareEmail = [];
        this.newShareEmail = '';

        this._friendsService.getMyFriendsListOnce()
          .then(res => {
            for(let x in res.val()){
              this.myFriends.push(res.val()[x]);
            }
          })
    }

    /**
     * Закрываем диалог
     */
    closeDialog() {
        this._$mdDialog.hide();
    }

    create() {
        this.loadingFlag = true;
        this._listsService.createList(this.list, this.shareEmail)
          .then((data) => {
              this.closeDialog();
          })
          .catch((error) => {
              this._chNotify.error(error);
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
        this.shareEmail.splice(findIndex,1);
      }
    }
}


ListAddModalController.$inject = ['$mdDialog', 'progressService',
    'chNotify', '$state', 'listsService', 'friendsService'
];

export {
    ListAddModalController
}
