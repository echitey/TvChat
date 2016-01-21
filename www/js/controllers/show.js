var mod = angular.module('tvchat.controllers.show', []);



mod.controller('ShowCtrl', function ($scope,
                                     $stateParams,
                                     FIREBASE_URL,
                                     ShowsService,
                                     $firebaseArray,
                                     $ionicScrollDelegate,
                                     UserService) {

	$scope.user = UserService;

  $scope.showId = $stateParams.showId;
  console.log($scope.showId);
  $scope.show = ShowsService.getShow(parseInt($scope.showId));
  console.log($scope.show);

	$scope.data = {
		messages: [],
		message: '',
		loading: true,
		showInfo: false
	};

	var messagesRef = new Firebase(FIREBASE_URL);

	$scope.loadMessages = function () {

    console.log("Loading data for show");
    var query = messagesRef
      .child("messages")
      .orderByChild("showId")
      .equalTo($scope.showId)
      .limitToLast(200);

    $scope.data.messages = $firebaseArray(query);

    $scope.data.messages.$loaded().then(function(data){
      console.log("Angulat Fire loaded");
      $scope.data.loading = false;
      //LOAD LIST TO THE BOTTOM
      $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
    });
	};

  $scope.loadMessages();

	$scope.sendMessage = function () {

    if($scope.data.message){
      $scope.data.messages.$add({
        showId: $scope.showId,
        text: $scope.data.message,
        username: $scope.user.current.name,
        userId: $scope.user.current.userId,
        profilePic: $scope.user.current.profilePic,
        timestamp: new Date().getTime()
      });
    }
    $scope.data.message = '';
    //LOAD LIST TO THE BOTTOM
    $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);

	};

	console.log("ShowCtrl-Created");

	$scope.$on("$ionicView.enter", function () {
		console.log("ShowCtrl-Enter");
	});

	$scope.$on("$ionicView.beforeLeave", function () {
		console.log("ShowCtrl-Leave");
	});

});
