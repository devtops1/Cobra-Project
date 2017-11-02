var orderApp = angular.module('OrdersModule', ['ui.bootstrap']);
orderApp.controller('Orders', function ($scope, $modal, $http, $log) {
    $http.get("/Home/GetOrders")
    .then(function (response) {
        debugger;
        for (var i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].Date === null) {
                alert("Empty data found")
            }
            else {
                var strdate = new Date(parseInt(response.data.data[i].Date.substr(6, 13))).toString().substr(0, 15);
                response.data.data[i].Date = strdate;
            }
        }
        $scope.AllOrders = response.data.data;
    });//end get all orders

    //get customer list from the database
    //feed it to the order form property
    debugger;
    $http.get("/Customer/GetSingleCustomer")
   .then(function (response) {
       debugger;
       $scope.custList = response.data.data;
   });//end get customer names

    debugger;
    $http.get("/Orders/GetSingleProduct")
    .then(function (response) {
        debugger;
        $scope.prodList = response.data.data;
    });//end get product names
    //***********************************************************************************************
    $scope.blankWindow = {}
    $scope.orderform = { Date: "", Name: $scope.custList, Product: $scope.prodList, Price: "" }
//Add function
    $scope.getCurrentDate = {};
    $scope.open = function () {
        debugger;
        var modalInstance = $modal.open({
            templateUrl: 'AddOrderModal.html',
            controller: "addOrders",
            resolve: {
                orderform: function () {
                    debugger;
                    return $scope.orderform;
                },
                prodList: function () {
                    return $scope.prodList;
                },
                custList: function () {
                    return $scope.custList;
                },
                currentPrice: function () {
                    return $scope.currentPrice;
                }
            }
        });
        modalInstance.result.then(function () {
            //get the names for custList and prodList
            debugger;
            $scope.formatToSend = { Date: $scope.orderform.Date, Name: $scope.orderform.Name.Name, PersonID: $scope.orderform.Name.ID, Product: $scope.orderform.Product.ProductName, ProductID: $scope.orderform.Product.ID }
            debugger;
            var request = {
                method: 'POST',
                url: '/Orders/AddOrders',
                data: JSON.stringify($scope.formatToSend)
            };
            $http(request).then(function (response) {
                debugger;
                if (response.data.Success) {
                    $scope.AllOrders.push($scope.orderform);
                    $http.get("/Home/GetOrders").then(function (response) {
                        for (var i = 0; i < response.data.data.length; i++) {
                            if (response.data.data[i].Date === null) {
                                alert("Empty data found")
                            }
                            else {
                                var strdate = new Date(parseInt(response.data.data[i].Date.substr(6, 13))).toString().substr(0, 15);
                                response.data.data[i].Date = strdate;
                            }
                        }
                        $scope.AllOrders = response.data.data;
                    })
                }
            })
        })
    };//end add order

    //Edit Order********************************************************************************************
    $scope.edit = function (x) {
        //get the index from the array for current click
        debugger;
        var instance = $scope.AllOrders.indexOf(x);
        console.log(instance);
        var modalInstance = $modal.open({
            templateUrl: 'EditOrderModal.html',
            controller: 'editOrder',
            resolve: {
                orderform: function () {
                    return $scope.orderform = $scope.AllOrders[instance];
                },
                custList: function () {
                    return $scope.custList;
                    debugger;
                    console.log($scope.custList);
                },
                prodList: function () {
                    return $scope.prodList;
                    debugger;
                    console.log($scope.prodList);
                },
                instance: function () {
                    return instance;
                }
            }
        });
        modalInstance.result.then(function (response) {
            //get data to be posted
            var getData = $scope.AllOrders[instance];
            $scope.dataToEdit = { Name: $scope.AllOrders[instance].Name, }
            x = getData;
            $http.post('/Orders/EditOrder', x).then(function (response) {
                if (response.Success) {
                    alert('data sent to Edit method');
                }
            })
        });
        $http(request).then(function (response) {
            debugger;
            if (response.data.Success) {
                $scope.AllOrders.push($scope.orderform);
                $http.get("/Home/GetOrders").then(function (response) {
                    for (var i = 0; i < response.data.data.length; i++) {
                        if (response.data.data[i].Date === null) {
                            alert("Empty data found")
                        }
                        else {
                            var strdate = new Date(parseInt(response.data.data[i].Date.substr(6, 13))).toString().substr(0, 15);
                            response.data.data[i].Date = strdate;
                        }
                    }
                    $scope.AllOrders = response.data.data;
                })
            }
        })
    }
    //Edit Order****************************************************************************************
    //$scope.edit = function (order) {
    //    debugger;
    //    var getOrderInstance = $scope.AllOrders.indexOf(order);
    //    var modalInstance = $modal.open({
    //        templateUrl: 'EditOrderModal.html',
    //        controller: 'editOrder',
    //        resolve: {
    //            orderform: function () {
    //                debugger;
    //                return $scope.orderform = $scope.AllOrders[getOrderInstance];
    //            },
    //            custList: function () {
    //                debugger;
    //                return $scope.custList;
    //            },
    //            prodList: function () {
    //                debugger;
    //                return $scope.prodList;
    //            },
    //            //getCurrentDate: function () {
    //            //    debugger;
    //            //    return $scope.orderform = new Date($scope.orderform.Date);
    //            //}
    //        }
    //    });
    //    modalInstance.result.then(function (response) {
    //        debugger;
    //        x = $scope.AllOrders[getOrderInstance];
    //        debugger;
    //        $console.log($scope.AllOrders[getOrderInstance].Name)
    //        $http.post("/Orders/GetPrice", $scope.AllOrder[getOrderInstance.Name]).then(function (response) {
    //            $scope.currentPrice = response.data.data;
    //            x = $scope.currentPrice;
    //            debugger;
    //        }).then(function (response){
    //            $scope.gotPrice = response.data.data;
    //        });
    //        var request = {
    //            method: 'POST',
    //            url: '/Orders/EditOrder',
    //            data: JSON.stringify(x)
    //        }
    //        $http(request).then(function (response) {
    //            debugger;
    //            if (response.data.Success) {
    //                //   $scope.People = response.data;
    //                //alert("Data was updated successfully!");
    //            }
    //            else {
    //                $scope.showError = true;
    //            }
    //        });
    //    });
    //      //end of http
    //}//end of edit function
    //Delete Customer*****************************************************************************
    $scope.delete = function (toDelete) {
        debugger;
        var deleteInstance = $scope.AllOrders.indexOf(toDelete);
        var modalInstance = $modal.open({
            templateUrl: 'DeleteOrderModal.html',
            controller: 'deleteOrder',
            resolve: {
                blankWindow: function () {
                    return $scope.blankWindow = $scope.AllOrders[deleteInstance];
                },
                orderform: function () {
                    return $scope.orderform;
                }
            }

        });
        modalInstance.result.then(function (response) {
            //send the selected row back to the C# controller
            debugger;
            x = $scope.AllOrders[deleteInstance].OrderID;
            var request = {
                method: 'POST',
                url: '/Orders/DeleteOrder',
                data: { id: x }
            };
            $http(request).then(function (response) {
                debugger;
                if (response.data.Success) {
                    $scope.AllOrders.splice(deleteInstance, 1);
                }
            })
        })
    }
})//end controller

//Add Orders Modal
//**************************************************************************************
orderApp.controller('addOrders', function ($scope, $http, $modalInstance, orderform, prodList, custList) {
    debugger;
    $scope.orderform = orderform;
    $scope.prodList = prodList;
    $scope.custList = custList;

    $scope.ok = function () {
        $modalInstance.close('ok');
        $location.reload();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});//end add orders modal controller
debugger;
//Edit Orders Modal
//***************************************************************************************
orderApp.controller('editOrder', function ($scope, $http, $modalInstance, orderform, custList, prodList) {
    $scope.orderform = orderform;
    $scope.custList = custList;
    $scope.prodList = prodList;
    debugger;
    console.log(this);
    debugger;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});
//Delete Order Modal
//**************************************************************************************
orderApp.controller('deleteOrder', function ($scope, $http, $modalInstance, blankWindow, orderform) {
    debugger;
    $scope.blankWindow = blankWindow;
    $scope.orderform = orderform;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
});