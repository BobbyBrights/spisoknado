import {findIndex, remove} from 'lodash';
import {BaseController} from '../../global/controllers/baseController';

/**
 * Created by gr on 29.07.16.
 */
class ListController extends BaseController {
  constructor($rootScope, $mdDialog, progressService, spinnerService, chNotify, $scope, listsService, listId, $state, email, kod) {
    super(spinnerService, chNotify);
    this._$mdDialog = $mdDialog;
    this._progressService = progressService;
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this._listsService = listsService;

    this.listObject = {};
    this.listId = listId;
    this.email = email;
    this.kod = kod;
    this.newItem = "";
    this.newSubItem = "";
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
            if(data.val().action == "create_sub_item"){
              _this.createOnSubItem(data.val().item);
              return;
            }
            if(data.val().action == "remove"){
              _this.removeItemFront(data.val().item);
              return;
            }
            if(data.val().action == "update_info"){
              this.updateInfoList();
            }
          }
    });
    firebase.database().ref('lists/' + this.listId).on('child_removed', function(data) {
      this._$state.go("lists.list");
    });
  }

  updateInfoList() {
    firebase.database().ref('lists/' + this.listId).once('value')
      .then(res => {
        this.listObject.is_list = res.val().is_list;
        this.listObject.share_email = res.val().share_email;
        this.listObject.share_users = res.val().share_users;
        this.listObject.title = res.val().title;
      })
  }

  checkPermission() {
    this.showSpinner = true;
    this._listsService.iHavePermissionToList(this.listId)
        .then((res) => {
          this.showSpinner = false;
          let flag = false;
          for(let x in res.val()){
            if(res.val()[x].key==this.listId){
              flag = true;
              break;
            }
          }
          if(!flag){
            this.showSpinner = true;
            this._listsService.iHavePermissionToShareList(this.listId)
              .then((res) => {
                this.showSpinner = false;
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
    this.showSpinner = true;
    this._listsService.getListById(this.listId)
      .then((res) => {
        this.showSpinner = false;
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
    this.showSpinner = true;
    this._listsService.getListById(this.listId)
      .then((res) => {
        this.showSpinner = false;
        this.listObject = res.val();
        this.listObject.id = res.key;
        this._$rootScope.$apply();
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
      this.showSpinner = true;
      this._listsService.getItemById(items[x])
        .then((res) => {
          this.showSpinner = false;
          loadItem++;
          this.listObject.items.push({value: res.val(), key: res.key, hide: false, level: 0});
          if(res.val().childs instanceof Object) {
            this.loadAllChild(res.key, res.val().childs);
          }
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
          this.listObject.items[index].value.title = res.val().title;
          this.listObject.items[index].value.count = res.val().count;
          this.listObject.items[index].value.weight = res.val().weight;
          this.listObject.items[index].value.complete = res.val().complete;
          this._$rootScope.$apply();
        });
  }

  addItemToList(itemId) {
    this._listsService.getItemById(itemId)
        .then((res) => {
          this.listObject.items.push({value: res.val(), key: res.key, hide: false, level: 0});
          this._$rootScope.$apply();
        });
  }

  removeItem(itemId){
    let item = this.listObject.items[findIndex(this.listObject.items, function(o) { return o.key == itemId; })];

        if(item.value.childs instanceof Object) {
          const confirm = this._$mdDialog.confirm({
              title: 'Удалить пункт со всеми подпунктами?',
              ok: 'Удалить',
              cancel: 'Отмена'
          });
          this._$mdDialog.show(confirm)
            .then(() => {
              this.removeItemFront(itemId);
              this._listsService.removeItemById(this.listObject.id, itemId);
            })
        }else{
          this.removeItemFront(itemId);
          this._listsService.removeItemById(this.listObject.id, itemId)
        }
  }

  removeItemFront(itemId){

    let item = this.listObject.items[findIndex(this.listObject.items, function(o) { return o.key == itemId; })];

    if(item.value.childs instanceof Object) {
      for(let x in item.value.childs){
        this.removeItemFront(item.value.childs[x]);
      }
    }

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
    let weight = this.listObject.items[findIndex(this.listObject.items, o => o.key === item.key)].value.weight;
    this.listObject.items[findIndex(this.listObject.items, o => o.key == item.key)].value.weight = weight === '' ? 0 : weight;
    this._listsService.updateFrontItem(this.listObject.id, item);
    item.hide = false;
    this.updateChildFront(item);
  }

  updateChildFront(item) {
    if(item.value.childs instanceof Object) {
      for(let x in item.value.childs){
        if(!this.listObject.items[findIndex(this.listObject.items, o => o.key === item.value.childs[x])]) {
          return;
        }
        this.listObject.items[findIndex(this.listObject.items, o => o.key === item.value.childs[x])].value.complete = item.value.complete;
        this.updateChildFront(this.listObject.items[findIndex(this.listObject.items, o => o.key === item.value.childs[x])]);
      }
    }
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
      if(it.value.complete && it.value.sumConsider) {
        sum += it.value.weight*it.value.count;
      }
    });
    return sum;
  }

  getAllSum() {
    if(!this.listObject.items || !this.listObject.items.length) {
      return 0;
    }
    let sum = 0;
    this.listObject.items.forEach(it => {
      if(it.value.sumConsider) {
        sum += it.value.weight*it.value.count;
      }
    });
    return sum;
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
    this._listsService.updateNotConsiderCount(this.listObject.items);
  }

  changeIsList() {
    this._listsService.updateIsList(this.listObject.id, this.listObject.is_list);
  }

  addSubItem(item) {
    let itemId = this._listsService.newSubItem(this.listObject.id, item, this.newSubItem);
    this.createOnSubItem(itemId);
    this.newSubItem = "";
  }

  checkOnNullWeight(item) {
    let weight = this.listObject.items[findIndex(this.listObject.items, o => o.key === item.key)].value.weight;
    this.listObject.items[findIndex(this.listObject.items, o => o.key == item.key)].value.weight = weight === 0 ? '' : weight;
  }

  createOnSubItem(itemId) {
    this.showSpinner = true;
    this._listsService.getItemById(itemId)
      .then(res => {
        this.showSpinner = false;
        if(!res.val()){
          return;
        }
        let parentId = res.val().parent;
        let index = findIndex(this.listObject.items, o => o.key === parentId);
        this.listObject.items[index].level = this.listObject.items[index].level ? this.listObject.items[index].level : 0;
        let level = this.listObject.items[index].level > 9 ? 10 : this.listObject.items[index].level+1;
        this.listObject.items = this._listsService.addToMasByIndex(this.listObject.items, index+1, {value: res.val(), key: res.key, hide: false, level: level});
        this._$rootScope.$apply();
        if(res.val().childs instanceof Object) {
          this.loadAllChild(res.key, res.val().childs);
        }
      });
  }

  loadAllChild(parentId, childs) {
    for(let x in childs) {
      this.createOnSubItem(childs[x]);
    }
  }

  hasChild(item) {
    if(item.value.childs instanceof Object){
      for(let x in item.value.childs) {
        return true;
      }
    }
    return false;
  }

  rootIsComplete(item) {
    let parent = item;
    let findParent = {};
    while(parent !== null) {
      findParent = parent;
      parent = this.findParent(parent);
    }
    return findParent.value.complete;
  }

  findParent(index) {
    if(index.value.parent === '' || !index.value.parent) {
      return null;
    }
    return this.listObject.items[findIndex(this.listObject.items, o => o.key === index.value.parent)];
  }

  getSumWeightChild(item) {
    let sum = 0;
    if(!(item.value.childs instanceof Object)){
      return sum;
    }
    for(let x in item.value.childs) {
      let newItem = this.listObject.items[findIndex(this.listObject.items, o => o.key === item.value.childs[x])];
      if(newItem) {
        if(newItem.value.childs instanceof Object) {
          sum += this.getSumWeightChild(newItem);
        }else{
          sum += newItem.value.weight*newItem.value.count;
        }
      }
    }
    return sum;
  }

}

ListController.$inject = ['$rootScope', '$mdDialog', 'progressService', 'spinnerService', 'chNotify', '$scope', 'listsService', 'listId', '$state', 'email', 'kod'];

export {
  ListController
}
