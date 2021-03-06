﻿var loader = require('./encored_data_loader.js');
//var reducer = require('../db_reduce.js');
var day_span = 86400000;

var quarters_option = {
    db: "Encored",
    collection: "site73_15min_new", 
    type : '15min',
    delta : 15 * 60
}

var hours_option = {
    db: "Encored",
    collection: "site73_hour_new", 
    type : 'hourly',
    delta : 60 * 60
}

// select database type
var option = hours_option;//quarters_option; //hours_option;

exports.run = function () {
    
    var fromDate = new Date('2015-9-7');//new Date('2014-8-5');
    var toDate = new Date('2015-9-7');
    
    
    importDaybyDay(fromDate, toDate, option, function (result) {
        console.log(result);
    });
 
}

var importer = require('../json_import.js');
var transformer = require('./json_transform.js');
var unit = 1; // XXX:Do not align unit of measurement 

function importDaybyDay(startDate, toDate, option, callback) {
    
    var endDate = new Date(startDate.getTime() + day_span);
    
    console.log('load data from ' + startDate.toLocaleString() + ' to ' + endDate.toLocaleString());
    loader.load(option.type, startDate, endDate, function (data) {
        var callback = callback; // XXX: to passing callback to importer's callback
        
        if (data == null) {
            console.log('error occurred: ' + data);
            return;
        }
        
        var transformedArray = transformer.transform(data, unit);
        
        importer.import(option, transformedArray, function (db) {
            if (endDate.getTime() <= toDate.getTime()) {
                importDaybyDay(endDate, toDate, option, callback);
            } else {
                console.log('all database loaded completely.');
            }

        });
    });
}