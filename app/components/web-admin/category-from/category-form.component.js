'use strict';

angular.module('florist.admin-category-form', [])
    .controller('AdminCategoryFormController', ['$scope', '$http', '$location', '$routeParams',
        function ($scope, $http, $location, $routeParams) {

        $http({
            method: 'GET',
            url: '/api/get-categories'
        }).then( (res) => {
            $scope.categories = res.data;
            if($routeParams.params){
                let index = parseInt($routeParams.params);
                $scope.category = $scope.categories[index];
                $scope.isAddNew = false;
                if($scope.category.status === true){
                    $scope.selectedStatus = 'Enabled';
                } else {
                    $scope.selectedStatus = 'Disabled';
                }
                $scope.title_modal = 'EDIT CATEGORY ' + $scope.category.name.toUpperCase();
            } else {
                reset();
                $scope.isAddNew = true;
                $scope.selectedStatus = 'Disabled';
                $scope.title_modal = 'CREATE A CATEGORY';
            }
        },  (error) => {
            console.log(error);
        });

        let checkSameName = (name) => {
            if(!$scope.isAddNew) return false;
            for(let i = 0 ; i < $scope.categories.length; i++){
                if($scope.categories[i].name === name){
                    return true;
                }
            }
            return false;
        };

        let checkSameUrl = (url) => {
            if(!$scope.isAddNew) return false;
            for(let i = 0 ; i < $scope.categories.length; i++){
                if($scope.categories[i].url === url){
                    return true;
                }
            }
            return false;
        };

        $scope.validName = () => {
            let value = angular.element('#txt_name').val();
            if(value.length < 1){
                $scope.nameErr = "Name is required";
            } else {
                //check category name
                if(checkSameName(value)){
                    $scope.nameErr = 'This category already exists';
                } else {
                    $scope.nameErr = null;
                }
            }
        };

        $scope.validUrl = () => {
            let value = angular.element('#txt_url').val();
            if(value.length < 1){
                $scope.urlErr = "Url is required";
            } else {
                //check category url
                if(checkSameUrl(value)){
                    $scope.urlErr = 'This url already exists';
                } else {
                    $scope.urlErr = null;
                }
            }
        };

        $scope.statusSelect = (value) => {
            $scope.selectedStatus = value;
        };

        let reset = () => {
            $scope.category = {
                name: "",
                url: "",
                title: "",
                meta_keyword: "",
                meta_des: "",
                status: false
            };
        };

        let getBooleanOfStatus = () => {
            if($scope.selectedStatus === 'Enabled'){
                return true;
            } else {
                return false;
            }
        };

        let getMeta = () => {
            $scope.category.meta_keyword = angular.element('#txt_meta_keyword').val();
            $scope.category.meta_des = angular.element('#txt_meta_des').val();
            $scope.category.status = getBooleanOfStatus();
        };

        let checkSubmit = () => {
            $scope.validName();
            $scope.validUrl();
            if($scope.nameErr !== null || $scope.urlErr !== null){
                return false;
            }
            getMeta();
            return true;
        };

        $scope.add = () => {
            if(checkSubmit()){
                $http.post('/api/admin/categories/add', {
                    category: $scope.category
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/categories');
                    },  () => {

                    });
            }
        };

        $scope.update = () => {
            if(checkSubmit()){
                $http.post('/api/admin/categories/update', {
                    category: $scope.category
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/categories');
                    },  () => {
                    });
            }
        };

        $scope.close = () => {
            $location.path('/admin/categories');
        };
    }]);