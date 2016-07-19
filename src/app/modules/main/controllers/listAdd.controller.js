/**
 * Created by gr on 10.05.16.
 */
class ListAddModalController {
    constructor($mdDialog, progressService, notifyService, $state, listsService) {
        this._$mdDialog = $mdDialog;
        this._listsService = listsService;
        this._progressService = progressService;
        this._$state = $state;
        this._notifyService = notifyService;
        this.loadingFlag = false;
        this.list = {
            title: ""
        };
        this.shareEmail = [];
        this.newShareEmail = '';
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
              this._notifyService.error(error);
              this.loadingFlag = false;
          });
    }

    addShareEmail() {
      if(this.newShareEmail==null || this.newShareEmail===undefined || this.newShareEmail==''){
        return;
      }
      this.shareEmail.push(this.newShareEmail);
      this.newShareEmail = '';
    }

    removeEmail(email) {
      this.shareEmail.forEach((item, i) => {
        if(item==email){
          this.shareEmail.splice(i,1);
          return;
        }
      })
    }
}


ListAddModalController.$inject = ['$mdDialog', 'progressService',
    'notifyService', '$state', 'listsService'
];

export {
    ListAddModalController
}
