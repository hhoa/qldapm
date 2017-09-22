'use strict';

angular.module('florist.admin-accounts-details', [])
    .controller('AdminAccountsDetailsController', ['$scope', '$http', '$location', '$window', '$routeParams',
        function($scope, $http, $location, $window, $routeParams){
            
            $http({
                method: 'GET',
                url: '/api/admin/get-authentication'
            }).then( (res) => {
                $scope.userInfo = res.data;
            });

            $http({
                method: 'GET',
                url: '/api/admin/admins/details/' +  $routeParams.username
            }).then((res) => {
                $scope.admin = res.data;
            },(error) => {
                console.log(error);
            });

            $scope.deleteAccountClick = (account) => {
                $scope.currentAccount = account;
            };

            $scope.deleteAccount = () => {
                if ($scope.admin.permission){
                    $scope.deleteErr = 'Cannot delete this admin';
                    angular.element('#modalConfirm').modal('hide');
                }
                else {
                    $scope.deleteErr = null;
                    if($scope.currentAccount !== undefined){
                        let remove = {
                            username: $scope.currentAccount.username,
                            permission: $scope.admin.permission
                        };
                        //delete
                        $http.post('/api/admin/admins/delete', remove, { headers: {'Content-Type': 'application/json'} })
                            .then((res) => {

                            },(res) => {

                            });
                        $location.path('/admin/admins');
                        $window.location.reload();
                    }
                }
            };

            $scope.showDialogToEdit = () => {
                $location.path('/admin/admin/edit/' + $scope.admin.username);
            };

        }]);
