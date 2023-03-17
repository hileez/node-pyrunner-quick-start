// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron', 'pyrunner']) {
    if (type == 'pyrunner') {
      replaceText(`${type}-version`, pyrunner.version())
    } else {
      replaceText(`${type}-version`, process.versions[type])
    }
  }
})


/////////////////////////////////////////////////////////
// node-pyrunner
/////////////////////////////////////////////////////////

const pyrunner = require('node-pyrunner')

/* init node-pyrunner */
pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
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

// exports func to renderer
contextBridge.exposeInMainWorld('NodePyRunner', {
  loadModule(pModule){
    return pyrunner.loadModule(pModule);
  },
  runScriptSync: (pyScript) => {
    pyrunner.runScriptSync(pyScript);
  },
  runScript: (pyScript) => {
    pyrunner.runScript(pyScript);
  },
  release: () => {
    pyrunner.release();
  },
  version: () => {
    return pyrunner.version();
  },
});
