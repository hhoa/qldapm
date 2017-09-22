'use strict';

angular.module('florist.admin-customers-form', [])

    .controller('AdminCustomerFormController', ['$scope', '$http', '$window', '$routeParams', '$location', 'authentication',
        function ($scope, $http, $window, $routeParams, $location, authentication) {

            $http({
                method: 'GET',
                url: '/api/admin/get-authentication'
            }).then( (res) => {
                $scope.userInfo = res.data;

                $http({
                    method: "GET",
                    url: "/api/admin/profile/" + $scope.userInfo.userName
                }).then((res) => {
                    $scope.admin = res.data;
                }, (error) => {
                    console.log(error);
                });
            });

            $scope.gender = "";
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
                $scope.genderErr = false;
                $scope.birthdayErr = true;
                $scope.curBirthdayErr = "";
                $scope.emailErr = true;
                $scope.curEmailErr = "";
                $scope.addressErr = {
                    street: true,
                    city: true,
                    floor: true,
                };
                $scope.curAddressErr = "";
                $scope.phoneErr = true;
                $scope.curPhoneErr = "";
            };
            $scope.resetValidAll();

            $scope.resetAccount = () => {
                $scope.account = {
                    gender: "male",
                    username: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                    birth_day: "",
                    phone: {
                        home: "",
                        mobile: ""
                    },
                    address: [
                        {
                            street: "",
                            floor: "",
                            city: "",
                        }
                    ],
                    email: "",
                    user_type: "Deactive",
                    status: "Regular",
                    company: "",
                    VAT: "",
                    last_update: "",
                    orders: []
                };
            };

            $scope.showDialogToEdit = () => {
                $scope.resetValidAll();
                $scope.isAddNew = false;
                $scope.gender = $scope.account.gender;
                $scope.birth_day = new Date(Number.parseInt($scope.account.birth_day));
                $scope.account.password = "";
                $scope.selectedUTypes = $scope.account.user_type;
                $scope.selectedUStatus = $scope.account.status;
                $scope.title_modal = "EDITING CUSTOMER " + $scope.account.username.toUpperCase();
            };

            $scope.addNewOnClick = () => {
                $scope.resetValidAll();
                $scope.isAddNew = true;
                $scope.gender = "";
                $scope.birth_day = "";
                $scope.selectedUStatus = "Deactive";
                $scope.selectedUTypes = "Regular";
                $scope.title_modal = "CREATE A NEW CUSTOMER";
            };

            if($routeParams.params){
                $http({
                    method: 'GET',
                    url: '/api/get-account/' +  $routeParams.params
                }).then((res) => {
                    let temp = res.data;
                    if(temp.status === true)
                        temp.status = "Active";
                    else
                        temp.status = "Deactive";
                    $scope.account = temp;
                    $scope.showDialogToEdit();
                },(error) => {
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
                    required:      "Phone number is required.",
                    notFormat:     "The phone number is not a right format."
                },
                {
                    required:      " is required."
                }
            ];

            /* letiable */
            $scope.types = [];

            $http({
                method: 'GET',
                url: '/api/get-account-types'
            }).then((res) => {
                $scope.types = res.data;
            }, (error) => {
                console.log(error);
            });

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
                } else {
                    if(value !== $scope.account.username) {
                        $http({
                            method: 'GET',
                            url: '/admin/check-account/' + value
                        }).then( (res) => {
                            $scope.usernameErr = false;
                            if(res.data.check === true){
                                $scope.curUsernameErr = $scope.validationMessages[0].exists;
                                $scope.usernameErr = true;
                            }
                        });
                    } else {
                        $scope.usernameErr = false;
                    }
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

            $scope.minAge = (dateString) => {

                let chooseYear = dateString.getFullYear();
                let currentYear = (new Date()).getFullYear();
                if(isNaN(dateString) || dateString === undefined){
                    $scope.birthdayErr = false;
                }
                /* check 18+ */
                else if(currentYear - chooseYear >= 18)
                {
                    $scope.birthdayErr = false;
                    $scope.birth_day = dateString;
                }
                else {
                    $scope.curBirthdayErr = "Birthday must at least 18.";
                    $scope.birthdayErr = true;
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

            $scope.validPhone = () => {
                let value = angular.element('#txt_phonenumber').val();
                if(value.trim().length < 1){
                    $scope.curPhoneErr  = $scope.validationMessages[5].required;
                    $scope.phoneErr = true;
                }
                else {
                    if(value.match(/^[0-9-+]+$/)){
                        $scope.phoneErr = false;
                    }
                    else{
                        $scope.curPhoneErr = $scope.validationMessages[5].notFormat;
                        $scope.phoneErr = true;
                    }
                }
            };

            $scope.validAddressStreet = () => {
                let value = angular.element('#txt_address_street').val();
                if(value.trim().length < 1){
                    $scope.curAddressErr  = "Address street" + $scope.validationMessages[6].required;
                    $scope.addressErr.street = true;
                    $scope.addressErr.city = false;
                    $scope.addressErr.floor = false;
                }
                else {
                    $scope.addressErr.street = false;
                }
            };


            $scope.validAddressCity = () => {
                let value = angular.element('#txt_address_city').val();
                if(value.trim().length < 1){
                    $scope.curAddressErr  = "Address city" + $scope.validationMessages[6].required;
                    $scope.addressErr.street = false;
                    $scope.addressErr.city = true;
                    $scope.addressErr.floor = false;
                }
                else {
                    $scope.addressErr.city = false;
                }
            };

            $scope.validGender = () => {
                if($scope.gender === "" || $scope.gender === undefined)
                {
                    $scope.genderErr = true;
                }
                else{
                    $scope.genderErr = false;
                }
            };

            $scope.getBooleanOfStatus = () => {
                return ($scope.selectedUStatus === "Active");
            };

            $scope.maleChecked = (event) => {
                if(event.target.checked){
                    $scope.gender = 'male';
                }
            };

            $scope.femaleChecked = (event) => {
                if(event.target.checked){
                    $scope.gender = 'female';
                }
            };

            $scope.selectUTypeChange = (value) => {
                $scope.selectedUTypes = value;
            };

            $scope.selectUStatusChange = (value) => {
                $scope.selectedUStatus = value;
            };

            $scope.validAll = () => {
                $scope.validUsername();
                $scope.validPassword();
                $scope.validFirstname();
                $scope.validLastName();
                $scope.validGender();
                $scope.validEmail();
                $scope.validAddressStreet();
                $scope.validAddressCity();
                $scope.validPhone();
            };

            $scope.getAddress = () => {
                return [
                    {
                        street: angular.element('#txt_address_street').val(),
                        floor: angular.element('#txt_address_floor').val(),
                        city: angular.element('#txt_address_city').val()
                    }
                ];
            };

            $scope.checkToSubmit = () => {

                if($scope.usernameErr || $scope.passwordErr || $scope.fnameErr || $scope.lnameErr || $scope.genderErr ||
                    $scope.emailErr || $scope.addressErr.street || $scope.addressErr.city || $scope.phoneErr){
                    return false;
                }
                return true;
            };

            $scope.addNewAccount = () => {
                $scope.validAll();
                if(!$scope.checkToSubmit())
                    return;

                let username = angular.element('#txt_username').val();
                let password = angular.element('#txt_password').val();
                let firstname = angular.element('#txt_firstname').val();
                let lastname = angular.element('#txt_lastname').val();
                let phone = angular.element('#txt_phonenumber').val();
                let company = angular.element('#txt_company').val();
                let vat = angular.element('#txt_vat').val();
                let email = angular.element('#txt_email').val();
                let birth_day = null;
                if($scope.birth_day !== null){
                    birth_day = (new Date($scope.birth_day)).getTime();
                }

                let newAccount = {
                    username: username,
                    password: password,
                    gender: $scope.gender,
                    birth_day: birth_day,
                    first_name: firstname,
                    last_name: lastname,
                    phone: {
                        home: "",
                        mobile: phone
                    },
                    address: $scope.getAddress(),
                    email: email,
                    company: company,
                    VAT: vat,
                    user_type: $scope.selectedUTypes,
                    status: $scope.getBooleanOfStatus(),
                    last_update: (new Date()).getTime().toString(),
                    date_join: (new Date()).getTime().toString(),
                    orders: []
                };


                //insert
                $http.post('/api/admin/customers/add',
                    {
                        account: newAccount,
                        fullName: $scope.admin.first_name + " " + $scope.admin.last_name
                    }, { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {
                        console.log("A new customer has been added");
                    }, (error) => {
                        console.log(error);
                    });
                $location.path('/admin/customers');
            };

            $scope.updateAccount = () => {

                $scope.validAll();
                if(!$scope.checkToSubmit())
                    return;

                let birth_day = null;
                if($scope.birth_day !== null){
                    birth_day = $scope.birth_day.getTime();
                }
                $scope.account.username = angular.element('#txt_username').val();
                let update = {
                    username: $scope.account.username,
                    password: $scope.account.password,
                    gender: $scope.gender,
                    birth_day: birth_day,
                    first_name: $scope.account.first_name,
                    last_name: $scope.account.last_name,
                    phone: $scope.account.phone,
                    address: $scope.account.address,
                    email: $scope.account.email,
                    company: $scope.account.company,
                    VAT: $scope.account.VAT,
                    user_type: $scope.selectedUTypes,
                    status: $scope.getBooleanOfStatus(),
                    last_update: (new Date()).getTime(),
                    date_join: $scope.account.date_join,
                    orders: $scope.account.orders
                };
                $http.post('/api/admin/customers/update',
                    {
                        update: update,
                        fullName: $scope.admin.first_name + " " + $scope.admin.last_name,
                        oldPass: $scope.checkPass()
                    },
                    { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {
                        console.log("This customer has been updated");
                    }, (error) => {
                        console.log(error);
                    });
                $location.path('/admin/customers');

            };

            $scope.deleteAccount = () => {

                let remove = {
                    username: $scope.account.username,
                    fullName: $scope.admin.first_name + " " + $scope.admin.last_name
                };
                //delete
                $http.post('/api/admin/customers/delete', remove, { headers: {'Content-Type': 'application/json'} })
                    .then((res) => {
                        console.log("This customer has been deleted");
                    }, (error) => {
                        console.log(error);
                    });
                $location.path('/admin/customers');
            };

            $scope.checkPass = () =>{
                let password = angular.element('#txt_password').val();
                return (password === $scope.admin.password);
            };

            $scope.closeDetail = () => {
                if($scope.isAddNew){
                    $location.path('/admin/customers');
                } else {
                    $window.history.back();
                }
            };

        }]);
