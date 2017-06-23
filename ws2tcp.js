'use strict'

var net = require('net'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),

    Buffer = require('buffer').Buffer,
    WebSocketServer = require('ws').Server;

function heartbeat() {
  this.isAlive = true;
}

// Handle new WebSocket client
var make_client_handle = function(target_host, target_port) {
    return function(client) {
        var clientAddr = client._socket.remoteAddress, log;
        if(client.upgradeReq && client.upgradeReq.url) console.log(client.upgradeReq.url);
        log = function (msg) {
	    console.log(' ' + clientAddr + ': '+ msg);
        };
        log('WebSocket connection');
        log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

        client.isAlive = true;
        client.on('pong', heartbeat);

        var target = net.createConnection(target_port,target_host, function() {
	    log('connected to target');
        });
        target.on('data', function(data) {
	    //log("sending message: " + data);
	    try {
	        client.send(data);
	    } catch(e) {
	        log("Client closed, cleaning up target");
	        target.end();
	    }
        });
        target.on('end', function() {
	    log('target disconnected');
	    client.close();
        });
        target.on('error', function() {
	    log('target connection error');
	    target.end();
	    client.close();
        });

        client.on('message', function(msg) {
	    //log('got message: ' + msg);
	    target.write(msg);
        });
        client.on('close', function(code, reason) {
	    log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
	    target.end();
        });
        client.on('error', function(a) {
	    log('WebSocket client error: ' + a);
	    target.end();
        });
    };
};


// Send an HTTP error response
var http_error = function (response, code, msg) {
    response.writeHead(code, {"Content-Type": "text/plain"});
    response.write(msg + "\n");
    response.end();
    return;
}

// Process an HTTP static file request
var http_request = function (request, response) {
    return http_error(response, 403, "403 Permission Denied");
};

function createWsServer(argv) {
    console.log("WebSocket settings: ");
    console.log("    - proxying from " + argv.source.host + ":" + argv.source.port +
		" to " + argv.target.host + ":" + argv.target.port);

    var webServer, wsServer;

    if (argv.cert) {
	argv.key = argv.key || argv.cert;
	var cert = fs.readFileSync(argv.cert),
	    key = fs.readFileSync(argv.key);
	console.log("    - Running in encrypted HTTPS (wss://) mode using: " + argv.cert + ", " + argv.key);
	webServer = https.createServer({cert: cert, key: key}, http_request);
    } else {
	console.log("    - Running in unencrypted HTTP (ws://) mode");
	webServer = http.createServer(http_request);
    }
    webServer.listen(argv.source.port, argv.source.host, function() {
	wsServer = new WebSocketServer({server: webServer});
	wsServer.on('connection', make_client_handle(argv.target.host, argv.target.port));
    });

    const interval = setInterval(() => {
        wsServer.clients.forEach((client) => {
            if (client.isAlive === false) return client.terminate();

            client.isAlive = false;
            client.ping('', false, true);
        });
    }, 30000);
}

module.exports = createWsServer;
