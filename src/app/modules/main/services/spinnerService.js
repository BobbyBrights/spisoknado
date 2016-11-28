class SpinnerService {
    constructor($rootScope) {
        this.showSpinner = false;

        let onStateChangeStart = $rootScope.$on('$stateChangeStart', () => this.showSpinner = true);
        let onStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', () => this.showSpinner = false);
        let onStateChangeError = $rootScope.$on('$stateChangeError', () => this.showSpinner = false);
    }
}

SpinnerService.$inject = ['$rootScope'];

export {SpinnerService};
