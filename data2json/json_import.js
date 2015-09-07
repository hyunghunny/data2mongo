var DBManager = require('./dbmgr.js');
var preprocessor = require('./encored/preprocessor.js');

exports.import = function (option, jsonArray, cb) {
    
    
    var mongodbOption = {
        host: "datascience.snu.ac.kr",
        port: 27017,
        dbName: option.db,
        collectionName: option.collection
    }
    
    var connectCb = function (err) {
        //console.log(mongodbOption.dbName + ' DB connected');
        if (err == null) {
            jsonArray.forEach(function (val, idx, array) {
                var jsonObj = jsonArray[idx];
                var commitObj = preprocessor.process(jsonObj, option.delta);

                dbmgr.upsert(commitObj);
            });
        } else {
            console.log('db connnection failed.');
        }
        cb(dbmgr);
    }
    
    var dbmgr = new DBManager(mongodbOption);
    
    // connect to mongodb and insert data one by one
    dbmgr.connect(connectCb);
}