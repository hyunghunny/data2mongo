/**
 * Preprocessing for Encored dataset
 * 
 * @description A csv file which are preprocessed by jyhan is required.
 * 
 * @author webofthink 
 */

exports.process = function(rawObj, delta) {

    var processedObj = {};
    processedObj.dateFrom = convertDate(rawObj);

    // add to get the finalized measurement time 
    var dateTo = convertDate(rawObj);
    dateTo.setSeconds(dateTo.getSeconds() + delta);
    processedObj.dateTo = dateTo;

    var edms = new EDMInfoFactory(rawObj);
    processedObj.ux = edms.ux;
    processedObj.marg = edms.marg;
    processedObj.hcc = edms.hcc;
    
    processedObj._id = parseInt(rawObj.timestamp); // XXX: add to define uniqueness check
    return processedObj;
}

function convertDate(obj) {
    var dateValue = new Date();

    // type converting for date
    if (obj.timestamp) {
        dateValue = new Date(obj.timestamp * 1000); // for converting from unix timestamp
//        console.log(dateValue);
    } else {
        console.log('[WARNING] no such property is existed: time_index');
    }
    return dateValue;
}


var EDMInfoFactory = function(obj) {
    // UX EDM
    var uxEdm = new EDMInfo(1169, "D409");

    uxEdm.addFeeder(new FeederInfo(3, obj["v1169_3"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(4, obj["v1169_4"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(5, obj["v1169_5"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(6, obj["v1169_6"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(7, obj["v1169_7"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(8, obj["v1169_8"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(9, obj["v1169_9"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(10, obj["v1169_10"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(11, obj["v1169_11"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(12, obj["v1169_12"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(13, obj["v1169_13"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(14, obj["v1169_14"], "computer"));
    uxEdm.addFeeder(new FeederInfo(15, obj["v1169_15"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(16, obj["v1169_16"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(17, obj["v1169_17"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(18, obj["v1169_18"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(19, obj["v1169_19"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(20, obj["v1169_20"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(21, obj["v1169_21"], "unclassified"));
    uxEdm.addFeeder(new FeederInfo(22, obj["v1169_22"], "hvac"));
    uxEdm.addFeeder(new FeederInfo(23, obj["v1169_23"], "light"));


    // MARG EDM
    var margEdm = new EDMInfo(1171, "D406");

    margEdm.addFeeder(new FeederInfo(3, obj["v1171_3"], "hvac"));
    margEdm.addFeeder(new FeederInfo(4, obj["v1171_4"], "hvac"));
    margEdm.addFeeder(new FeederInfo(5, obj["v1171_5"], "hvac"));
    margEdm.addFeeder(new FeederInfo(6, obj["v1171_6"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(7, obj["v1171_7"], 'computer'));
    margEdm.addFeeder(new FeederInfo(8, obj["v1171_8"], 'computer'));
    margEdm.addFeeder(new FeederInfo(9, obj["v1171_9"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(10, obj["v1171_10"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(11, obj["v1171_11"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(12, obj["v1171_12"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(13, obj["v1171_13"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(14, obj["v1171_14"], 'computer'));
    margEdm.addFeeder(new FeederInfo(15, obj["v1171_15"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(16, obj["v1171_16"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(17, obj["v1171_17"], 'light'));
    margEdm.addFeeder(new FeederInfo(18, obj["v1171_18"], "unclassified"));
    margEdm.addFeeder(new FeederInfo(21, obj["v1171_21"], "unclassified"));


    // HCC EDM
    var hccEdm = new EDMInfo(1168, "D410");

    hccEdm.addFeeder(new FeederInfo(3, obj["v1168_3"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(4, obj["v1168_4"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(5, obj["v1168_5"], "computer"));
    hccEdm.addFeeder(new FeederInfo(6, obj["v1168_6"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(7, obj["v1168_7"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(8, obj["v1168_8"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(9, obj["v1168_9"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(10, obj["v1168_10"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(11, obj["v1168_11"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(12, obj["v1168_12"], "computer"));
    hccEdm.addFeeder(new FeederInfo(13, obj["v1168_13"], "light"));
    hccEdm.addFeeder(new FeederInfo(14, obj["v1168_14"], "hvac"));
    hccEdm.addFeeder(new FeederInfo(15, obj["v1168_15"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(16, obj["v1168_16"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(17, obj["v1168_17"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(18, obj["v1168_18"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(19, obj["v1168_19"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(20, obj["v1168_20"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(21, obj["v1168_21"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(22, obj["v1168_22"], "unclassified"));
    hccEdm.addFeeder(new FeederInfo(23, obj["v1168_23"], "unclassified"));
   

    this.ux = uxEdm;
    this.marg = margEdm;
    this.hcc = hccEdm;

}

var EDMInfo = function(id, location) {
    
    this.deviceID = id;
    this.location = location;
    this.feeders = [];

}

EDMInfo.prototype.addFeeder = function(feedObj) {
    this.feeders.push(feedObj);
}

var FeederInfo = function(id, value, description) {
    this.feederID = id;
    var converted_value = 0;
    if (value != null ) {
        converted_value = parseInt(value);
    } else {
        console.log('invalid value at ' + id );
    }
    this.value = converted_value;
    this.description = description;
}