class BaseController {
    constructor(spinnerService, chNotify) {
        this._spinnerService = spinnerService;
        this._chNotify = chNotify;
        this.MAX_PAGE_SIZE = 1000;

        this.totalCount = 0;
        this.pageNo = 0;
    }

    get showSpinner() {
        return this._spinnerService.showSpinner;
    }

    set showSpinner(showSpinner) {
        this._spinnerService.showSpinner = showSpinner;
    }

    /**
     * Выполняем промис, показываем спиннер
     * @param {Promise} promise
     * @param {boolean} isErrorNotify
     * @returns {Promise}
     */
    doPromise(promise, isErrorNotify = true) {
        this.showSpinner = true;

        promise.finally(() => this.showSpinner = false);

        if (!isErrorNotify) {
            return promise;
        }

        return promise.then(res => {
          if(res.error) {
            this._chNotify.error(res.error);
          }
          if(res.message) {
            this._chNotify.success(res.message);
          }
          return res;
        }).catch(error => this._chNotify.error(error));
    }
}

export {BaseController};
