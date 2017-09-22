'use strict';

angular.module('florist.admin-accounts-form', [])

    .controller('AdminAccountFormController', ['$scope', '$http', '$window', '$routeParams', '$location',
        function ($scope, $http, $window, $routeParams, $location) {

            $http({
                method: 'GET',
                url: '/api/admin/admins/details'
            }).then((res) => {
                $scope.admins = res.data;
            }, (error) => {
                console.log(error);
            });

            /* validate */
            $scope.resetValidAll = () => {
                $scope.usernameErr = true;
                $scope.curUsernameErr = "";
                $scope.passwordErr = true;
                $scope.curPasswordErr = "";
                $scope.fnameErr = true;
                $scope.curFnameErr = "";
                $scope.lnameErr = true;
                $scope.curLnameErr = "";
                $scope.emailErr = true;
                $scope.curEmailErr = "";
            };
            $scope.resetValidAll();

            $scope.resetAccount = () => {
                $scope.admin = {
                    username: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    permission: false
                };
            };

            $scope.showDialogToEdit = () => {
                $scope.resetValidAll();
                $scope.isAddNew = false;
                $scope.admin.password = "";
                $scope.title_modal = "EDITING ADMIN " + $scope.admin.username.toUpperCase();
            };

            $scope.addNewOnClick = () => {
                $scope.resetValidAll();
                $scope.isAddNew = true;
                $scope.title_modal = "CREATE A NEW ADMIN";
            };

            if($routeParams.username){
                $http({
                    method: 'GET',
                    url: '/api/admin/admins/details/' +  $routeParams.username
                }).then((res) => {
                    $scope.admin = res.data;
                    $scope.showDialogToEdit();
                }, (error) => {
                    console.log(error);
                });
            } else {
                $scope.resetAccount();
                $scope.addNewOnClick();
            }

            $scope.validationMessages = [
                {
                    required:      "Username is required.",
                    minlength:     "Username must be at least 4 characters long.",
                    maxlength:     "Username cannot be more than 24 characters long.",
                    notFormat:     "The username can only consist of alphabetical, number, dot and underscore.",
                    exists:        "Username already exists."
                },
                {
                    required:      "Password is required.",
                    minlength:     "Password must be at least 6 characters long."
                },
                {
                    required:      "Firstname is required."
                },
                {
                    required:      "Lastname is required."
                },
                {
                    required:      "Email is required.",
                    notFormat:     "Email not right format."
                },
                {
                    required:      " is required."
                }
            ];


            /* group validate function */
            $scope.validUsername = () => {

                let value = angular.element('#txt_username').val();

                if(value.trim().length < 1){
                    $scope.curUsernameErr  = $scope.validationMessages[0].required;
                    $scope.usernameErr = true;
                }
                else if(value.length >= 1 && value.length < 4){
                    $scope.curUsernameErr  = $scope.validationMessages[0].minlength;
                    $scope.usernameErr = true;
                }
                else if(value.length > 24){
                    $scope.curUsernameErr  = $scope.validationMessages[0].maxlength;
                    $scope.usernameErr = true;
                }
                else if(!value.match(/^[a-zA-Z0-9_\.]+$/)){
                    $scope.curUsernameErr = $scope.validationMessages[0].notFormat;
                    $scope.usernameErr = true;
                }
                else{
                    $http({
                        method: 'GET',
                        url: '/api/admin/check-account/' + value
                    }).then((res) => {
                        if(res.data.check === true){
                            $scope.curUsernameErr = $scope.validationMessages[0].exists;
                            $scope.usernameErr = true;
                        }
                        else {
                            $scope.usernameErr = false;
                        }
                    });
                }
            };

            $scope.validPassword = () => {
                let value = angular.element('#txt_password').val();
                if(value.trim().length < 1){
                    $scope.curPasswordErr  = $scope.validationMessages[1].required;
                    $scope.passwordErr = true;
                }
                else if(value.length >= 1 && value.length < 6){
                    $scope.curPasswordErr  = $scope.validationMessages[1].minlength;
                    $scope.passwordErr = true;
                }
                else {
                    $scope.passwordErr = false;
                }
            };

            $scope.validFirstname = () => {
                let value = angular.element('#txt_firstname').val();
                if(value.trim().length < 1){
                    $scope.curFnameErr  = $scope.validationMessages[2].required;
                    $scope.fnameErr = true;
                }
                else {
                    $scope.fnameErr = false;
                }
            };

            $scope.validLastName = () => {
                let value = angular.element('#txt_lastname').val();
                if(value.trim().length < 1){
                    $scope.curLnameErr  = $scope.validationMessages[3].required;
                    $scope.lnameErr = true;
                }
                else {
                    $scope.lnameErr = false;
                }
            };

            $scope.validEmail = () => {
                let value = angular.element('#txt_email').val();
                if(value.trim().length < 1){
                    $scope.curEmailErr  = $scope.validationMessages[4].required;
                    $scope.emailErr = true;
                }
                else if(!value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                    $scope.curEmailErr = $scope.validationMessages[4].notFormat;
                    $scope.emailErr = true;
                }
                else {
                    $scope.emailErr = false;
                }
            };

            $scope.validAll = () => {
                $scope.validUsername();
                $scope.validPassword();
                $scope.validFirstname();
                $scope.validLastName();
                $scope.validEmail();
            };

            $scope.checkToSubmit = () => {
                return(!$scope.usernameErr && !$scope.passwordErr && !$scope.fnameErr && !$scope.lnameErr &&
                    !$scope.emailErr);
            };

            $scope.addNewAccount = () => {
                $scope.validAll();
                if(!$scope.checkToSubmit())
                    return;

                let username = angular.element('#txt_username').val();
                let password = angular.element('#txt_password').val();
                let firstname = angular.element('#txt_firstname').val();
                let lastname = angular.element('#txt_lastname').val();
                let email = angular.element('#txt_email').val();

                let newAccount = {
                    username: username,
                    password: password,
                    first_name: firstname,
                    last_name: lastname,
                    email: email,
                    permission: false,
                };
                //insert
                $http.post('/api/admin/admins/add', newAccount, { headers: {'Content-Type': 'application/json'} })
                    .then(() => {
                        console.log('Successful!');
                    }, (error) => {
                        console.log(error);
                    });
                $window.location.reload();
            };

            $scope.checkPass = () =>{
                let password = angular.element('#txt_password').val();
                return (password === $scope.admin.password);
            };

            $scope.updateAccount = () => {

                $scope.validAll();
                if(!$scope.checkToSubmit())
                    return;

                let username = angular.element('#txt_username').val();
                let password = angular.element('#txt_password').val();
                let firstname = angular.element('#txt_firstname').val();
                let lastname = angular.element('#txt_lastname').val();
                let email = angular.element('#txt_email').val();

                let update = {
                    username: username,
                    password: password,
                    first_name: firstname,
                    last_name: lastname,
                    email: email,
                    permission: false,
                };

                $http.post('/api/admin/admins/update', {update : update, oldPass: $scope.checkPass()},
                    { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {
                        if($scope.admin.permission === true){
                            $http({
                                method: 'GET',
                                url: '/api/admin/get-authentication'
                            }).then( (res) => {
                                $scope.userInfo = res.data;
                                authentication.logout($scope.userInfo)
                                    .then( () => {
                                        $scope.userInfo = null;
                                        $location.path("/admin/login");
                                    },  (error) => {
                                        console.log(error);
                                    });
                            });
                        } else {
                            $location.path("/admin/admins");
                        }
                    }, (error) => {
                        console.log(error);
                    });
            };

            $scope.deleteAccount =  () => {
                let item = {
                    username: $scope.admin.username,
                    permission: $scope.admin.permission
                };
                //delete
                $http.post('/api/admin/admins/delete', item, { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {

                    }, (error) => {
                        console.log(error);
                    });
                $location.path('/admin/admins');
            };

            $scope.closeDetail = () => {
                if($scope.isAddNew){
                    $location.path('/admin/admins');
                } else {
                    $window.history.back();
                }
            };

        }]);
