var assert = require('assert');
var CronJob = require('cron').CronJob;

var pattern = '2 * * * * *';

exports['Pattern test'] = function () {
    assert.ok(true, "This shouldn't fail");
    
    try {
        new CronJob(pattern, function () {
            assert.ok(true, "This pattern is valid");
        })
    } catch (ex) {
        assert.ok(false, "cron pattern not valid");
    }
}

exports['Cron repeat test'] = function () {
    new CronJob(pattern, function () {
        assert.ok(true, "This pattern is valid");
    }, null, true);
 
}