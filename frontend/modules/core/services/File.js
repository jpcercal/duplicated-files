(function() {

    var core = angular.module("modules.core");

    core.factory('FileService', ['$http', function($http) {
        return function (baseUrl) {
            return {
                getDuplicatedFiles: function (directories) {
                    return $http.post(baseUrl + 'api/duplicated-files/', {
                    	directories: directories
                    });
                },
                removeDuplicatedFiles: function (duplicatedFiles) {
                	return $http({
                		url: baseUrl + 'api/remove-files/',
                	    method: "DELETE",
                	    data: {
                	    	duplicatedFiles: duplicatedFiles
                	    },
                	    headers: {'Content-Type': 'application/json'}
                	});
                }
            };
        };
    }]);

})();
