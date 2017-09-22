'use strict';

let app_admin = angular.module('my-app.admin', [
    'ngRoute',
]);

app_admin.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        let route = [
            // {
            //     url: '',
            //     templateUrl: 'app/components/web-admin/',
            //     controller: ''
            // }
        ];
        
        for(let i = 0; i < route.length; i++){
            $routeProvider
                .when(route[i].url, {
                    templateUrl: route[i].templateUrl,
                    controller: route[i].controller,
                    resolve: {
                        auth: ["$q", "$http", "$location", '$timeout', '$window', '$rootScope', function($q, $http, $location, $timeout, $window, $rootScope) {

                            $rootScope.is_admin = 1;
                            $window.document.title = "Trang Chủ Admin";

                            let userInfo = null;
                            $http({
                                method: 'GET',
                                url: '/api/admin/check-authentication'
                            }).then( (res) => {

                                if(res.data.checked === true){
                                    userInfo = res.data.admin;

                                    if(route[i].url === '/admin/login')
                                        $location.path('/admin');
                                }

                                if (!userInfo) {
                                    $rootScope.is_admin = 2;
                                    $location.path('/admin/login');
                                }

                            },  (err) => {

                            });
                        }]
                    }
                });
        }

        $locationProvider.html5Mode(true);
    }]);

app_admin.factory("authentication", ['$http', '$q', '$window', function($http, $q, $window) {
        let user_info;

        let login = (username, password) => {
            let deferred = $q.defer();

            $http.post("/api/admin/login", { username: username, password: password })
                .then((result) => {
                    user_info = {
                        access_token: result.data.access_token,
                        username: result.data.username
                    };
                    $window.sessionStorage["user_info"] = JSON.stringify(user_info);
                    deferred.resolve(user_info);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        let logout = (user_info) => {
            let deferred = $q.defer();
            $http({
                method: "POST",
                url: "/api/admin/logout",
                headers: {
                    "access_token": user_info.access_token
                }
            }).then((result) => {
                user_info = null;
                $window.sessionStorage["user_info"] = null;
                deferred.resolve(result);
            }, (error) => {
                deferred.reject(error);
                console.log(error);
            });

            return deferred.promise;
        };

        let getUserInfo = () => {
            return user_info;
        };

        let init = () => {
            if ($window.sessionStorage["user_info"]) {
                user_info = JSON.parse($window.sessionStorage["user_info"]);
            }
        };
        init();

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo
        };
    }]);