'use strict';

angular.module('florist.admin-faq', ['florist.admin-buttons-add-new'])
    .controller('AdminFaqController', ['$scope', '$http', '$location', 'customScopes', function ($scope, $http, $location, customScopes) {

        $http({
            method: 'GET',
            url: '/api/admin/get-qa'
        }).then((res) => {
            $scope.qa = res.data;
        }, (error) => {
            console.log(error);
        });

        $scope.addNewOnClick = () => {
            $location.path('/admin/faq/create');
        };

        $scope.showDialogToEdit = (index) => {
            $location.path('/admin/faq/edit/' + index);
        };

        $scope.countFAQs = () => {
            if($scope.qa === undefined){
                return 0;
            }
            return $scope.qa.length;
        };

    }]);