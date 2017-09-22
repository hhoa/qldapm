/**
 * Created by angel on 6/27/2017.
 */
'use strict';

angular.module("florist.admin-customers", ['florist.admin-last-update'])

    .controller('AdminCustomersController', ['$scope', '$http', '$location',
        function($scope, $http, $location){
            $scope.title_modal = "CUSTOMERS MANAGEMENT";

            /* get list account */
            $http({
                method: 'GET',
                url: '/api/get-accounts'
            }).then((res) => {
                let temp = res.data;

                for (let i = 0; i < temp.length; i ++){
                    if (temp[i].status === true){
                        temp[i].status = "Active";
                    }
                    else {
                        temp[i].status = "Deactive";
                    }
                }
                $scope.accounts = temp;

            }, (error) => {
                console.log(error);
            });

            /* get numbers account */
            $scope.countAccount =  () => {
                if($scope.accounts === undefined || $scope.accounts === null){
                    return 0;
                }
                return $scope.accounts.length;
            };

            $scope.getDateJoin = (account) => {
                let date_join = new Date(Number.parseInt(account.date_join));
                return (date_join.getMonth() + 1 + "/" + date_join.getDate() + "/" + date_join.getFullYear() +
                " " + date_join.getHours() + ":" + date_join.getMinutes() + ":" + date_join.getSeconds());
            };

            /* router customer details */
            $scope.showDetails = (account) => {
                $location.path('/admin/customers/details/' + account.username);
            };

            $scope.showDialogToEdit = (account) => {
                $location.path('/admin/customers/edit/' + account.username);
            };

            $scope.addNewOnClick = () => {
                $location.path('/admin/customers/create');
            };

        }]);