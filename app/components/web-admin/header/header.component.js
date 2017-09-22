/**
 * Created by angel on 6/27/2017.
 */

'use strict';

angular.module("florist.admin-header", [])
    .component('adminHeaderComponent', {
        templateUrl: 'app/components/web-admin/header/header.template.html',
        controller: 'AdminHeaderController',
    })
    .controller('AdminHeaderController', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'authentication',
        function($scope, $rootScope, $http, $location, $timeout, authentication){

            $http({
                method: 'GET',
                url: '/api/admin/get-authentication'
            }).then( (res) => {
                $scope.userInfo = res.data;
            });

            $scope.logout =  () => {
                authentication.logout($scope.userInfo)
                    .then( () => {
                        $scope.userInfo = null;
                        $location.path("/admin/login");
                    },  (error) => {
                        console.log(error);
                    });
            };

            $scope.home = () => {
                $rootScope.isAdmin = null;
                $location.path('/');
            };

        }]);