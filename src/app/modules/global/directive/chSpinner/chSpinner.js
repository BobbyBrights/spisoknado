 class ChSpinnerController {
    constructor($scope) {
        this._$scope = $scope;
    }

    get ngClass() {
        switch(this._$scope.type) {
            case 'inline':
                return 'loader-inline';
            default:
                return 'loader-wrapper';
        }
    }
}

ChSpinnerController.$inject = ['$scope'];

function chSpinner() {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/global/directive/chSpinner/chSpinner.html',
        scope: {
            show: '=',
            type: '@'
        },
        controller: ChSpinnerController,
        controllerAs: 'spinnerCtrl'
    };
}

export {chSpinner};
