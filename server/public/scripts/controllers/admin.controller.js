myApp.controller('AdminController', function ($mdDialog, $mdToast, UserService, ShiftService) {
  console.log('AdminController created');

  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.supervisors = [];
  vm.staff = [];
  vm.unconfirmed = [];
  var show = false;


  vm.noUsersMessage = function() {
    if(vm.unconfirmed.length == 0) {
      return true;
    }
    return false;
  };
  
  // GET unconfirmed users route
  vm.getUnconfirmed = function () {
    vm.userService.getUnconfirmed().then(function (response) {
      vm.unconfirmed = response.data;
      console.log('got users', response.data);
    });
  };
  vm.getUnconfirmed();

  //Show dialog for confirm user
  vm.showConfirmDialog = function (event, user) {
    console.log('button clicked');
    $mdDialog.show({
      controller: 'AdminDialogController as ac',
      templateUrl: '/views/dialogs/confirmUser.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { user: user }
    }).then(function () {
      vm.getStaff();
      vm.getSupervisors();
      vm.getUnconfirmed();
      vm.showConfirmToast();
    });
  };

  //Users PUT route to confirm users and define their role (supervisor, nurse, MHW or ADL) 
  vm.confirmUser = function (user) {
    vm.userService.confirmUser(user).then(function (response) {
      console.log('changed user', response);
    });
  };

  // GET supervisors route (GET users where role = supervisor)
  vm.getSupervisors = function () {
    vm.userService.getSupervisors().then(function (response) {
      vm.supervisors = response.data;
      console.log('got supervisors', vm.supervisors);
    });
  };

  vm.getSupervisors();

  // GET staff route (GET users where role = nurse, MHW or ADL)
  vm.getStaff = function () {
    vm.userService.getStaff().then(function (response) {
      vm.staff = response.data;
      console.log('got staff', vm.staff);
    });
  };

  vm.getStaff();

  //Users DELETE route
  vm.deleteUser = function (user) {
    // vm.showDeleteToast(user);
    var confirm = $mdDialog.confirm()
          .title('Delete User')
          .textContent('Are you sure you would like to delete this user? This cannot be undone.')
          .ariaLabel('Delete User')
          .targetEvent(user)
          .ok('Delete')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      vm.userService.deleteUser(user).then(function (response) {
        console.log('user deleted', response);
        vm.getStaff();
        vm.getSupervisors();
        vm.getUnconfirmed();
      })
  })
}

  //Show dialog for edit individual user
  vm.showEditDialog = function (event, user) {
    console.log('button clicked');
    $mdDialog.show({
      controller: 'AdminDialogController as ac',
      templateUrl: '/views/dialogs/editUser.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { user: user }
    }).then(function () {
      vm.getStaff();
      vm.getSupervisors();
      vm.getUnconfirmed();
      vm.showEditToast();
    });
  };

  vm.showEditToast = function () {
    $mdToast.show(
      $mdToast.simple()
        .textContent('User has been edited!')
        .position('bottom left')
        .hideDelay(2500)
    );
  };

  vm.showConfirmToast = function () {
    $mdToast.show(
      $mdToast.simple()
        .textContent('User has been confirmed!')
        .position('bottom left')
        .hideDelay(2500)
    );
  };
  
  // vm.showDeleteToast = function (user) {
  //   console.log('user in toast', user);
  //   var toast = $mdToast.simple()
  //     .textContent('User has been deleted')
  //     .action('UNDO')
  //     .highlightAction(true)
  //     .position('bottom left')
  //     .hideDelay(3000);
  //   var undoToast = $mdToast.simple()
  //     .textContent('Undo successful')
  //     .position('bottom left')
  //     .hideDelay(2500);
  //   $mdToast.show(toast).then(function (response) {
  //     if (response === 'ok') {
  //       $mdToast.show(undoToast);
  //     } else {
  //       vm.userService.deleteUser(user).then(function (response) {
  //         console.log('user deleted', response);
  //         vm.getStaff();
  //         vm.getSupervisors();
  //         vm.getUnconfirmed();
  //       });
  //     }
  //   });
  // };

});
