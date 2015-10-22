$ajax({

    // GET
    //url: '/getList',
    //method: 'GET',
    //data: {'limit': 10, 'offset': 0},

    // POST
    url: '/add',
    method: 'POST',
    data: {'name': 'yangFan'},

    // CALLBACK
    success: function (json) {
        console.log(json);
    },
    error: function () {
        //ignore
    }
});