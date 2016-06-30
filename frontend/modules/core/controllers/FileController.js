(function() {

    var core = angular.module("modules.core");

    core.controller('FileController', ['$scope', 'ngToast', 'FileService', function($scope, ngToast, FileService) {

        var service = new FileService($scope.baseUrl);

        $scope.duplicatedFiles = [];
        
        $scope.getNumberOfLines = function (text) {
        	if (typeof text === "undefined") {
        		return 0;
        	}
        	
        	return text.split(/\r|\r\n|\n/).length;
        };
        
        $scope.getPictureUrl = function (imgurl) {
        	
    		imgurl = imgurl.replace("C:", "");
        	imgurl = imgurl.replace("\\", "/");
        	
        	return "http://localhost:8080/" + imgurl;
    	};

    	$scope.submitDirectoryForm = function () {
        	var directories = $scope.directories.split(/\r|\r\n|\n/);
        	
        	for (var i = 0; i < directories.length; i++) {
        		if (directories[i] === "") {
        			directories[i].splice(i, 1);
        		}
        	}
        	
        	service.getDuplicatedFiles(directories).then(function (response) {
            	$scope.duplicatedFiles = response.data;

            	$scope.searchForDuplicatedFilesIn = $scope.directories;
            	
                $scope.directories = '';

                ngToast.success({
                    content: 'Your request was processed with successfully.'
                });
            });
        };
        
        $scope.submitDuplicatedFilesForm = function () {
        	var filesThatWillBeRemoved = {};
        	
        	for (var hash in $scope.duplicatedFiles) {
        		var currentValues = [];
        		
        		for (var i = 0; i < $scope.duplicatedFiles[hash].length; i++) {
        			if ($scope.duplicatedFiles[hash][i].checked === true) {
        				currentValues.push($scope.duplicatedFiles[hash][i]);
            		}
        		}
        		
        		filesThatWillBeRemoved[hash] = currentValues;
        	}
        	
        	service.removeDuplicatedFiles(filesThatWillBeRemoved).then(function (response) {
            	$scope.duplicatedFiles = [];
                $scope.directories = '';

                ngToast.success({
                    content: 'Your request was processed with successfully.'
                });
            }, function () {
            	ngToast.danger({
                    content: 'An error occurred!'
                });
            });
        }; 

    }]);

})();
