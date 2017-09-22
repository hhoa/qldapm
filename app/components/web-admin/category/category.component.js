'use strict';

angular.module('florist.admin-category', ['florist.admin-buttons-add-new'])
    .controller('AdminCategoryController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        $http({
            method: 'GET',
            url: '/api/get-categories'
        }).then( (res) => {
            $scope.category = res.data;
        },  (error) => {
            console.log(error);
        });

        $scope.addNewOnClick = () => {
            $location.path('/admin/categories/create/');
        };

        $scope.showDialogToEdit = (index) => {
            $location.path('/admin/categories/edit/' + index);
        };

        $scope.getStatus = (_boolean) => {
            if(_boolean === true){
                return 'Enabled';
            } else {
                return 'Disabled';
            }
        };

        $scope.countCategory = () => {
            if($scope.category === undefined){
                return 0;
            }
            return $scope.category.length;
        };

    }]);