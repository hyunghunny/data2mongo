/**
 * Preprocessing for Wind SCADA 1sec dataset
 * 
 * @description A csv file which are preprocessed by won shin.
 * 
 * @author webofthink 
 */

exports.process = function (rawObj) {
    
    var processedObj = rawObj;
    processedObj.PCTimeStamp = convertDate(rawObj);
    processedObj._id = processedObj.PCTimeStamp.getTime(); // XXX: added to check data already existed

    return processedObj;
}

function convertDate(obj) {
    var dateValue = new Date();
    obj.PCTimeStamp = obj.PCTimeStamp.replace('/', '-'); // XXX: handle time string format difference
    // type converting for date
    if (obj.PCTimeStamp) {
        dateValue = new Date(obj.PCTimeStamp);
//        console.log(dateValue);
    } else {
        console.log('[WARNING] no such property is existed: PCTimeStamp');
    }
    return dateValue;
}