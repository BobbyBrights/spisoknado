import {ProgressService} from './services/progress.service';
import {chSpinner} from './directive/chSpinner/chSpinner';
import {ChNotify} from './services/chNotifyService';

angular.module('spisoknado.global')
  .directive('chSpinner', chSpinner)
  .service('chNotify', ChNotify)
  .service('progressService', ProgressService);
