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
.run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the login page
      console.log('Error:',error)
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
      }
    });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "templates/main.html",
            controller: "MainController",
            resolve: {
              currentAuth: function(Auth) {
                return Auth.requireAuth();
              }
            },            
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
});