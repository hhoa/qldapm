'use strict';
let app = angular.module('my-app', [
    'ngRoute',
    'my-app.admin',
    'my-app.header',
    'my-app.footer',
    'my-app.home',
    'my-app.404',
    'my-app.sign-up',
    'my-app.sign-up.employee',
    'my-app.sign-up.employer',
    'florist.cat.viec-lam-chuyen-mon',
    'florist.cat.lao-dong-pho-thong',
    'florist.cat.sinh-vien',
    'florist.login'
]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    let route = [
        {
            url: '/',
            templateUrl: 'app/components/web-frontend/home/home.template.html',
            controller: 'homeCtrl'
        },
        {
            url: '/dang-nhap',
            templateUrl: 'app/components/web-frontend/login/login.template.html',
            controller: 'LoginController'
        },
        {
            url: '/dang-ky',
            templateUrl: 'app/components/web-frontend/sign-up/sign-up.template.html',
            controller: 'signUpController'
        },
        {
            url: '/dang-ky/nha-tuyen-dung',
            templateUrl: 'app/components/web-frontend/sign-up/employer/sign-up.template.html',
            controller: 'signUpEmployerController'
        },
        {
            url: '/dang-ky/nguoi-tim-viec',
            templateUrl: 'app/components/web-frontend/sign-up/employee/sign-up.template.html',
            controller: 'signUpEmployeeController'
        },
        {
            url: '/viec-lam-chuyen-mon',
            templateUrl: 'app/components/web-frontend/category/viec-lam-chuyen-mon/viec-lam-chuyen-mon.template.html',
            controller: 'vlcmCategoryController'
        },
        {
            url: '/lao-dong-pho-thong',
            templateUrl: 'app/components/web-frontend/category/lao-dong-pho-thong/lao-dong-pho-thong.template.html',
            controller: 'ldptCategoryController'
        },
        {
            url: '/sinh-vien-ban-thoi-gian',
            templateUrl: 'app/components/web-frontend/category/sinh-vien/sinh-vien.template.html',
            controller: 'svCategoryController'
        }
    ];

    for(let i = 0; i < route.length; i++){
        $routeProvider
            .when(route[i].url, {
                templateUrl: route[i].templateUrl,
                controller: route[i].controller
            });
    }

    $routeProvider.otherwise('/404');
    $locationProvider.html5Mode(true);

}]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.cart = [];

    $rootScope.getDateFromString = (date_string) => {
        if(date_string !== null && date_string !== undefined){

            let date = new Date(Number.parseInt(date_string));
            let m = date.getMonth() + 1;
            let d = date.getDate();

            let dd, mm;
            if(d < 10){
                dd = '0' + d;
            } else {
                dd = d.toString();
            }
            if(m < 10){
                mm = '0' + m;
            } else {
                mm = m.toString();
            }

            return (mm + '-' + dd + '-' +  date.getFullYear());
        }
    };

    $rootScope.getDateFromTimeStamp = (value) => {
        if(value !== undefined){
            if(value.length < 1){
                return 'Not available';
            } else {
                let time_stamp = new Date(Number.parseInt(value));
                let date = (time_stamp.getMonth() + 1) + "/" + time_stamp.getDate() + "/" + time_stamp.getFullYear();
                let time = time_stamp.getHours() + ":" + time_stamp.getMinutes() + ":" + time_stamp.getSeconds();
                return (date + " " + time);
            }
        }
    };

    $rootScope.getImageUrl = (product) => {
        if(product !== undefined){
            for(let i = 0; i < product.imageProduct.length; i++){
                if(product.imageProduct[i].thumbnail === true){
                    return "./media/products/base/" + product.imageProduct[i].src.charAt(0) + "/" + product.imageProduct[i].src;
                }
            }
        }
        return "";
    };

}]);

app.factory('customScopes', ['$http', '$q', function($http) {

    let is_show_background = true;
    let search_key = "";
    let state = {
        items : [
            "An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước",
            "Bình Thuận","Cà Mau","Cao Bằng","Đà Nẵng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Tĩnh",
            "Hải Dương","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai",
            "Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ", "Phú Yên", "Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị",
            "Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang",
            "Vĩnh Long","Vĩnh Phúc","Yên Bái","TP. Hồ Chí Minh",
        ]
    };

    let setBackgroundDisplay = (value) => {
        is_show_background = value;
    };

    let getBackgroundDisplay = () => {
        return is_show_background;
    };

    /* product pager */
    let getPager = (totalItems, currentPage, pageSize) => {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage = 0,
            endPage = 0;

        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 7) {
                startPage = 1;
                endPage = 6;
            } else if (currentPage + 5 >= totalPages) {
                startPage = totalPages - 11;
                endPage = totalPages;
            } else {
                startPage = currentPage - 6;
                endPage = currentPage + 5;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [];
        for(let i = startPage; i < endPage + 1; i++){
            pages.push(i);
        }

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    };

    let setSearchKey = (key) => {
        search_key = key;
    };

    let getSearchKey = () => {
        return search_key;
    };

    let getStates = () => {
        return state;
    };

    return {
        setBackgroundDisplay: setBackgroundDisplay,
        getBackgroundDisplay: getBackgroundDisplay,
        getPager: getPager,
        setSearchKey: setSearchKey,
        getSearchKey: getSearchKey,
        getStates: getStates
    };

}]);

app.factory("customerAuthentication", ['$http', '$q', '$window', function($http, $q, $window) {
        /* get user o sesion */
        let customer_info = null;
        let login = (username, password) => {
            let deferred = $q.defer();

            $http.post("/api/login", { username: username, password: password })
                .then((result) => {
                    customer_info = {
                        access_token: result.data.access_token,
                        username: result.data.username
                    };
                    $window.sessionStorage["customer_info"] = JSON.stringify(customer_info);
                    deferred.resolve(customer_info);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        let logout = (customer_info) => {
            let deferred = $q.defer();
            $http.post(
                "/api/logout", {"access_token": customer_info.access_token}, { headers: {'Content-Type': 'application/json'} }
            ).then((result) => {
                $window.sessionStorage["customer_info"] = null;
                deferred.resolve(result);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        let getCustomerInfo = () => {
            return customer_info;
        };

        return {
            login: login,
            logout: logout,
            getCustomerInfo: getCustomerInfo
        };
    }]);
