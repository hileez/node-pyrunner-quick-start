// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// 引用node模块
const { contextBridge, ipcRenderer } = require('electron')
const pycore = require('pycore')



// 显示版本号
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron', 'pycore']) {
    if (type == 'pycore') {
      replaceText(`${type}-version`, pycore.version())
    } else {
      replaceText(`${type}-version`, process.versions[type])
    }
  }
})



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
// 必须在preload预加载中定义
// 必须是name = function(){}或者name = () => {}方式定义函数，否则无法在Python调用
sayHello = function (num1, num2) {
  let total = num1 + num2;
  console.log('Preload SayHello total:' + total);
  return ++total;
}

// 暴露PyCoreAPI在渲染进程，preload与渲染器共享window对象
contextBridge.exposeInMainWorld('pyCoreAPI', {
  import(pModule){
    return pycore.import(pModule);
  },
  runScriptSync: (pyScript) => {
    pycore.runScriptSync(pyScript);
  },
  runScript: (pyScript) => {
    pycore.runScript(pyScript);
  },
  release: () => {
    pycore.release();
  }
});
