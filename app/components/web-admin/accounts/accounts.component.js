/**
 * Created by angel on 6/27/2017.
 */
'use strict';

angular.module('florist.admin-accounts', ['florist.admin-buttons-add-new'])

    .controller('AdminAccountsController', ['$scope', '$http', '$location',
        function($scope, $http, $location){
            
            $http({
                method: 'GET',
                url: '/api/admin/admins/get'
            }).then((res) => {
                $scope.admins = res.data;

            }, (error) => {
                console.log(error);
            });

            /* get numbers account */
            $scope.countAccount = () => {
                if($scope.admins === undefined || $scope.admins === null){
                    return 0;
                }
                return $scope.admins.length;
            };

            $scope.showDialogToEdit = (admin) => {
                $location.path('/admin/admin/edit/' + admin.username);
            };

            $scope.showDetails = (admin) => {
                $location.path('/admin/admin/details/' + admin.username);
            };

            $scope.addNewOnClick = () => {
                $location.path('/admin/admin/create');
            };
        }]);