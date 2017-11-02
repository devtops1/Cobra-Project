//http get request
var app = angular.module('CustomerModule', ['ui.bootstrap']);
app.controller('Customer', function ($scope, $modal, $http, $log) {
    $http.get("/Home/GetCustomers")
    .then(function (response) {
        debugger;
        $scope.People = response.data.data;
    });

    //create a global function to get JSON data

    //modal form
    //Add New Customer
    //****************************************************************************************************
    $scope.customerform = { Name: "", Address1: "", Address2: "", Town_City: "" }
    $scope.blankWindow = {}
    $scope.open = function () {
        debugger;
        $scope.customerform.Name = "", $scope.customerform.Address1 = "", $scope.customerform.Address2 = "", $scope.customerform.Town_City = "";
        var modalInstance = $modal.open({
            templateUrl: 'AddCustomerModal.html',
            controller: 'AddCustomers',
            resolve: {
                customerform: function () {
                    return $scope.customerform;
                }
            }
        });
        modalInstance.result.then(function () {
            debugger;
            console.log($scope.customerform);
            //create http post function
            debugger;
            var request = {
                method: 'POST',
                url: '/Customer/AddCustomer',
                data: JSON.stringify($scope.customerform)
            };
            $http(request).then(function (response) {
                debugger;
                if (response.data.Success) {
                    $scope.People.push(response.data.data);
                    //alert("Data was inserted successfully!");
                }
                else {
                    $scope.showError = true;
                }
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //Edit Customer
    //******************************************************************************************************
    $scope.edit = function (ppls) {
        debugger;
        var getCust = $scope.People.indexOf(ppls);
        var modalInstance = $modal.open({
            //do an index on the current
            templateUrl: 'EditCustomerModal.html',
            controller: 'editCustomers',
            resolve: {
                customerform: function () {
                    debugger;
                    return $scope.customerform = $scope.People[getCust];
                }
            }
        });
        modalInstance.result.then(function (response){
            //send back to back end /Home/Customer
            debugger;
            x = $scope.People[getCust];
            var request = {
                method: 'POST',
                url: '/Customer/EditCustomer',
                data: JSON.stringify(x)
            };
            $http(request).then(function (response) {
                debugger;
                if (response.data.Success) {
                    //   $scope.People = response.data;
                    //alert("Data was updated successfully!");
                }
                else {
                    $scope.showError = true;
                }
            });  //end of http


        })  //end of modal
    } //end of edit
    //******************************************************************************************************

    //Delete Customer
    //******************************************************************************************************
    $scope.delete = function (toDelete) {
        debugger;
        var deleteAble = $scope.People.indexOf(toDelete);
        var modalInstance = $modal.open({
            templateUrl: 'DeleteCustomerModal.html',
            controller: 'deleteCustomer',
            resolve: {
                blankWindow: function () {
                    debugger;
                    return $scope.blankWindow = $scope.People[deleteAble]
                }
            }
        });
        modalInstance.result.then(function (response) {
            //send the selected row back to the c# controller
            debugger;
            x = $scope.People[deleteAble].ID;
            var request = {
                method: 'POST',
                url: '/Customer/Delete',
                data: { id : x }
            };
            $http(request).then(function (response) {
                debugger;
                if (response.data.Success) {
                    $scope.People.splice(deleteAble, 1);
                   // alert("Data was deleted successfully!");
                }
                else {
                    $scope.showError = true;
                }
            });
        })
    }
})
//******************************************************************************************************
app.controller('deleteCustomer', function ($scope, $http, $modalInstance, blankWindow) {
    $scope.blankWindow = blankWindow;

    $scope.ok = function () {
        debugger;

        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
});

//******************************************************************************************************
app.controller('AddCustomers', function ($scope, $http, $modalInstance, orderform) {
    //we control the data form over here and then pass it to the result to the POST function
    //the assignment below ensures that data is not lost when it is sent back to the POST function
    $scope.customerform = customerform;

    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

//******************************************************************************************************
app.controller('editCustomers', function ($scope, $http, $modalInstance, customerform) {
    $scope.customerform = customerform;

    $scope.ok = function () {
        debugger;
        $modalInstance.close('cancel');
        //location.reload();
    }
    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
})