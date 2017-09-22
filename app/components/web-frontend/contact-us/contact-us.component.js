'use strict';

angular.module('my-app.contact-us', [])
    .controller('ContactUsController', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {

        $window.document.title = "Contact Us";
        $scope.message_success = null;

        let validName = () => {
            if($scope.name === undefined){
                $scope.name_err = "Vui lòng nhập tên";
            } else {
                if($scope.name.length < 1){
                    $scope.name_err = "Vui lòng nhập tên";
                } else {
                    $scope.name_err = null;
                }
            }
        };

        let validEmail = () => {
            if($scope.email === undefined){
                $scope.email_err = "Vui lòng nhập địa chỉ email";
            } else {
                if($scope.email.length < 1){
                    $scope.email_err = "Vui lòng nhập địa chỉ email";
                } else {
                    $scope.email_err = null;
                }
            }
        };

        let validMessage = () => {
            if($scope.message === undefined){
                $scope.message_err = "Vui lòng để lại một lời nhắn";
            } else {
                if($scope.message.length < 1){
                    $scope.message_err = "Vui lòng để lại một lời nhắn";
                } else {
                    $scope.message_err = null;
                }
            }
        };

        $scope.sendMessage = () => {
            $scope.name_err = null;
            $scope.email_err = null;
            $scope.message_err = null;

            validName();
            validEmail();
            validMessage();

            if($scope.name_err === null && $scope.email_err === null && $scope.message_err === null){
                let content = {
                    name: $scope.name,
                    email: $scope.email,
                    message: $scope.message
                };
                $http.post('/api/feed-back', content,
                    {headers: {'Content-Type': 'application/json'}})
                    .then(() => {
                        $scope.message_success = "Cảm ơn bạn đã để lại nhận xét!";
                        $scope.name = "";
                        $scope.email = "";
                        $scope.message = "";
                    }, () => {

                    });
            }
        };
    }]);