var axios = require('axios');
var data = JSON.stringify({
    "collection": "users",
    "database": "test",
    "dataSource": "ClusterData",
    "projection": {
        "_id": 1
    }
});

var config = {
    method: 'post',
    url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-grlmplk/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '8fArygJMkBFERWz3lWCINM6NsxaoCigga7RWlwr2QXUzG1HI36KbiAM3rPWvvQQx',
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
