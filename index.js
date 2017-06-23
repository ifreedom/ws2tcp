var ws2tcp = require('./ws2tcp');
ws2tcp({
    source: { host: "0.0.0.0", port: "8080" },
    target: { host: "127.0.0.1", port: "8889" }
});
