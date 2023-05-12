# Node-PyRunner

Language: [Chinese](https://github.com/supercoderlee/node-pyrunner/blob/main/docs/zh-cn.md) | English



The node-pyrunner module is used for nodejs to interact with python. Using node-pyrunner you can execute python scripts and call python functions synchronously or asynchronously in nodejs, and allows python to execute js scripts or call js functions when called asynchronously.

Using node-pyrunner can extend the functionality of nodejs with python. Node-PyRunner execute tasks on async thread very easy, because  node-pyrunner is using libuv. You can also create child threads in Python and interact with NodeJS at any time. Tasks can be handled by Python multi-process, but only available in Windows.

Electron integrates with the nodejs runtime, You can use Node-pyrunner in Electron to perform tasks and make it Python's web GUI, python executed javascript  to change DOM.

Node-PyRunner is embed Cpython  to NodeJS with C++ Addon, not a web server or child process. So the performance is best.



## Cross-platform

- windows:ia32/x64
- linux:x64/arm64
- macos:x64



## Install & Require

~~~bash
# install
npm install node-pyrunner
~~~

~~~javascript
// require packages return object
const pyrunner = require('node-pyrunner');
~~~



##  Node-PyRunner Obeject

#### config

This is node-pyrunner initialization JSON configuration information, used to configure python home directory, script directory, module search directory and other paths, config preset config items according to the system and architecture, default python home directory is ./python in current project and ./pyscript is python script directory, but you can change config used other directory

~~~javascript
const pyrunner = require('node-pyrunner');

// set python home directory, default:./python/win32/x64/3.10.10
pyrunner.config['python_home'] = './python/win32/x64/3.10.10';

// pyscript directory, default:AppHome,[AppHome]/pyscript.
pyrunner.config['module_search_paths'][0] = './pyscript';
pyrunner.config['module_search_paths'].push('./mypython');
~~~

**config items：**

- python_version: default 3.10.10 don't change
- python_home: python home directory，default: [AppHome]/python/win32/x64/3.10.10, win32/x64 from platform and arch.
- program_name: default windows:python, linux/macos:python3
- base_prefix: python home directory
- base_exec_prefix: python home directory
- base_executable: python executable path，default windows:python.exe, linux/macos:bin/python
- prefix: venv directory, if don't use venv set python home directory.
- exec_prefix: virtualenv directory, if don't use virtualenv set python_home directory.
- executable: virtualenv executable path, if don't use virtualenv set python_home executable path.
- pythonpath_env: virtualenv module directory
- module_search_paths: is array.default:AppHome,[AppHome]/pyscript.
- encoding: default utf-8



#### init()

initialization node-pyrunner

~~~javascript
pyrunner.init();
~~~



#### release()

release node-pyrunner

~~~JavaScript
pyrunner.release();
~~~



#### runScriptSync()

sync run python script, and return undefined.

~~~JavaScript
pyrunner.runScriptSync(pyScript: string);
~~~

- pyScript: python script.
- return undefined.

~~~JavaScript
// example
pyrunner.runScriptSync(`print('main runSync pyscript.')`);
~~~



#### runScript()

async run python script, and return undefined. param0 is pyscript, param1 is callback on finish, param2 is callback on error.

~~~JavaScript
pyrunner.runScript(pyScript: string, callbackOnOk: object, callbackOnError: object);
~~~

- pyScript: python script
- callbackOnOk: callback function on ok.
- callbackOnError: callback function on error.
- return undefined.

~~~JavaScript
// example
pyrunner.runScript(`print('main run pyscript.')`, (data) => {
    console.log('async run pyscript finish.');
})
~~~



#### import()

Get python module object，has **callSync() / call()** methods.

~~~JavaScript
let appModule = pyrunner.import(moduleName: string);
~~~

- moduleName: python module name.
- appModule: return module object.

**callSync() / call()**

~~~JavaScript
// sync call import() object function
let result = appModule.callSync(functionName: string, args: Array<number | string>);

// async call import() object function, return undefined.
appModule.call(functionName: string, args: args: Array<number | string>, callbackOnOk: object, callbackOnError: object);
~~~

- functionName: call python function
- args[]: call python param array
- callbackOnOk: callback function on ok.
- callbackOnError: callback function on error.

~~~JavaScript
// example
const pyrunner = require('node-pyrunner');

// get python module object
let appModule = pyrunner.import('app');

// sync call python function
let result = appModule.callSync('hello', ['node-pyrunner']);

// async call python function
appModule.call('show', [1, 2],
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
~~~



## Python nodepyrunner module

Node-PyRunner creates a nodepyrunner module embedded in python for interacting with JavaScript in python scripts, has runScript/callJs methods. You need import nodepyrunner in python script.Note you cannot used runScript or callJs methods when sync executions.



#### runScript()

async run JavaScript, return true or false.

~~~python
nodepyrunner.runScript(JsScript);
~~~

- JsScript: javascript script string.
- return true/false.

~~~python
# example
import nodepyrunner
nodepyrunner.runScript(f"console.log('Python callBacksuper');")
~~~



#### callJs()

async call JavaScript function, return true or false. target is function name, args is js function params, callback is callback python function after call js.

~~~python
nodepyrunner.callJs(target, args[], callback=[module, py_func_name])
~~~

- target: call javascript function name.
- args[]: call javascript function param array.
- callback=[module, py_func_name]: callback python，module: python module name，py_func_name: python function name.
- return true/false.

~~~python
# example
import nodepyrunner
nodepyrunner.callJs(target='sayHi', args=['aa', 1], callback=['moduleName', 'call_back'])
~~~



## Python threading module

Node-PyRunner uses libuv to run async tasks. and you can create child threads in Python too, python childthreads can interact with NodeJS at any time. 

**app.py**

~~~python
import time
import nodepyrunner
import threading

def callBack(data):
    print('callback python.')

def th_func(name, delay):
    nodepyrunner.runScript(f"console.log('subthread run js:{name}');")
    state = nodepyrunner.callJs(target='sayHello', args=[1, delay], callback=[__name__, 'callBack']) # return False:error, True:succeed
    for i in range(5):
        time.sleep(delay)
        print(f'{name}-{i}-{time.ctime(time.time())}')

def th_create(name, num):
    for i in range(num):
        t = threading.Thread(target=th_func, args=(f"{name}-thread-{i}", i))
        t.start()
        # t.join()
    print('create thread finish.')
~~~

**index.js**

~~~javascript
const pyrunner = require('node-pyrunner');
pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
pyrunner.config['module_search_paths'].push('./pyscript');
pyrunner.init();

// Python call Js func
sayHello = function (num1, num2) {
  let total = num1 + num2;
  console.log('Main SayHello total:' + total);
  return ++total;
}

let appModule = pyrunner.import('app');
// sync
appModule.callSync('th_create', ['hi', 3]);
// async
appModule.call('th_create', ['hi', 100]);
~~~



## Python multiprocessing module

Node-PyRunner is embed Cpython  to NodeJS with C++ Addon, so linux and macos can't use the multiprocessing module, In Windows, set_executable python path before creating multiprocessing tasks.

**app.py**

~~~python
import sys
import nodepyrunner

# Linux/macos multiprocessing error
if sys.platform == 'win32':
    from multiprocessing import Process
    from multiprocessing import Queue
    from multiprocessing import set_executable
    set_executable('./python/win32/x64/3.10.10/python.exe')

def pro_create(name, num):
    pub_queue = Queue()
    import sub
    for i in range(num):
        p = Process(target=sub.pro_func, args=(pub_queue, f'{name}-{i}',))
        p.start()
        p.join()
    # print(pub_queue.get())
    print('create child process finish.')
~~~

**sub.py**

~~~python
# subprocess run function
# subprocess cannot use nodepyrunner module
def pro_func(q, name):
    q.put(['hello', name])
    print(q.get())
~~~

**index.js**

~~~javascript
const pyrunner = require('node-pyrunner');
pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
pyrunner.config['module_search_paths'].push('./pyscript');
pyrunner.init();

let appModule = pyrunner.import('app');
// sync
appModule.callSync('pro_create', ['subprocess', 3]);
// async
appModule.call('pro_create', ['subprocess', 3]);
~~~



## DOM

Electron integrates nodejs environment, so node-pyrunner can be used in the electron, and nodejs shares window object with the electron, node-pyrunner can change DOM by run JavaScript.



## Dynamic link library

**windows**

'python3.dll' and 'python310.dll' are required from python3.10 home directory. Nodejs app please copy to project directory,electron app copy to executable directory.

**linux**

'libpython3.10.so.1.0' are required, you can use pyenv install python3.10. 'libpython3.10.so.1.0' in `~/.pyenv/versions/3.10.x/lib`. Nodejs app please copy to project directory,electron app copy to executable directory.

**macos** 

'libpython3.10.dylib' are required, Install python3.10, 'libpython3.10.dylib' in `/Library/Frameworks/Python.framework/Versions/3.10/lib`. You can use pyenv install python3.10 too. Nodejs app please copy to project directory,electron app copy to executable directory.



## node-pyrunner-quick-start

Quickly create a node-pyrunner application based on electron-quick-start

https://github.com/supercoderlee/node-pyrunner-quick-start



## Example

**index.js**

~~~JavaScript
const pyrunner = require('node-pyrunner')
// set node-pyrunner config
// python_home default: [AppHome]/python/win32/x64/3.10.10
// win32/x64 auto platform and arch
pyrunner.config['python_home'] = './python/win32/x64/3.10.10';
pyrunner.config['module_search_paths'][0] = './pyscript'; //default: [AppHome]/pyscript
pyrunner.config['module_search_paths'].push('./myscript');
pyrunner.init();

// run python script
pyrunner.runScriptSync("print('main runSync pyscript')");
pyrunner.runScript("print('main run pyscript')");

// call python function
let appModule = pyrunner.import('app');

// sync
let result = appModule.callSync('hello', ['pyrunner']);

// async
appModule.call('callJsFunc', [1, 2],
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

// python call js func
// It must be inside global object
sayHello = function (num1, num2) {
    let total = num1 + num2;
    return ++total;
}
~~~

**app.py**

~~~python
import nodepyrunner

def hello(str):
    print(f'hello:{str}')

def callBack(data):
    nodepyrunner.runScript("console.log('Python callBack data:" + str(data) + "');")
    return 1

def callJsFunc(num1, num2):
    state = nodepyrunner.callJs(target='sayHello', args=[num1, num2], callback=[__name__, 'callBack']) # return False:error, True:succeed
~~~

