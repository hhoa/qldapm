'use strict';

angular.module('my-app.list-work', [])
    .component('listBoxComponent', {
        templateUrl: 'app/components/web-frontend/list-box/list-box.template.html',
        controller: 'listBoxCtrl'
    })
    .controller('listBoxCtrl', ['$scope', '$rootScope', '$http', '$location', 'customerAuthentication',
        function($scope, $rootScope, $http, $location, customerAuthentication) {



        }]);