

angular.module('florist.admin-customers-details', ['florist.admin-last-update'])

    .controller('AdminCustomerDetailsController', ['$scope', '$http', '$location', '$window', '$routeParams', 'customScopes',
        function($scope, $http, $location, $window, $routeParams, customScopes){
            $http({
                method: 'GET',
                url: '/api/get-account/' +  $routeParams.username
            }).then((res) => {
                let temp = res.data;
                if(temp.status === true)
                    temp.status = "Active";
                else
                    temp.status = 'Deactive';
                $scope.account = temp;

            }, (error) => {
                console.log(error);
            });

            $http({
                method: "GET",
                url: "/api/get-order/" + $routeParams.username
            }).then((res) => {
                $scope.orders = res.data;
                for(let i = 0 ; i  < $scope.orders.length; i++){
                    if($scope.orders[i].status === true){
                        $scope.orders[i].status = "Completed!";
                    } else {
                        $scope.orders[i].status = "In Process!";
                    }
                }
            }, (error) => {
                console.log(error)
            });

            $scope.getFullName = () => {
                if($scope.account === undefined)
                    return;
                return ($scope.account.first_name + " " + $scope.account.last_name).toUpperCase();
            };

            $scope.getGender = () => {
                if($scope.account === undefined)
                    return "";
                let gender = $scope.account.gender;
                return (gender.charAt(0).toUpperCase() + gender.slice(1));
            };

            $scope.getAge = () => {
                if($scope.account === undefined)
                    return;
                if($scope.account.birth_day === null)
                    return "";
                let current = new Date();
                let birth_day = new Date(Number.parseInt($scope.account.birth_day));
                return (current.getFullYear() - birth_day.getFullYear());
            };

            $scope.getBirthday = () => {
                if($scope.account.birth_day !== null){
                    let birth_day = new Date(Number.parseInt($scope.account.birth_day));
                    return (birth_day.getMonth() + 1 + "/" + birth_day.getDate() + "/" + birth_day.getFullYear());
                } else {
                    return "";
                }
            };

            $scope.getAddress = () => {

                if($scope.account === undefined || $scope.account === null){
                    return "Unavailable";
                }
                else if ($scope.account.address[0].floor === undefined || $scope.account.address[0].floor === "" || $scope.account.address[0].floor === null) {
                    return ($scope.account.address[0].street + ", " + $scope.account.address[0].city);
                }
                else {
                    return ($scope.account.address[0].floor + ", " + $scope.account.address[0].street + ", " + $scope.account.address[0].city);
                }
            };

            $scope.countCarts = () => {
                return 0;
            };

            $scope.deleteAccountClick = (account) => {
                $scope.currentAccount = account;
            };

            $scope.deleteAccount = () => {

                if($scope.currentAccount !== undefined){
                    let remove = {
                        username: $scope.currentAccount.username
                    };
                    //delete
                    $http.post('/admin/delete-account', remove, { headers: {'Content-Type': 'application/json'} })
                        .then((res) => {
                            $location.path('/admin/admins');
                        }, (error) => { 

                        });
                }
            };

            $scope.showDialogToEdit =  () => {
                $location.path('/admin/customers/edit/' + $scope.account.username);
            };

            $scope.showOrderDetails = (order) => {
                $location.path('/admin/orders/details/' + order._id);
            };
        }]);