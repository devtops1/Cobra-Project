//get order instance
$scope.edit = function (order) {
    //get the index from the table scope object array
    var instance = $scope.AllOrder.indexOf(order);
    var modalInstance = $scope.open({
        resolve: {
            orderform: function () {
                return $scope.orderform = $scope.AllOrders;
            },
            custList: function () {
                return $scope.custList = $scope.AllOrder[instance].Name;
            }
        }
    })
}