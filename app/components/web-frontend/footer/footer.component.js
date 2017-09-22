'use strict';

angular.module('my-app.footer', [])
    .component('footerComponent', {
        templateUrl: 'app/components/web-frontend/footer/footer.template.html',
        controller: 'footerCtrl'
    })
    .controller('footerCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    }]);