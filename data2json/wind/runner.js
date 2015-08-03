
function getCSVFiles() {
    var turbines = ["WTG01"];
    //var years = [2008, 2009, 2010, 2011, 2012, 2013, 2014];
    // TODO: fix required.
    var years = [2008, 2009, 2011, 2012]; // 2010, 2013 has a flaw during import
    
    var csvFiles = [];
    
    for (var i = 0; i < turbines.length; i++) {
        for (var j = 0; j < years.length; j++) {
            var csvFile = turbines[i] + '_' + years[j];
            console.log(csvFile);
            csvFiles.push(csvFile);
        }
    }
    return csvFiles;
}

var csvFiles = getCSVFiles();

exports.run = function () {
    var importer = require('../csv_import.js');
    var preprocessor = require('./preprocessor.js'); // preprocessor for wind SCADA dataset
    var option = {
        db: "windSCADA",
        collection: "WTG01"
    }
    
    
    var importSuccessCb = function () {
        if (csvFiles.length > 0) {
            option.csv = csvFiles.pop();
            console.log('Trying to import ' + option.csv);
            importer.import(option, preprocessor, importSuccessCb);

        } else {
            console.log("import ended.");
        }    
    }
           
    if (csvFiles.length > 0) {
        option.csv = csvFiles.pop();
        console.log('Trying to import ' + option.csv);
        importer.import(option, preprocessor, importSuccessCb);
        
    }
     
}
