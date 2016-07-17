class ListsController {
  constructor($rootScope, $mdDialog, progressService, notifyService, $scope, listsService) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._notifyService = notifyService;
    this._listsService = listsService;
    this.myLists = [];
    this.myListsId = [];
    this.loadMyListId();
  }

  loadMyListId() {
    var _this = this;
    this._listsService.getMyListsId()
      .then(data => {
          _this.myListsId = data.val();
          _this._$rootScope.$apply();
          _this.getMyListsById(_this.myListsId);
      });

  }

  getMyListsById(idList) {
      this.myLists = [];
      var _this = this;
      var length = 0;
      for(var y in idList){
        length++;
      }
      var i = 0;
      for(var x in idList){
          i++;
          _this._listsService.getListById(idList[x])
            .then(data => {
                _this.myLists.push(data.val());
                _this._$rootScope.$apply();
            });
          if(i==length){
              _this.createOn();
          }
      }
  }

  createOn() {
      /*var _this = this;
      this.refMyList = this._listsService.getMyListsList();
      this.refMyList.on('child_added', function(data) {
          _this.loadMyListId();
      });
      this.refMyList.on('child_removed', function(data) {
          _this.loadMyListId();
      });
      this.refMyList.on('child_changed', function(data) {
          _this.loadMyListId();
      });
      this.refMyList.on('child_moved', function(data) {
          _this.loadMyListId();
      });*/
  }

}

ListsController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope', 'listsService'];

export {
  ListsController
}
