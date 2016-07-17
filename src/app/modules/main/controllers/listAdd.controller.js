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
    }

    /**
     * Закрываем диалог
     */
    closeDialog() {
        this._$mdDialog.hide();
    }

    create() {
        this.loadingFlag = true;
        this._listsService.createList(this.list)
          .then((data) => {
              this.closeDialog();
          })
          .catch((error) => {
              this._notifyService.error(error);
              this.loadingFlag = false;
          });
    }
}


ListAddModalController.$inject = ['$mdDialog', 'progressService',
    'notifyService', '$state', 'listsService'
];

export {
    ListAddModalController
}
