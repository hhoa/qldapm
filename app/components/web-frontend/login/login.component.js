'use strict';

angular.module('florist.login', [])
    .controller('LoginController', ['$scope', '$http', '$location', '$window', 'customerAuthentication', 'customScopes',
        function ($scope, $http, $location, $window, customerAuthentication, customScopes) {

            customScopes.setBackgroundDisplay(true);
            $window.document.title = "Login - Florist";
            $scope.loginInvalid = "";

            $http({
                method: 'GET',
                url: '/api/get-customer-info'
            }).then( (res) => {

                $scope.customerInfo = res.data;
                if($scope.customerInfo){
                    $location.path('/');
                }

            }, (res) => {
                console.log('error when get products');
            });

            $scope.customerLogin = () => {
                /* check username required */
                $scope.passwordErr = null;
                $scope.userNameErr = null;
                if($scope.userName === undefined || $scope.userName === null){
                    $scope.userNameErr = "Vui lòng nhập tên tài khoản";
                } else {
                    if($scope.userName.length < 1){
                        $scope.userNameErr = "Vui lòng nhập tên tài khoản";
                    } else {
                        $scope.userNameErr = null;
                    }
                }
                /* check password required */
                if($scope.password === undefined || $scope.password === null){
                    $scope.passwordErr = "Vui lòng nhập mật khẩu";
                } else {
                    if($scope.password.length < 1){
                        $scope.passwordErr = "Vui lòng nhập mật khẩu";
                    } else {
                        $scope.passwordErr = null;
                    }
                }
                /* it's ok */
                if($scope.passwordErr === null && $scope.userNameErr === null){
                    /* ok check correct username and password */
                    customerAuthentication.login($scope.userName, $scope.password)

                        .then( (res) => {
                            $location.path('/');
                        }, (error) => {
                            $scope.loginInvalid = "Tài khoản hoặc mật khẩu không đúng!";
                            console.log(error);
                        });
                }
            };

            $scope.customerSignupClick = () => {
                $location.path('/sign-up');
            };

        }]);