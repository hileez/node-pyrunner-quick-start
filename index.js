// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const pycore = require('pycore')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
    
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// PyCore初始化
// 根据本机器的python3.10安装路径来配置环境
pycore.init({
    "python_version":"3.10",
    "python_home":"C:/Users/Admin/.pyenv/pyenv-win/versions/3.10.6",
    "program_name":"python",
    "base_prefix":"C:/Users/Admin/.pyenv/pyenv-win/versions/3.10.6",
    "base_exec_prefix":"C:/Users/Admin/.pyenv/pyenv-win/versions/3.10.6",
    "base_executable":"C:/Users/Admin/.pyenv/pyenv-win/versions/3.10.6/python.exe",
    "prefix":"pyscript/venv",
    "exec_prefix":"pyscript/venv",
    "executable":"pyscript/venv/Scripts/python.exe",
    "pythonpath_env":"pyscript/venv/Lib/site-packages",
    "module_search_paths":["./", "pyscript"],
    "encoding":"utf-8"
});

// Python调用的JS函数
// 必须是name = function(){}或者name = () => {}方式定义函数，否则无法在Python调用
sayHello = function (num1, num2) {
    let total = num1 + num2;
    console.log('Main SayHello total:' + total);
    return ++total;
}

// 执行Python语句
pycore.runScriptSync("print('main run pyscript')");
pycore.runScript("print('main run pyscript')");

// 创建Python模块对象
const pyApp = pycore.import('app');

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