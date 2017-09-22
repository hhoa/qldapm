/**
 * Created by angel on 6/27/2017.
 */
'use strict';

angular.module("florist.admin-login", [])
    .controller('AdminLoginController', ['$scope', '$http', '$location', 'authentication',
        function($scope, $http, $location, authentication){

            $scope.loginInvalid = "";

            $scope.userInfo = null;
            $scope.login = () => {
                /* check username required */
                if($scope.userName === undefined || $scope.userName === null){
                    $scope.userNameErr = "Please enter admin username";
                    return;
                } else {
                    $scope.userNameErr = null;
                }
                /* check password required */
                if($scope.password === undefined || $scope.password === null){
                    $scope.passwordErr = "Please enter admin password";
                    return;
                } else {
                    $scope.passwordErr = null;
                }
                /* ok check correct username and password */
                authentication.login($scope.userName, $scope.password)
                    .then((result) => {
                        $scope.userInfo = result;
                        $location.path("/admin");
                    }, (error) => {
                        $scope.loginInvalid = "Login failed! Username or password incorrect!";
                        //console.log(error);
                    });
            };
        }]);