/**
 * Created by gr on 03.05.16.
 */
class ProgressService {
  constructor($mdDialog) {
    this._$mdDialog = $mdDialog;
    this.flagHide = false;
    this.flagLoad = false;
  }

  showCircular(){

    var _this = this;
    this.flagHide = false;
    this.flagLoad = true;
    var show = this._$mdDialog.show({
      escapeToClose: false,
      templateUrl: 'app/modules/global/templates/loading.html',
      onComplete: function(){
        _this.flagLoad = false;
        if(_this.flagHide){
          _this._$mdDialog.hide();
          _this.flagHide = false;
        }
      }
    })
  }

  hideCircular(){
    if(!this.flagLoad){
      this._$mdDialog.hide();
    }
    this.flagHide = true;
  }

}

ProgressService.$inject = ['$mdDialog'];

export {ProgressService}
