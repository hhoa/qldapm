'use strict';

angular.module('florist.admin-cms', ['florist.admin-buttons-add-new'])
    .controller('AdminCmsController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        $http({
            method: 'GET',
            url: '/api/admin/get-cms'
        }).then((res) => {
            $scope.cms = res.data;
        }, (error) => {
            console.log(error);
        });

        $scope.addNewOnClick = () => {
            $location.path('/admin/pages/create');
        };

        $scope.showDialogToEdit = (index) => {
            $location.path('/admin/pages/edit/' + index);
        };

        $scope.getStatus = (_boolean) => {
            if(_boolean === true){
                return 'Enabled';
            } else {
                return 'Disabled';
            }
        };

        $scope.countCms = () => {
            if($scope.cms === undefined){
                return 0;
            }
            return $scope.cms.length;
        };

    }]);