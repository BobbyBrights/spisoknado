/**
 * Created by gr on 28.04.16.
 */
class NotifyService {
  constructor($q, toaster) {
    this._toaster = toaster;
    this._$q = $q;
  }

  error(error){
    var data = error;
    if(error.data!==undefined){
      data = error.data;
    }
    if(error.message!==undefined){
      data = error.message;
    }
    this._toaster.pop({
      type: 'error',
      body: data,
      timeout: 10000
    });
    return this._$q.reject(error);
  }

  info(message){
    this._toaster.pop({
      body: message,
      timeout: 10000
    });
  }

}

  NotifyService.$inject = ['$q', 'toaster'];

export {NotifyService}
