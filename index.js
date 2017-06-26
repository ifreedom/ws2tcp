var ws2tcp = require('./ws2tcp');
var config = require("./config");

config.forEach((c) => {
    ws2tcp(c);
});
