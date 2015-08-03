exports.import = function (option, jsonArray, cb) {
    var DBManager = require('./dbmgr.js');
    var preprocessor = require('./encored/preprocessor.js');
    
    var mongodbOption = {
        host: "datascience.snu.ac.kr",
        port: 27017,
        dbName: option.db,
        collectionName: option.collection
    }
    
    var connectSuccessCallback = function (err) {
        //console.log(mongodbOption.dbName + ' DB connected');
        if (err == null) {
            jsonArray.forEach(function (val, idx, array) {
                var jsonObj = jsonArray[idx];
                var commitObj = preprocessor.process(jsonObj, option.delta);
                //console.log(commitObj);
                if (commitObj._id == 1431910800) {
                    console.log(JSON.stringify(commitObj));
                }
                dbmgr.upsert(commitObj);
            });
        }
        cb();
    }
    
    var dbmgr = new DBManager(mongodbOption);
    
    // connect to mongodb and insert data one by one
    dbmgr.connect(connectSuccessCallback);    
}