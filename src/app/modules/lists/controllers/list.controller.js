import {findIndex, remove} from 'lodash';

/**
 * Created by gr on 29.07.16.
 */
class ListController {
  constructor($rootScope, $mdDialog, progressService, notifyService, $scope, listsService, listId, $state, email, kod) {
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this._notifyService = notifyService;
    this._listsService = listsService;

    this.listObject = {};
    this.listId = listId;
    this.email = email;
    this.kod = kod;
    this.newItem = "";
    this.last_update = {
      data: new Date(),
      item: ""
    };

    if(this.email!='' && this.kod!=''){
      this.checkListByShareEmail();
    }else{
      let _this = this;
      let interval_current_user = window.setInterval(function(){
        if(CONSTANT_SPISOKNADO.user_uid!=null){
          _this.checkPermission();
          window.clearInterval(interval_current_user);
        }
      },15);
    }
  }

  createOnChange() {
    let _this = this;
    firebase.database().ref('lists/' + this.listId).on('child_changed', function(data) {
          if(typeof data.val().date == 'string' && data.val().date!=_this.last_update.date){

            if(data.val().user == CONSTANT_SPISOKNADO.user_uid){
              return;
            }

            _this.last_update = data.val();
            if(data.val().action == "update"){
              _this.updateItem(data.val().item);
              return;
            }
            if(data.val().action == "remove"){
              _this.removeItemFront(data.val().item);
            }
          }
    });
  }

  checkPermission() {
    this._listsService.iHavePermissionToList(this.listId)
        .then((res) => {
          let flag = false;
          for(let x in res.val()){
            if(res.val()[x].key==this.listId){
              flag = true;
              break;
            }
          }
          if(!flag){
            this._listsService.iHavePermissionToShareList(this.listId)
              .then((res) => {
                let flag = false;
                for(let x in res.val()){
                  if(res.val()[x].key==this.listId){
                    flag = true;
                    break;
                  }
                }
                if(!flag){
                  this._$state.go('lists.list');
                }else{
                  this.createOnChange();
                  this.loadList();
                }
              });
          }else{
            this.createOnChange();
            this.loadList();
          }
        });
  }

  checkListByShareEmail() {
    this._listsService.getListById(this.listId)
      .then((res) => {
        if(res.val().secret_key!=this.kod){
          this._$state.go('lists.list');
          return;
        }
        let flag = true;
        for(let x in res.val().share_email){
          if(res.val().share_email[x]==this.email){
            flag = true;
            break;
          }
        }
        if(!flag){
          this._$state.go('lists.list');
        }else{
          this.createOnChange();
          this.loadList();
        }
      });
  }

  loadList() {
    this._listsService.getListById(this.listId)
      .then((res) => {
        this.listObject = res.val();
        this.listObject.id = res.key;
        this._$rootScope.$apply();
        this.loadParentItems();
      });
  }

  loadParentItems() {
    let items = this.listObject.items;
    this.listObject.items = [];
    for(let x in items){
      this._listsService.getItemById(items[x])
        .then((res) => {
          this.listObject.items.unshift({value: res.val(), key: res.key});
          this._$rootScope.$apply();
        });
    }
  }

  addItem() {
    if(!this.newItem){
      return;
    }
    this._listsService.createItem(this.listObject.id,this.newItem);
    this.newItem = "";
  }

  updateItem(itemId) {
    let index = findIndex(this.listObject.items, function(o) { return o.key == itemId; });
    if(index == -1){
      this.addItemToList(itemId);
      return;
    }
    this._listsService.getItemById(itemId)
        .then((res) => {
          this.listObject.items[index] = {value: res.val(), key: res.key};
          this._$rootScope.$apply();
        });
  }

  addItemToList(itemId) {
    this._listsService.getItemById(itemId)
        .then((res) => {
          this.listObject.items.unshift({value: res.val(), key: res.key});
          this._$rootScope.$apply();
        });
  }

  removeItem(itemId){
    remove(this.listObject.items, function(o) { return o.key == itemId; });
    this._listsService.removeItemById(this.listObject.id, itemId)
  }

  removeItemFront(itemId){
    remove(this.listObject.items, function(o) { return o.key == itemId; });
  }

}

ListController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope', 'listsService', 'listId', '$state', 'email', 'kod'];

export {
  ListController
}
