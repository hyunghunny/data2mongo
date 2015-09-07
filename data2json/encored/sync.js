
var CronJob = require('cron').CronJob;
var loader = require('./encored_data_loader.js');
var importer = require('../json_import.js');
var transformer = require('./json_transform.js');

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


function updateQuarters() {
    var now = new Date();
    var fromDate = new Date(now);
    fromDate.setMinutes(fromDate.getMinutes() - 15);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    console.log('[' + now.toTimeString() + ']' + '[15MIN] update from ' + fromDate.toLocaleString() + ' to ' + now.toLocaleString());
    // TODO: what will be the start date time?
    importData(fromDate, now, quarters_option);
    
}

function updateHours() {
    // update quarters first
    updateQuarters();

    var now = new Date();
    var fromDate = new Date(now);
    fromDate.setHours(fromDate.getHours() - 1);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    console.log('[' + now.toTimeString() + ']' + '[HOUR] update from ' + fromDate.toLocaleString() + ' to ' + now.toLocaleString());
    importData(fromDate, now, hours_option);
}

function importData(startDate, endDate, option) {

    loader.load(option.type, startDate, endDate, function (data) {
        
        if (data == null) {
            console.log('error occurred: ' + data);
            return;
        }
        var unit = 1; // XXX:Do not align unit of measurement 
        
        var transformedArray = transformer.transform(data, unit);
        
        importer.import(option, transformedArray, function () {
            //console.log('database imported completely.');
        });
    });
}

exports.start = function () {
    var hoursJob = new CronJob('10 00 * * * *', updateHours);
    var quarter1Job = new CronJob('10 15 * * * *', updateQuarters);
    var halfJob = new CronJob('10 30 * * * *', updateQuarters);
    var quarter3Job = new CronJob('10 45 * * * *', updateQuarters);
    hoursJob.start();
    quarter1Job.start();
    halfJob.start();
    quarter3Job.start();

    console.log('sync started...');
}
