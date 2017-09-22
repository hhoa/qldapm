'use strict';

angular.module('my-app.sign-up.employee', [])
    .controller('singUpEmployeeController', ['$scope', '$http', '$location', '$window', 'customerAuthentication', 'customScopes',
        function ($scope, $http, $location, $window, customerAuthentication, customScopes){

            $window.document.title = "Nhà tuyển dụng/ Người tìm việc - Đăng ký";


            /*$scope.createAccount = () => {
                let newAccount = {

                };
                //insert
                $http.post('/api/add-account', newAccount, {headers: {'Content-Type': 'application/json'}})
                    .then( (res) => {
                        customerAuthentication.login($scope.userName, $scope.password)
                            .then( (result) => {
                                $location.path("/");
                            },  (error) => {
                            });
                    }, (err) => {
                        console.log(err);
                    });
            };*/

        }]);