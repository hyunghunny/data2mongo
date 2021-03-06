﻿
var mongodb = require('mongodb');
var self;

var MongoDBManager = function (options) {
    /*
    var dbServer = new mongodb.Server(
        options.host, 
        options.port, 
        { auto_reconnect: false }
    );
    
    var db = new mongodb.Db(options.dbName, 
    dbServer, 
    { w: 1 }
    );
    */
    this.url = 'mongodb://' + options.host + ':' + options.port + '/' + options.dbName;
    this.database = null;
    this.collection = null;
    this.prevObj = null;
    this.options = options;
}

MongoDBManager.prototype.connect = function (callback) {
    var self = this;
    
    var client = mongodb.MongoClient;

    client.connect(this.url, function (err, db) {
        if (err) {
            console.log(err);
        } else {
            self.database = db;
            db.collection(self.options.collectionName, function (err, collection) {
                if (err) {
                    console.log(err);
                }
                self.collection = collection;
                
                callback(err);
            });
        }
    });
}

MongoDBManager.prototype.disconnect = function () {
    if (this.database) {
        this.database.close();
        console.log('data base is disconnected properly.');
    }
}


MongoDBManager.prototype.insert = function (obj, callback) {
    var self = this;
    if (!this.collection) {
        console.log('error! ' + self.options.collectionName + ' collection is not connected.');
        return;
    }

    this.collection.insert(obj, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (callback) {
            callback(result); 
        }
        
    });
}

MongoDBManager.prototype.upsert = function (obj, callback) {
    var self = this;
    if (!this.collection) {
        console.log('error! ' + self.options.collectionName + ' collection is not connected.');
        return;
    }
   
    this.collection.update({ _id: obj._id }, 
        obj, { safe: true, upsert: true }, 
        function (err, result) {
            if (err) {
                console.err(err);
                //terminate node if error happens
                process.exit(-1);
            }
            if (callback) {
                //console.log(obj._id + ' is upserted');
                callback(result);

            } else {
                console.log('upsert executed : ' + result);
            }        
    });
}

MongoDBManager.prototype.removeAll = function (callback) {
    var self = this;
    if (!this.collection) {
        console.log('error! ' + self.options.collectionName + ' collection is not connected.');
        return;
    }
    this.collection.remove({}, {}, callback);
}

MongoDBManager.prototype.isReady = function () {
    return this.collection != null;
}

MongoDBManager.prototype.find = function (queries, callback) {
    var self = this;
    var options = {};

    this.collection.find(queries, { _id: false }, options)
                .toArray(function (err, result) {
        callback(result);
    });
 
}

/**
 * Search by span
 * 
 * @param {} date the base date to search item
 * @param {} span  seconds to search from a base date 
 * @param {} callback 
 */

MongoDBManager.prototype.findBySpan = function (date, span, callback) {
    var self = this;
    var options = {};
    var queries = {};
    var startDate = new Date(date);
    var endDate = new Date(date);
    var secs = startDate.getSeconds();
    secs = secs + span;
    endDate.setSeconds(secs);
    
    //console.log("from " + startDate + " to " + endDate + "at "+ self.options.collectionName);
    // startDate <= x < endDate 
    queries.dateFrom = {
        $gte: startDate,
        $lt: endDate
    }

    this.collection.find(queries, { _id: false }, options)
                .sort({dateFrom : 1})
                .toArray(function (err, result) {
        if (err) {
            console.log(err);
        }
//            console.log(result);
        callback(result);
    });
 
}


MongoDBManager.prototype.findLatest = function (callback) {
    var self = this;
    this.collection.find({}, { _id: false })
                .sort({ $natural : -1 })
                .limit(1)
                .toArray(function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result != null && result.length == 1) {
            callback(result[0]);
        } else {
            callback(0); // XXX:unexpected return from mongodb
        }
        
    });
}

module.exports = MongoDBManager;