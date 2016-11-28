// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("RedditCtrl", function($scope, $http, Stories, moveItems, $ionicPopup, $ionicListDelegate) {
  $scope.stories = [];

  function showAlert() {
     var alertPopup = $ionicPopup.alert({
       title: 'Not so fast',
       template: 'You already have that news!',
       cssClass: 'popUpAlign',
       buttons: [{
         type: 'button-dark',
         text: "OK"
       }]
     });
  };

  function getStories(params, callback) {
    $http.get("https://www.reddit.com/r/gaming/.json", {params:params})
    .success(function(res) {
        var stories = [];

        angular.forEach(res.data.children, function(child) {
          stories.push(child.data);
        });

        callback(stories)
    });
  }
  $scope.getOlderStories = function() {
    var params = {};

    if($scope.stories.length > 0) {
      params["after"] = $scope.stories[$scope.stories.length -1 ].name
    }

    getStories(params, function(olderStores) {
      $scope.stories = $scope.stories.concat(olderStores)
      $scope.$broadcast('scroll.infiniteScrollComplete');
    })
  }
  $scope.getNewStories = function() {
    var params = {"before": $scope.stories[0].name}

    getStories(params, function(newStories) {
      $scope.stories = newStories.concat($scope.stories)
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  $scope.add = function(story) {
    if(Stories.indexOf(story)< 0) {
      Stories.push(story)
    } else {
      showAlert();
    }
    $ionicListDelegate.closeOptionButtons();
  }
  $scope.moveItem = function(story, fromIndex, toIndex) {
    moveItems.moveItem($scope.stories,story, fromIndex, toIndex)
  }
})


.controller("myNewsCtrl", function($scope, Stories, moveItems) {
  $scope.stories = Stories

  $scope.delete = function(story) {
    $scope.stories.splice(Stories.indexOf(story),1);
    console.log("Current array-->", Stories.indexOf(story))
  }
  $scope.moveItem = function(story, fromIndex, toIndex) {
    moveItems.moveItem($scope.stories, story, fromIndex, toIndex)
  }

})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('index', {
      url: "/",
      templateUrl: "templates/home.html",
      controller: "RedditCtrl"
    })
    .state("myNews", {
      url: "/mynews",
      templateUrl: "templates/mynews.html",
      controller: "myNewsCtrl"
    })

  $urlRouterProvider.otherwise("/home");
})


.service('Stories', function() {
    var stories = [];
    return stories;
})

.service("moveItems", function() {
  return {
    moveItem: function(stories,story, fromIndex, toIndex ) {
      stories.splice(fromIndex,1)
      stories.splice(toIndex,0, story)
    }
  }
})
