// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// get node-pyrunner version.
console.log(NodePyRunner.version());

// sync run python script.
NodePyRunner.runScriptSync("print('renderer run pyscript')");

// async run python script.
NodePyRunner.runScript("print('renderer run pyscript')");

// create python module object.
const pyApp = NodePyRunner.loadModule('app');

// sync call python function
let res = pyApp.callSync('sum', [1, 9]);
console.log(res);

// async call python function
pyApp.call('call_js', [2, 6],
    function (data) {
        console.log(data);
    },
    function (error) {
        console.log(error);
    }
);

// async call python function
pyApp.call('change_dom', []);