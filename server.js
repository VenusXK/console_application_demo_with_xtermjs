const express = require("express");
const expressWs = require("express-ws");
const app = express();
expressWs(app);
app.listen(4000, "127.0.0.1");

const pty = require("node-pty");
const os = require("os");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const term = pty.spawn(shell, ["--login"], {
  name: "xterm-color",
  cols: 80,
  rows: 24,
  cwd: process.env.HOME,
  env: process.env,
});
app.ws("/socket", (ws, req) => {
  term.on("data", function (data) {
    ws.send(data);
  });
  ws.on("message", (data) => {
    term.write(data);
  });
  ws.on("close", function () {
    term.kill();
  });
});

