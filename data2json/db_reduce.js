var DBManager = require('./dbmgr.js');

var secDbOption = {
    host: "datascience.snu.ac.kr",
    port: 27017,
    dbName: "Encored",
    collectionName: "site73_1sec"
}

var fiftMinDbOption = {
    host: "datascience.snu.ac.kr",
    port: 27017,
    dbName: "Encored",
    collectionName: "site73_15min"
}

var hourDbOption = {
    host: "datascience.snu.ac.kr",
    port: 27017,
    dbName: "Encored",
    collectionName: "site73_hour_new" // XXX: add for validation
}


var read1SecDataByTimeSpan = function(baseTime, span, cb) {
    var secDbMmgr = new DBManager(secDbOption);

    var connectSuccessCallback = function(err) {
//        console.log('1sec DB connected');
        if (err == null) {
            console.log('find from ' + baseTime + ' with ' + span);
            secDbMmgr.findBySpan(baseTime, span, cb);

        }
    }
    secDbMmgr.connect(connectSuccessCallback);
}


function accumulateFeedersValue(sourceFeeders, targetFeeders) {
    for (var i = 0; i < targetFeeders.length; i++) {
        targetFeeders[i].value = sourceFeeders[i].value + targetFeeders[i].value;
        //      console.log('Target ' + i + ' value is increased to '+ targetFeeders[i].value + ' by adding ' + sourceFeeders[i].value);
    }

}

exports.create15minCollection = function(startTime, cb) {

    var minDbMmgr = new DBManager(fiftMinDbOption);
    var span = 15 * 60;
    var baseTime = new Date(startTime);


    var readSuccessCallback = function(results) {
        if (results && results.length > 0) {
            // clone the first object to accumulate it
            var accObj = JSON.parse(JSON.stringify(results[0]));
            // XXX:convert to Date type again
            accObj.dateFrom = new Date(accObj.dateFrom);
            accObj._id = (accObj.dateFrom).getTime() - ((accObj.dateFrom).getTime() % 1000); // XXX:get unix timestamp
            // For debugging, look at a feeder's value for checking
            //console.log(accObj.ux.feeders[11].feederID + " = " + accObj.ux.feeders[11].value);
            // XXX: i starts with 1, instread of 0. because accObj is result[0]  
            for (var i = 1; i < results.length; i++) {

                // accummulates feeder object's value properties to accObj

                accumulateFeedersValue(results[i].hcc.feeders, accObj.hcc.feeders);
                accumulateFeedersValue(results[i].marg.feeders, accObj.marg.feeders);
                accumulateFeedersValue(results[i].ux.feeders, accObj.ux.feeders);


                if (i === results.length - 1) {
                    // set date value with last item's date
                    accObj.dateTo = results[i].dateTo;
                }
            }
            if (results.length === 900) {

                minDbMmgr.upsert(accObj);
            } else {
                console.log('invalid # of results : ' + results.length);
            }


            baseTime.setSeconds(baseTime.getSeconds() + span);
            // read again
            read1SecDataByTimeSpan(baseTime, span, readSuccessCallback);
        } else {
            if (cb) {
                cb();
            }
        }
    };

    var connectSuccessCallback = function(err) {
//        console.log('15min DB connected');
        if (err == null) {
//            console.log('read data from ' + baseTime);
            read1SecDataByTimeSpan(baseTime, span, readSuccessCallback);

        }
    }

    minDbMmgr.connect(connectSuccessCallback);
}

var read15minDataByTimeSpan = function(baseTime, span, cb) {
    var fiftMinDbMmgr = new DBManager(fiftMinDbOption);

    var connectSuccessCallback = function(err) {
//        console.log('15 min DB connected');
        if (err == null) {
            console.log('find from ' + baseTime + ' with ' + span);
            fiftMinDbMmgr.findBySpan(baseTime, span, cb);

        }
    }
    fiftMinDbMmgr.connect(connectSuccessCallback);
}

exports.createHourCollection = function(startTime, cb) {

    var hourDbMmgr = new DBManager(hourDbOption);
    var span = 60 * 60; // secs / 1 hour 
    var baseTime = new Date(startTime);


    var readSuccessCallback = function(results) {

        if (results && results.length > 0) {
            // clone the first object to accumulate it
            var accObj = JSON.parse(JSON.stringify(results[0]));
            // XXX:convert to Date type again
            accObj.dateFrom = new Date(accObj.dateFrom);
            accObj._id = (accObj.dateFrom).getTime() - ((accObj.dateFrom).getTime() % 1000); // XXX:get unix timestamp
            for (var i = 1; i < results.length; i++) {

                // accummulates object's value properties
                accumulateFeedersValue(results[i].ux.feeders, accObj.ux.feeders);
                accumulateFeedersValue(results[i].hcc.feeders, accObj.hcc.feeders);
                accumulateFeedersValue(results[i].marg.feeders, accObj.marg.feeders);


                if (i === results.length - 1) {
                    // set date value with last item's date
                    accObj.dateTo = results[i].dateTo;
                }
            }
            if (results.length === 4) {
                hourDbMmgr.upsert(accObj);
            } else {
                console.log('invalid # of results : ' + results.length);
            }


            baseTime.setSeconds(baseTime.getSeconds() + span);
            // read again
            read15minDataByTimeSpan(baseTime, span, readSuccessCallback);
        } else {
            if (cb) {
                cb();
            }
        }
    };

    var connectSuccessCallback = function(err) {
//        console.log('1 hour DB connected');
        if (err == null) {

            read15minDataByTimeSpan(baseTime, span, readSuccessCallback);

        }
    }

    hourDbMmgr.connect(connectSuccessCallback);
}
