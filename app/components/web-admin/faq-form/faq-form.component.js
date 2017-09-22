'use strict';

angular.module('florist.admin-faq-form', ['florist.admin-buttons-add-new'])
    .controller('AdminFaqFormController', ['$scope', '$http', '$location', '$routeParams', 'customScopes', function ($scope, $http, $location, $routeParams, customScopes) {

        let reset = () => {
              $scope.currentFAQ = {
                  q: "",
                  a: "",
                  url: ""
              };
        };

        $http({
            method: 'GET',
            url: '/api/admin/get-qa'
        }).then((res) => {
            $scope.qa = res.data;
            if($routeParams.params){
                $scope.isAddNew = false;

                let index = parseInt($routeParams.params);
                $scope.currentFAQ = $scope.qa[index];
                $scope.title_modal = 'EDIT FAQ';

            } else {
                $scope.isAddNew = true;
                $scope.title_modal = 'CREATE A FAQ';
                reset();
            }
        }, (err) => {
            console.log(err);
        });

        let checkSameUrl = (url) => {
            if(!$scope.isAddNew) return false;
            for(let i = 0 ; i < $scope.qa.length; i++){
                if($scope.qa[i].url === url){
                    return true;
                }
            }
            return false;
        };

        $scope.validUrl = () => {
            let value = angular.element('#txt_url').val();
            if(value.length < 1){
                $scope.urlErr = "Url is required";
            } else {
                if(checkSameUrl(value)){
                    $scope.urlErr = 'This url already exists';
                } else {
                    $scope.urlErr = null;
                }
            }
        };

        $scope.validQ = () => {
            let value = angular.element('#txt_q').val();
            if(value.length < 1){
                $scope.qErr = "Question is required";
            } else {
                $scope.qErr = null;
            }
        };

        $scope.validA = () => {
            let value = angular.element('#txt_a').val();
            if(value.length < 1){
                $scope.aErr = "Answer is required";
            } else {
                $scope.aErr = null;
            }
        };

        let checkSubmit = () => {
            $scope.validUrl();
            $scope.validQ();
            $scope.validA();
            if($scope.urlErr !== null || $scope.qErr !== null || $scope.aErr !== null){
                return false;
            }
            $scope.currentFAQ.q = angular.element('#txt_q').val();
            $scope.currentFAQ.a = angular.element('#txt_a').val();
            return true;
        };

        $scope.add = () => {
            if(checkSubmit()){
                $http.post('/api/admin/qa/add', {
                    qa: $scope.currentFAQ
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/faq');
                    },  (err) => {
                        console.log(err);
                    });
            }
        };

        $scope.update = () => {
            if(checkSubmit()){
                $http.post('/api/admin/qa/update', {
                    qa: $scope.currentFAQ
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/faq');
                    },  (err) => {
                        console.log(err);
                    });
            }
        };

        $scope.delete = () => {
            $http.post('/api/admin/qa/delete', {
                    qa: $scope.currentFAQ
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/faq');
                    },  (err) => {
                        console.log(err);
                    });
        };

        $scope.close = () => {
            $location.path('/admin/faq');
        };

    }]);