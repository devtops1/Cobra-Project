app.service("myService", function ($http) {
    this.AddPerson = function (person) {
        var response = $http({
            method: "post",
            url: "Customer/AddCustomer",
            data: JSON.stringify(person),
            dataType: "json"
        });
        return response;
    }
});
