class ListsController {
  constructor($rootScope, $mdDialog, progressService, notifyService, $scope, listsService) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._notifyService = notifyService;
    this._listsService = listsService;
    this.myLists = [];
    this.myShareLists = [];
    this.createOn();
    this.createOnShare();
  }

  createOn() {
      var _this = this;
      this.refMyList = this._listsService.getMyListsList();
      this.refMyList.on('child_added', function(data) {

          _this._listsService.getListById(data.val().key)
            .then(data => {
                var list = data.val();
                list.key = data.key;
                _this.myLists.push(list);
                _this._$rootScope.$apply();
            });

      });
      this.refMyList.on('child_removed', function(data) {
          for(var i = 0; i<_this.myLists.length; i++) {
              if(_this.myLists[i].key == data.val().key){
                _this.myLists.splice(i,1);
                _this._$rootScope.$apply();
                break;
              }
          }
      });
      this.refMyList.on('child_changed', function(data) {
          for(var i = 0; i<_this.myLists.length; i++) {
              if(_this.myLists[i].key == data.val().key){
                _this._listsService.getListById(data.val().key)
                    .then(data => {
                        var list = data.val();
                        list.key = data.key;
                        _this.myLists[i] = list;
                        _this._$rootScope.$apply();
                    });
                break;
              }
          }
      });
  }

  createOnShare() {
      var _this = this;
      this.refMyList = this._listsService.getMyShareListsList();
      this.refMyList.on('child_added', function(data) {

          _this._listsService.getListById(data.val().key)
            .then(data => {
                var list = data.val();
                list.key = data.key;
                _this.myShareLists.push(list);
                _this._$rootScope.$apply();
            });

      });
      this.refMyList.on('child_removed', function(data) {
          for(var i = 0; i<_this.myShareLists.length; i++) {
              if(_this.myShareLists[i].key == data.val().key){
                _this.myShareLists.splice(i,1);
                _this._$rootScope.$apply();
                break;
              }
          }
      });
      this.refMyList.on('child_changed', function(data) {
          for(var i = 0; i<_this.myShareLists.length; i++) {
              if(_this.myShareLists[i].key == data.val().key){
                _this._listsService.getListById(data.val().key)
                    .then(data => {
                        var list = data.val();
                        list.key = data.key;
                        _this.myShareLists[i] = list;
                        _this._$rootScope.$apply();
                    });
                break;
              }
          }
      });
  }

}

ListsController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope', 'listsService'];

export {
  ListsController
}
