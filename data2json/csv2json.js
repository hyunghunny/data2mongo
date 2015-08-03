/**
 * CSV file to JSON convertor
 * 
 * 
 * @author webofthink 
 */

var Converter = require("csvtojson").core.Converter;

exports.transform = function (filename, callback) {

    console.log("transform " + filename + ".csv file to " + filename + ".json file.");
    
    // The constructResult parameter=false will turn off final result construction in memory for stream feature. 
    // toArrayString will stream out a normal JSON array object.
    var csvConverterOption = { constructResult: false, toArrayString: true }
    var csvConverter = new Converter(csvConverterOption);

    var csvPath = './dataset/' + filename + ".csv";
    var jsonPath = './dataset/' + filename + ".json";

    var readStream = require("fs").createReadStream(csvPath);    
    var writeStream = require("fs").createWriteStream(jsonPath);
    
    readStream.pipe(csvConverter).pipe(writeStream);
    readStream.on('end', callback);
}

exports.readByRecords = function (filename, recordCb, endCb) {
    console.log("read " + filename + ".csv file by record ");
    var csvPath = './dataset/' + filename + ".csv";
        
    var readStream = require("fs").createReadStream(csvPath); 

    var csvConverterOption = { }
    var csvConverter = new Converter(csvConverterOption);
    
    csvConverter.on("record_parsed", recordCb);
    
    csvConverter.on("end_parsed", endCb);
    
    readStream.pipe(csvConverter);

}

exports.readAll = function (filename, callback) {
    console.log("read " + filename + ".csv file by record ");
    
    var readStream = require("fs").createReadStream(filename + ".csv");
    
    var csvConverterOption = {}
    var csvConverter = new Converter(csvConverterOption);
    
    csvConverter.on("end_parsed", callback);
    
    readStream.pipe(csvConverter);

}
