// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// 执行Python语句
pyCoreAPI.runScriptSync("print('renderer run pyscript')");
pyCoreAPI.runScript("print('renderer run pyscript')");

// 创建Python模块对象
const pyApp = pyCoreAPI.import('app');

// 同步调用Python函数
let res = pyApp.callSync('sum', [1, 9]);
console.log(res);

// 异步调用Python函数
pyApp.call('callJS', [2, 6],
    function (data) {
        console.log(data);
    },
    function (error) {
        console.log(error);
    }
);
