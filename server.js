
// 调包
const express = require('express');
const expressWs = require('express-ws')
const os = require("os");
const pty = require("node-pty");
const TERMINAL_PORT=8086
const app = express()
const terminals = {}, logs = {}
const USE_BINARY = os.platform() !== "win32";


expressWs(app);

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.post('/terminals', (req, res) => {
  // 把进程变量复制过来
  const env = Object.assign({}, process.env)
  // 解析传入参数的长、宽高
  // let cols = parseInt(req.query.cols),
      // rows = parseInt(req.query.rows),
      // 通过pty初始化terminal
  let term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
          name: 'xterm-256color',
          cols: 80,
          rows: 24,
          cwd: env.PWD,
          env: env,
          encoding: 'utf8'
      })
  // 输出创建的终端id
  console.log('Created terminal with PID: ' + term.pid)
  // 将终端加入终端池
  terminals[term.pid] = term
  // 创建记录交互信息的存储值
  logs[term.pid] = ''
  // 将终端返回的数据记录到存储内容内
  term.onData(function (data) {
      logs[term.pid] += data
  })
  // 向前端发送终端的id
  res.send(term.pid.toString())
  // res.send("hello")
  res.end()
})

app.ws('/terminals/:pid', function (ws, req) {
  const term = terminals[parseInt(req.params.pid)]
  console.log('Connected to terminal ' + term.pid)
  ws.send(logs[term.pid])

  const send = USE_BINARY ? bufferUtf8(ws, 5) : buffer(ws, 5);


  term.on('data', function (data) {
      try {
          send(data);
      } catch (ex) {
          // The WebSocket is not open, ignore
      }
  })

  ws.on('message', function (msg) {
      term.write(msg);
  })


  ws.on('close', function () {
      term.kill();
      console.log('Closed terminal ' + term.pid);
      // Clean things up
      delete terminals[term.pid];
      delete logs[term.pid];
  })

})

app.listen(TERMINAL_PORT);
console.log('App listening to http://127.0.0.1:' + TERMINAL_PORT);
console.log("wss linsting on " + TERMINAL_PORT)


// string message buffering
function buffer(socket, timeout) {
  let s = ''
  let sender = null
  return (data) => {
      s += data
      if (!sender) {
          sender = setTimeout(() => {
              socket.send(s)
              s = ''
              sender = null
          }, timeout)
      }
  }
}

// binary message buffering
function bufferUtf8(socket, timeout) {
  let buffer = []
  let sender = null
  let length = 0
  return (data) => {
      buffer.push(data)
      length += data.length
      if (!sender) {
          sender = setTimeout(() => {
              socket.send(Buffer.concat(buffer, length))
              buffer = []
              sender = null
              length = 0
          }, timeout)
      }
  }
}

// 监听端口

