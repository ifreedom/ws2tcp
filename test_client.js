const WebSocket = require('ws');

const readline = require('readline');
const ws = new WebSocket('ws://127.0.0.1:8080');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
});

rl.on('line', (line) => {
    ws.send(line.trim());
    rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

console.log("waiting for connect...");

ws.on('open', () => {
    rl.prompt();
});

ws.on('message', (data) => {
  console.log(data);
});
