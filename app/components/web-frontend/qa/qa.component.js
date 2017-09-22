'use strict';

angular.module('florist.qa', [])
    .controller('QAController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $http({
            method: 'GET',
            url: '/api/get-qa/' + $routeParams.params
        }).then((res) => {
           //console.log(res.data);
           $scope.qa = res.data;
        }, () => {

        });
    }]);