/**
 * Сервис уведомлений
 */
class ChNotify {
    /**
     * Конструктор
     * @param toastr
     * @param toastrConfig
     * @param $q
     */
    constructor($q, toastr, toastrConfig) {
        this._toastr = toastr;
        this._$q = $q;
        // конфигурация уведомлялок
        angular.extend(toastrConfig, {
            newestOnTop: false,
            positionClass: 'toast-bottom-right',
            allowHtml: true
        });
    }

    /**
     * Сообщение об успехе
     * @param {string} message
     */
    success(message) {
        this._toastr.success(message);
    }

    /**
     * Сообщение об успехе
     * @param {string} message
     */
    info(message) {
      this._toastr.success(message);
    }

    /**
     * Сообщение об ошибке
     * @param {Object} [error] Объект ошибки
     * @returns {Promise}
     */
    error(error) {
        // если кто-то очень умный зачем-то вызвал без параметров - показать стандартный текст и успокоиться
        if (!error) {
            this._toastr.error('Произошла ошибка');
            return this._$q.reject();
        }
        // иначе попробуем разобрать, что же нам пришло
        // обычно у ошибки есть поле data, попробуем его получить
        let data = error.data || error || {message: 'Произошла ошибка'};
        // теперь у нас полюбому есть объект дата, и в нем что-то есть
        // обычно бэк кладет ошибки в поле message
        // однако авторизация, например, пишет в error_description
        // ну и в конце-концов, там может быть тупо текст
        let message = data.message || data.error_description || data;

        this._toastr.error(message);

        return this._$q.reject(error);
    }

    /**
     * Сообщение о чем-то неприятном
     * @param {string} message
     */
    warning(message) {
        this._toastr.warning(message);
    }
}

ChNotify.$inject = ['$q', 'toastr', 'toastrConfig'];

export {ChNotify};
