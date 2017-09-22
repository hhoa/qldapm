'use strict';

angular.module('my-app.404', [])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
        $routeProvider
            .when('/404', {
                templateUrl: 'app/components/web-frontend/404/404.template.html',
                controller: '404Controller'
            });
    }])
    .controller('404Controller', ['$window', function ($window) {
    	$window.document.title = '404 - Không tìm thấy trang';
    }]);