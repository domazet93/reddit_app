angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

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
    $http.get("https://www.reddit.com/r/funny/.json", {params:params})
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
      params["after"] = $scope.stories[$scope.stories.length -1 ].name;
    }
    getStories(params, function(olderStores) {
      $scope.stories = $scope.stories.concat(olderStores)
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }
  $scope.getNewStories = function() {
    var params = { "before": $scope.stories[0].name }

    getStories(params, function(newStories) {
      $scope.stories = newStories.concat($scope.stories)
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  $scope.add = function(story) {
    if(Stories.indexOf(story) < 0) {
      console.log(story)
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
  $scope.stories = Stories;

  $scope.delete = function(story) {
    $scope.stories.splice(Stories.indexOf(story), 1);
    console.log("Current array-->", Stories.indexOf(story))
  }
  $scope.moveItem = function(story, fromIndex, toIndex) {
    moveItems.moveItem($scope.stories, story, fromIndex, toIndex)
  }
  $scope.showReorder = function() {
    return $scope;
  }
})

.controller("sliderCtrl", function($scope, $ionicSlideBoxDelegate) {

  $scope.swiper = {
          options: {
              pagination: '.custom-swiper-pagination',
              direction: 'horizontal',
              spaceBetween: 20,
              speed: 600
          },
          data: {}
  };
  $scope.swiper.color = ["#fff", "#0e62ea"];
})

.controller("tabsCtrl", function($scope, $state){
  $scope.changeState = function(page) {
    $state.go(page);
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
    .state("sliderPage", {
      url: "/slider",
      templateUrl: "templates/slider.html",
      controller: "sliderCtrl"
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
      stories.splice(fromIndex, 1);
      stories.splice(toIndex, 0 , story);
    }
  }
})
