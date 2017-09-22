'use strict';

angular.module('my-app.home', ['my-app.slider'])
    .controller('homeCtrl', ['$scope', '$location', '$window', '$http', '$timeout', function ($scope, $location, $window, $http, $timeout) {
        $window.document.title = "Việt làm nhanh chóng, tiện ích";
        $scope.slides = [
            {
                url: "/media/slides/a/a-slider1.jpg",
                href: '',
                label: ''
            },
            {
                url: "/media/slides/a/a-slider2.jpg",
                href: '',
                label: ''
            }
        ];

        $scope.is_feed_back_err = null;

        $scope.clear = () => {
            $scope.name    = "";
            $scope.email   = "";
            $scope.phone   = "";
            $scope.message = "";
        };

        /* function */
        $scope.submitFeedBack = () => {
            let name = angular.element('#name').val();
            let email = angular.element('#email').val();
            let phone = angular.element('#phone').val();
            let message = angular.element('#message').val();

            if(name && email && phone && message) {
                $scope.is_feed_back_err = null;
                $http.post('/api/feed-back/save', {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                }, { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {
                        $scope.is_feed_back_done = true;
                        $scope.clear();
                        $timeout(() => {
                            $scope.is_feed_back_done = null;
                        }, 3000);
                    }, (error) => {
                        console.log(error);
                    });
            } else {
                $scope.is_feed_back_err = true;
            }
        };
    }]);