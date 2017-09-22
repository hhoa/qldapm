'use strict';

angular.module('florist.admin-cms-form', ['florist.admin-buttons-add-new'])
    .controller('AdminCmsFormController', ['$scope', '$http', '$location', '$routeParams', 'customScopes', function ($scope, $http, $location, $routeParams, customScopes) {

        let reset = () => {
              $scope.currentCms = {
                  title: "",
                  url: "",
                  status: "",
                  content: "",
                  meta_keyword: "",
                  meta_des: "",
                  date_created: "",
                  date_modified: ""
              };
        };

        $http({
            method: 'GET',
            url: '/api/admin/get-cms'
        }).then((res) => {
            $scope.cms = res.data;
            if($routeParams.params){
                $scope.isAddNew = false;

                let index = parseInt($routeParams.params);
                $scope.currentCms = $scope.cms[index];
                if($scope.currentCms !== undefined){
                    if($scope.currentCms.status === true){
                        $scope.selectedStatus = 'Enabled';
                    } else {
                        $scope.selectedStatus = 'Disabled';
                    }
                    $scope.title_modal = 'EDIT PAGE ' + $scope.currentCms.title.toUpperCase();
                }

            } else {
                $scope.isAddNew = true;
                $scope.selectedStatus = 'Disabled';
                $scope.title_modal = 'CREATE A PAGE';
                reset();
            }
        }, (err) => {
            console.log(err);
        });

        let checkSameUrl = (url) => {
            if(!$scope.isAddNew) return false;
            for(let i = 0 ; i < $scope.cms.length; i++){
                if($scope.cms[i].url === url){
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

        $scope.validContent = () => {
            let value = angular.element('#txt_content').val();
            if(value.length < 1){
                $scope.contentErr = "Content is required";
            } else {
                $scope.contentErr = null;
            }
        };

        $scope.statusSelect = (value) => {
            $scope.selectedStatus = value;
        };

        let getBooleanOfStatus = () => {
            if($scope.selectedStatus === 'Enabled'){
                return true;
            } else {
                return false;
            }
        };

        let getMeta = () => {
            $scope.currentCms.content = angular.element('#txt_content').val();
            $scope.currentCms.meta_keyword = angular.element('#txt_meta_keyword').val();
            $scope.currentCms.meta_des = angular.element('#txt_meta_des').val();
            $scope.currentCms.status = getBooleanOfStatus();
        };

        let checkSubmit = () => {
            $scope.validUrl();
            $scope.validContent();
            if($scope.urlErr !== null || $scope.contentErr !== null){
                return false;
            }
            getMeta();
            return true;
        };

        $scope.add = () => {
            if(checkSubmit()){
                let datetime = new Date();
                $scope.currentCms.date_created = datetime.getTime();
                $scope.currentCms.date_modified = datetime.getTime();
                $http.post('/api/admin/cms/add', {
                    cms: $scope.currentCms
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/pages');
                    },  (err) => {
                        console.log(err);
                    });
            }
        };

        $scope.update = () => {
            if(checkSubmit()){
                let datetime = new Date();
                $scope.currentCms.date_modified = datetime.getTime();
                $http.post('/api/admin/cms/update', {
                    cms: $scope.currentCms
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/pages');
                    },  (err) => {
                        console.log(err);
                    });
            }
        };

        $scope.delete = () => {
            $http.post('/api/admin/cms/delete', {
                    cms: $scope.currentCms
                }, { headers: {'Content-Type': 'application/json'} })
                    .then( (res) => {
                        $location.path('/admin/pages');
                    },  (err) => {
                        console.log(err);
                    });
        };

        $scope.close = () => {
            $location.path('/admin/pages');
        };

    }]);