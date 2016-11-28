import {ListEditModalController} from '../modal/edit/listEdit.controller';
import {BaseController} from '../../global/controllers/baseController';
import {findIndex, remove} from 'lodash';

class ListsController extends BaseController {
  constructor($rootScope, $mdDialog, progressService, spinnerService, chNotify, $scope, listsService, $state, authService) {
    super(spinnerService, chNotify);
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._authService = authService;
    this._$scope = $scope;
    this._$state = $state;
    this._listsService = listsService;
    this.myLists = [];
    this.myShareLists = [];
    let _this = this;
    this._authService.createAuthToken();
    _this.showSpinner = true;
    let interval_current_user = window.setInterval(function(){
      if(CONSTANT_SPISOKNADO.user_uid!=null){
        _this.showSpinner = false;
        if(!CONSTANT_SPISOKNADO.user_first_auth) {
          _this._listsService.createShareListByNewUserBegin(CONSTANT_SPISOKNADO.user_email, CONSTANT_SPISOKNADO.user_uid);
        }
        _this.createOn();
        _this.createOnShare();
        window.clearInterval(interval_current_user);
      }
    },15);
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
                if(data.val() === null) {
                  return;
                }
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

  goToList(list) {
      this._$state.go('lists.listCard',{id: list.key});
  }

  openModalEdit(list) {
    this._$mdDialog.show({
      templateUrl: 'app/modules/lists/modal/edit/listEdit.html',
      controller: ListEditModalController,
      controllerAs: 'editCtrl',
      clickOutsideToClose:true,
      locals: {
        list: list
      }
    })
  }

  removeList(list) {
    let _confirm = this._$mdDialog.confirm()
      .title('Удаление списка')
      .textContent('Вы действительно хотите удалиль список?')
      .ok('Удалить')
      .cancel('Отмена');

    this._$mdDialog.show(_confirm)
      .then(() => {
        this._listsService.removeList(list);
      })
  }

}

ListsController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'spinnerService', 'chNotify', '$scope', 'listsService', '$state', 'authService'];

export {
  ListsController
}
