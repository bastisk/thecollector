// TheCollector - MovieList Application
// Written by Sebatian Kiepsch, Feb. 2015

var App = angular.module("TheCollector", ["ionic"]);

App.service("Movielist", ["$http", "$log", Movielist]);
App.service("UserList", ["$http", "$log", "$q", UserList]);
App.service("Authentication", ["$http", "$log", "$state", Authentication]);
App.controller("TheCollectorCtrl", ["$scope", "Movielist", "$log", TheCollectorCtrl]);
App.controller("LoginCtrl", ["$scope", "Authentication", "$state", "$log", "$http", LoginCtrl]);

// ========== CONTROLLERS ===========
function TheCollectorCtrl($scope, Movielist, $log) {
    $scope.movies = [];
    Movielist.getMovies($scope);
}

function LoginCtrl($scope, Authentication, $state, $log, $http) {
    $scope.signIn = function (user) {
        var UserName = user.username;
        var UserPassword = user.password;
        Authentication.authenticate(UserName, UserPassword);
    };
}

// ==========    ROUTES   ===========
App.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('home', {
            url: '/',
            template: '<p>Hello, world!</p>'
        })
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
        })
        .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('tabs.movies', {
            url: "/movies",
            views: {
                'movie-tab': {
                    templateUrl: "templates/movies.html"
                }
            }
        })
        .state('tabs.settings', {
            url: "/settings",
            views: {
                'settings-tab': {
                    templateUrl: "templates/settings.html"
                }
            }
        });
    $urlRouterProvider.otherwise("/login");
});


// ==========    SERVICES  ===========
function Movielist($http, $log) {
    this.getMovies = function ($scope) {
        $scope.movies = [
            {
                title: "Film A",
                genre: "Horror",
                watched: 0,
                voting: 1
            },
            {
                title: "Film B",
                genre: "SciFi",
                watched: 4,
                voting: 3
            },
            {
                title: "Film C",
                genre: "Documentation",
                watched: 0,
                voting: 6
            },
            {
                title: "Film D",
                genre: "Action",
                watched: 2,
                voting: 2
            },
            {
                title: "Film E",
                genre: "Action",
                watched: 2,
                voting: 5
            },
            {
                title: "Film F",
                genre: "Horror",
                watched: 6,
                voting: 2
            }
        ];
    }
}

function Authentication($http, $log, $state) {
    this.authenticate = function (UserName, UserPassword) {
        var UserPW_Hash = sha256_digest(UserPassword);
        var UserUN_Hash = sha256_digest(UserName);
        var request = $http({
            method: "post",
            url: "https://basti-sk.com/php/users.php",
            data: {
                key1: UserUN_Hash,
                key2: UserPW_Hash
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        request.success(function (result) {
            var aresult = result;
            console.log(aresult[0].Status);
            if (aresult[0].Status == "true") $state.go('tabs.movies');
            else alert("Wrong Credentials!");
        });
    }
}

function UserList($http, $log, $q) {
    this.getUsers = function ($scope) {
        $http.jsonp("http://basti-sk.com/php/users.php").success(function (result) {
            $scope.test = result;
        });
    };
}
