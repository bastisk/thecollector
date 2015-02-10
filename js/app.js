// TheCollector - MovieList Application
// Written by Sebatian Kiepsch, Feb. 2015

var App = angular.module("TheCollector", ["ionic"]);

App.service("Movielist", ["$http", "$log", Movielist]);
App.service("UserList", ["$http", "$log", "$q", UserList]);
App.controller("TheCollectorCtrl", ["$scope", "Movielist", "$log", TheCollectorCtrl]);
App.controller("LoginCtrl", ["$scope", "$state", "$log", "$http", LoginCtrl]);

// ========== CONTROLLERS ===========
function TheCollectorCtrl($scope, Movielist, $log) {
    $scope.movies = [];
    Movielist.getMovies($scope);
}

function LoginCtrl($scope, $state, UserList, $http) {
    $scope.signIn = function (user) {
        var UserName = user.username;
        var UserPassword = user.password;
        var UserPW_Hash = sha256_digest(UserPassword);
        var UserUN_Hash = sha256_digest(UserName);
        $http.get("http://basti-sk.com/php/users.php?key1=" + UserUN_Hash + "&key2=" + UserPW_Hash).success(function (result) {
                $scope.users = result;
                if ($scope.users[0].Status == "true") $state.go('tabs.movies');
                else alert("Error: Wrong Username or Password!");
        });
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

function UserList($http, $log, $q) {
    this.getUsers = function ($scope) {
        $http.jsonp("http://basti-sk.com/php/users.php").success(function (result) {
            $scope.test = result;
        });
    };
}
