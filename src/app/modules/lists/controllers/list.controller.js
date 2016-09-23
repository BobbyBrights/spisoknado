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
    this.showRemove = false;
    this.countMas = [];
    for(let i = 1; i<101; i++) {
      this.countMas.push(i);
    }
    this.editable = true;

    if(this.email!='' && this.kod!=''){
      this.checkListByShareEmail();
      this.editable = false;
    }else{
      let _this = this;
      let t = 0;
      let interval_current_user = window.setInterval(function(){
        t++;
        if(CONSTANT_SPISOKNADO.user_uid!=null || t>200){
          _this.checkPermission();
          window.clearInterval(interval_current_user);
        }
      },15);
    }
  }

  creteOnDeleteShareForUser() {
    let _this = this;
    firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/share_lists').once('value')
      .then(res => {
        for(let x in res) {
          if(res[x].key === this.listId){
            firebase.database().ref('users/' + CONSTANT_SPISOKNADO.user_uid + '/share_lists/' + x).on('child_removed', function(data) {
              _this._$state.go("lists.list");
            });
            break;
          }
        }
      });
  }

  creteOnDeleteShareForEmail() {
    let _this = this;
    firebase.database().ref('lists/' + this.listId + '/share_email').once('value')
      .then(res => {
        for(let x in res) {
          if(res[x] === this.email){
            firebase.database().ref('lists/' + this.listId + '/share_email' + x).on('child_removed', function(data) {
              _this._$state.go("lists.list");
            });
            break;
          }
        }
      });
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
              return;
            }
            if(data.val().action == "update_info"){
              this._$state.reload();
            }
          }
    });
    firebase.database().ref('lists/' + this.listId).on('child_removed', function(data) {
      this._$state.go("lists.list");
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
                  this.creteOnDeleteShareForUser();
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
        if(res.val().secret_key !== this.kod){
          this._$state.go('lists.list');
          return;
        }
        let flag = true;
        if(!(res.val().share_email instanceof Object)) {
          this._$state.go('lists.list');
          return;
        }
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
          this.creteOnDeleteShareForEmail();
          this.loadList();
        }
      });
  }

  loadList() {
    this._listsService.getListById(this.listId)
      .then((res) => {
        this.listObject = res.val();
        this.listObject.id = res.key;
        this.loadParentItems();
      });
  }

  loadParentItems() {
    let items = this.listObject.items;
    this.listObject.items = [];
    let length = 0;
    for(let x in items){
      length++;
    }
    let loadItem = 0;
    for(let x in items){
      this._listsService.getItemById(items[x])
        .then((res) => {
          loadItem++;
          this.listObject.items.push({value: res.val(), key: res.key, hide: false});
          if(loadItem >= length){
            this._$rootScope.$apply();
          }
        });
    }
  }

  addItem() {
    if(!this.newItem){
      return;
    }
    let itemId = this._listsService.createItem(this.listObject.id,this.newItem);
    this.newItem = "";
    this.addItemToList(itemId);
  }

  updateItem(itemId) {
    let index = findIndex(this.listObject.items, function(o) { return o.key == itemId; });
    if(index == -1){
      this.addItemToList(itemId);
      return;
    }
    this._listsService.getItemById(itemId)
        .then((res) => {
          this.listObject.items[index] = {value: res.val(), key: res.key, hide: false};
          this._$rootScope.$apply();
        });
  }

  addItemToList(itemId) {
    this._listsService.getItemById(itemId)
        .then((res) => {
          this.listObject.items.push({value: res.val(), key: res.key, hide: false});
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

  openUpdateItem(item) {
    if(!this.editable){
      return;
    }
    this.listObject.items.forEach(it => {
      it.hide = it.key === item.key;
      if(it.hide){
        setTimeout(function(){
          $("#item"+item.key).focus();
        },50);
      }
    });
  }

  updateFrontItem(item) {
    this._listsService.updateFrontItem(this.listObject.id, item);
    item.hide = false;
  }

  getSumNotComplete() {
    if(!this.listObject.items || !this.listObject.items.length) {
      return 0;
    }
    let sum = 0;
    this.listObject.items.forEach(it => {
      if(!it.value.complete) {
        sum += it.value.weight*it.value.count;
      }
    });
    return sum;
  }

  getSumComplete() {
    if(!this.listObject.items || !this.listObject.items.length) {
      return 0;
    }
    let sum = 0;
    this.listObject.items.forEach(it => {
      if(it.value.complete) {
        sum += it.value.weight*it.value.count;
      }
    });
    return sum-this.listObject.not_consider_count;
  }

  getAllSum() {
    if(!this.listObject.items || !this.listObject.items.length) {
      return 0;
    }
    let sum = 0;
    this.listObject.items.forEach(it => {
        sum += it.value.weight*it.value.count;
    });
    return sum-this.listObject.not_consider_count;
  }

  updateNotConsiderCount() {
    if(!this.listObject.items || !this.listObject.items.length) {
      return 0;
    }
    let sum = 0;
    this.listObject.items.forEach(it => {
        if(it.value.complete){
          sum += it.value.weight*it.value.count;
        }
    });
    this.listObject.not_consider_count = sum;
    this._listsService.updateNotConsiderCount(this.listObject.id, sum);
  }

  setNullConsiderCount() {
    this.listObject.not_consider_count = 0;
    this._listsService.updateNotConsiderCount(this.listObject.id, 0);
  }

}

ListController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'notifyService', '$scope', 'listsService', 'listId', '$state', 'email', 'kod'];

export {
  ListController
}
