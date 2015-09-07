process.setMaxListeners(0); // to aviod warning

var runner = require("./encored/runner.js");
var sync = require("./encored/sync.js");

//runner.run();
sync.start();
