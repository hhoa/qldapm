'use strict';

angular.module("my-app.header", [])
    .component('headerComponent', {
        templateUrl: 'app/components/web-frontend/header/header.template.html',
        controller: 'headerCtrl'
    })
    .controller('headerCtrl', ['$scope', function($scope) {

    }]);
