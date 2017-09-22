/**
 * Created by angel on 6/27/2017.
 */
'use strict';

angular.module("florist.admin-dashboard", [])

    .controller('AdminDashBoardController', ['$scope', '$http', '$location',
        function($scope, $http, $location){

            $http({
                method: "GET",
                url: "/api/get-order"
            }).then((res) => {
                $scope.orders = res.data;
            }, () => {
                console.log('error when getting orders');
            });

            $http.post('/api/products/category', {
            	url: "all"
            }, { headers: {'Content-Type': 'application/json'} })
            .then((res) => {
                $scope.products = res.data;
            }, (error) => {
                console.log(error);
            });

            $http({
                method: 'GET',
                url: '/api/get-accounts'
            }).then((res) => {
                $scope.accounts = res.data;
            }, (error) => {
                console.log(error);
            });



        }]);