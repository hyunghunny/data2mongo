var Client = require('node-rest-client').Client;
client = new Client();

var baseURL = 'http://api.ongetit.com/1.1/';
var site_id = 'beff61ce9d7b67adbb357de8332db1995c319d15';
var auth_key = "Basic YjZhMDdlYjc4YTE3NDEwMmJmMmY2YzQ0OWYxOTIwOTc=";


exports.load = function (measureType, startDate, endDate, callback) {
    //var measureType = '15min';
    
    var args = {
        headers : {
            "Content-Type": "application/json",
            "Authorization": auth_key
        },
        path : {
            "siteId" : site_id,
            "measureType" : measureType
        }
    };

    var startTimestamp = startDate.getTime();
    var endTimestamp = endDate.getTime();

    var requestURL = baseURL + 'sites/${siteId}/${measureType}/usages?groupby=feeder&start=' + startTimestamp + '&end=' + endTimestamp;

    client.get(requestURL, args, function (data, response) {
        callback(data);
    })
}
