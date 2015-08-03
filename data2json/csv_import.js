
exports.import = function(option, preprocessor, cb) {
    var csv2json = require('./csv2json');
    var DBManager = require('./dbmgr.js');
    
    
    var filename = option.csv;
    var mongodbOption = {
        host: "datascience.snu.ac.kr",
        port: 27017,
        dbName: option.db,
        collectionName: option.collection
    }
    
    var dbmgr = new DBManager(mongodbOption);
    
    var validate = function (obj, cb) {
        // find the object is already existed
        dbmgr.find({ dateFrom: obj.dateFrom }, function (result) {
            var error = null;
            if (result.length !== 0) {
                error = " item is already existed in database";
            }
            cb(error);
        });

    }
     
    
    var readRecordCallback = function (resultRow, rawRow, rowIndex) {
        //console.log('reading a record #' + rowIndex);
        var commitObj = preprocessor.process(resultRow, 1);
        
        // FIXME: validation occurs FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory
        /*
        validate(commitObj, function(err) {
            if (err == null) {
                dbmgr.insert(commitObj);
            } else {
                console.log('failed to validate object:' + err);
            }
        });
        */
         dbmgr.insert(commitObj);
    }
    
    
    var readAllCallback = function () {
        
        console.log('reading all item is completed.');
        if (cb) {
            cb();
        }
    }
    
    var connectSuccessCallback = function (err) {
//        console.log('DB connected');
        if (err == null) {
            csv2json.readByRecords(filename, readRecordCallback, readAllCallback);

        }

    }
    
    // connect to mongodb and insert data one by one
    dbmgr.connect(connectSuccessCallback);
}