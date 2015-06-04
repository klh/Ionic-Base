'use strict';

app.controller('MainController', function($scope, FURL, Auth, $firebaseArray, $firebaseObject, $state, $stateParams) {
    var fb = new Firebase(FURL);
    var fbData = $firebaseArray(fb.child('data'));
    $scope.currentUser = Auth.user;

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

    $scope.goProfile = function() {
        $state.go('profile');
    }

    $scope.logout = function() {
        Auth.logout();
        console.log('Logged out successfully.');
        $state.go('login');
    }   
});