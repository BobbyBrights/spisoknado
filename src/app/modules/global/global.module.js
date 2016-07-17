import {NotifyService} from './services/notify.service';
import {ProgressService} from './services/progress.service';

angular.module('spisoknado.global')
  .service('notifyService', NotifyService)
  .service('progressService', ProgressService);
