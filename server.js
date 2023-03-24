
// 调包
const express = require('express');
const os = require("os");
const pty = require("./node-pty");
 
// 定义变量 实例化
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const term = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env,
  });

const app = express()

app.all('/terminal', (Request, Response)=>{
    Response.setHeader('Access-Control-Allow-Origin', '*');
    Response.setHeader('Access-Control-Allow-Headers', '*');
    Response.setHeader('Access-Control-Request-Headers',"");
    Response.setHeader('Access-Control-Request-Method','*');
    // const data = Request.data;
    // console.log(Request.query.input_str)

    term.write(Request.query.input_str)

    let res = "res:";
    let count = 0;
    term.onData((response_data) => {
      term.pause();
      // console.log(typeof(response_data))
      // console.log()

      // if(response_data == undefined){
      //   console.log("undefined");
      // }
      // else{
      //   console.log("defined");
      // }
      count++
      console.log(count);
      
      res += response_data;
      term.resume();
      // console.log(res);
      // console.log(response_data);
    //   // process.stdout
    //   // console.log(process.stdout)
    //   // process.stdout.write(data1);
    //   // process.stdout.write(data);
    });

    //console.log("res_out:"+res);
    Response.send(res);
    // res = "";


    //term.resize(100, 40);

    // term.on("data", function(data) {
    //   console.log(data);
    //   Response.send(data);
    // });

    // Response.send(JSON.stringify(data));
})
app.listen(8086, ()=>{
    console.log('8086 running node-pty')
})


// const express = require("express");
// const expressWs = require("express-ws");

// const app = express();
// expressWs(app);

// const pty = require("./node-pty");
// const os = require("os");
// const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
// const term = pty.spawn(shell, ["--login"], {
//   name: "xterm-color",
//   cols: 80,
//   rows: 24,
//   cwd: process.env.HOME,
//   env: process.env,
// });
// app.ws("/socket", (ws, req) => {
//   term.on("data", function (data) {
//     ws.send(data);
//   });
//   ws.on("message", (data) => {
//     term.write(data);
//   });
//   ws.on("close", function () {
//     term.kill();
//   });
// });
