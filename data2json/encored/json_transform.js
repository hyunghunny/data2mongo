// For testing only
function get_json(date) {
    var json = require('../dataset/15mins-2015-7-11~12.json');
    //console.log(json);
    return json;
}

/*
* transform the Encored API's JSON object format to csv2json format
* see http://api.ongetit.com/1.1/sites/beff61ce9d7b67adbb357de8332db1995c319d15/15min/usages?groupby=feeder&start=1436540400000&end=1436626800000
*/
exports.transform = function (rawObj, unit) {
    var csvStyleObj = {};

    Object.getOwnPropertyNames(rawObj).forEach(function (val, idx, array) {
        //console.log(val + ' -> ' + rawObj[val]);
        var feederId = val;
        feederId = 'v' + feederId.replace(':', '_');
        //console.log(feederId);  
        var measures = rawObj[val];
        for (var i = 0; i < measures.length; i++) {
            var timestamp = measures[i].timestamp
            var unix_timestamp = timestamp / 1000;
            var date = new Date(timestamp)
            var value = 0;
            // XXX:exceptional case handling - sometimes no measurement happened.
            if (measures[i].unitPeriodUsage) {
                value = parseInt(measures[i].unitPeriodUsage * unit);
            } else {
                //console.log('missing observation: ' + feederId + "[" + i + "]");
            }            
           
            //console.log(date + "=" + value);
            if (csvStyleObj[unix_timestamp] === undefined) {
                csvStyleObj[unix_timestamp] = {};
            }
            csvStyleObj[unix_timestamp][feederId] = value;
        }
    });
//console.log(csvStyleObj);
var csvConvertedArray = [];
Object.getOwnPropertyNames(csvStyleObj).forEach(function (val, idx, array) {
    var timestamp = val;
    var feeders = csvStyleObj[val];
    feeders['timestamp'] = timestamp;
    csvConvertedArray.push(feeders);
});
//console.log(csvConvertedArray);
return csvConvertedArray;
}
//var rawObj = get_json();
