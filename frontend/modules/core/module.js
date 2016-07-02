(function() {

    var core = angular.module("modules.core", []);

    core.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar     = true;
    }]);

    core.config(['ngToastProvider', function(ngToast) {
        ngToast.configure({
            animation: 'fade',
            verticalPosition: 'top',
            horizontalPosition: 'right'
        });
    }]);

})();
