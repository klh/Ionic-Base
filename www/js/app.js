// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular
  .module('starter', ['ionic', 'firebase'])
  .constant('FURL', 'https://popping-heat-7267.firebaseio.com/')  

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "templates/main.html",
            controller: "MainController"
        })
        .state("register", {
            url: "/register",
            templateUrl: "templates/register.html",
            controller: "AuthController"
        })
        .state("forgot-password", {
            url: "/forgot-password",
            templateUrl: "templates/forgot-password.html",
            controller: "AuthController"
        })
        .state("login", {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "AuthController"
        })
        .state("add", {
            url: "/add",
            templateUrl: "templates/add.html",
            controller: "MainController"
        })
        .state("edit", {
            url: "/edit",
            templateUrl: "templates/edit.html",
            controller: "MainController"
        })
        .state("view", {
            url: "/view/:dataId",
            templateUrl: "templates/view.html",
            controller: "MainController"
        })
        .state("otherwise", {
            url: "*path",
            templateUrl: "templates/main.html",
            controller: "MainController"
        });
})

.controller("AuthController", function($scope, FURL, $state, $ionicHistory, $firebaseAuth) {

    var fb = new Firebase(FURL);
    var Auth = $firebaseAuth(fb);

    $scope.login = function(username, password) {
        Auth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("main");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        Auth.$createUser({
            email: username, 
            password: password
        })
        .then(function(userData) {
            return Auth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("login");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.changePassword = function(username, oldPass, newPass) {
        Auth.$changePassword({
            email: username,
            oldPassword: oldPass,
            newPassword: newPass
        })
        .then(function() {
            console.log('Password changed successfully!');
            $state.go("login");
        }, function(err) {
            console.log('Error changing password: ', err);
        });
    };

    // http://forum.ionicframework.com/t/back-button-not-showing-when-coming-from-nested-pages-tabs/18019/7
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
})

.controller('MainController', function($scope, FURL, $firebaseArray, $firebaseObject, $state, $stateParams) {
    var fb = new Firebase(FURL);
    var fbData = $firebaseArray(fb.child('data'));

    $scope.listCanSwipe = true;
    $scope.datas = fbData;
    
    // if data Id is passed in the url, get the Firebase object with that Id and put it on the scope
    var dataId = $stateParams.dataId;
    if (dataId) {
        $scope.selectedData = getData(dataId);
    }
    function getData(dataId) {
        return $firebaseObject(fb.child('data').child(dataId));
    }

    $scope.addData = function(data) {
        fbData.$add(data);
        $state.go('main');
    }

    $scope.deleteData = function(data) {
        fbData.$remove(data);
    }

    $scope.updateData = function(data) {
        $scope.selectedData.$save(data);
        $state.go('main');
    }

    $scope.goAdd = function() {
      $state.go('add');
    }
});