// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
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




/////////////////////////////////////////////////////////
// node-pyrunner
/////////////////////////////////////////////////////////

const pyrunner = require('node-pyrunner')

/* init node-pyrunner */
// pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
pyrunner.config['module_search_paths'].push('./pyscript');
pyrunner.init();

/* js func for python call */
// create func in global object.
// funcname = function(){} or funcname = () => {}
sayHello = function (num1, num2) {
  let total = num1 + num2;
  console.log('Main SayHello total:' + total);
  return ++total;
}

/* run python script */
pyrunner.runScriptSync("print('main runSync pyscript')");
pyrunner.runScript("print('main run pyscript')");

let appModule = pyrunner.loadModule('app');

// sync call python funtion
let total = appModule.callSync('sum', [1, 2]);
console.log(`sync total:${total}`);

// async call python funtion
appModule.call('sum', [2, 3], (data)=>{
  console.log(`async total:${data}`);
}, (error)=>{
  console.log(error);
});

// python call js function
appModule.call('call_js', [5, 6], (data)=>{
  console.log(`callJS result:${data}`);
}, (error)=>{
  console.log(error);
});
