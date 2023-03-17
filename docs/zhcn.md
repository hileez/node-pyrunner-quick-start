# Node-PyRunner

Node-PyRunner模块用于nodejs与python交互，在nodejs中用node-pyrunner同步或者异步执行python脚本和调用python函数，在异步调用时允许python执行js脚本或调用js函数。

使用node-pyrunner可以用简单的python语言扩展nodejs的功能，而不需要用高难度的C/C++；另外得益于libuv线程池的使用，node-pyrunner异步多线程使用起来非常容易，还可以在python中创建子线程并随时与nodejs交互；繁重的任务可以交给python多进程来处理，但目前只能在windows使用。

electron集成了nodejs运行时，您可以在electron中使用node-pyrunner执行任务，这样就实现了python的webGUI界面，python中可以执行JS脚本来操作DOM元素。node-pyrunner是将cpython解释器嵌入到nodejs的c++addon模块中，nodejs和python属于底层交互并非网络通信或者进程通信，这样程序性能比较好可靠性比较高。



## 跨平台

Node-PyRunner目前支持主流的操作系统和芯片架构

- windows:i32/x64
- linux:x64/arm64
- macos:x64



## 安装&引用

~~~bash
# 命令安装包
npm install node-pyrunner
~~~

~~~javascript
// JS中引用，返回pyrunner对象
const pyrunner = require('node-pyrunner');
~~~



## Node-PyRunner对象

#### config

这是node-pyrunner初始化JSON配置信息，用于配置python安装目录、脚本目录、模块搜索目录等路径，config根据操作系统和芯片结构预设了配置信息，比如默认python安装在当前项目的python目录，脚本文件放置在pyscript目录，如果修改默认的路径配置，其中config['python_home']是必要的的配置项目，用于node-pyrunner使用python的标准模块。

~~~javascript
const pyrunner = require('node-pyrunner');

// 设置python安装路径，目的是使用python的标准模块，默认为./python/win32/x64/3.10.10
pyrunner.config['python_home'] = './python/win32/x64/3.10.10';

// 添加模块搜索路径，默认为./pyscript如果脚本不在此处，那么应该添加相应的路径，否则无法加载模块
pyrunner.config['module_search_paths'][0] = './pyscript';
pyrunner.config['module_search_paths'].push('./mypython');
~~~

**配置项目：**

- python_version：python版本，默认为3.10.10不需要修改
- python_home：python安装目录，默认在./python目录下对应平台架构的python（比如./python/win32/x64/3.10.10）
- program_name：可执行程序名，默认windows为python，其他平台为python3
- base_prefix：python安装目录
- base_exec_prefix：python安装目录
- base_executable：python主程序路径，默认在./python目录下，windows为python.exe,其他平台为bin/python
- prefix：虚拟环境目录，不使用虚拟环境时设置为base_prefix相同路径
- exec_prefix：虚拟环境目录，不使用虚拟环境时设置为base_exec_prefix相同路径
- executable：虚拟环境目录python主程序路径，不使用虚拟环境时设置为base_executable相同路径
- pythonpath_env：虚拟环境模块目录
- module_search_paths：搜索模块的路径，这是一个数组，通过索引添加修改数组中的路径。默认包含AppHome、[AppHome]/pyscript，
- encoding：解释器编码，一般默认utf-8即可



#### init()

用于初始化node-pyrunner解释器

~~~javascript
pyrunner.init();
~~~



#### release()

用于释放node-pyrunner解释器

~~~JavaScript
pyrunner.release();
~~~



#### runScriptSync()

同步执行python语句，把要执行的python语句作为字符串参数传递，返回空值。

~~~JavaScript
pyrunner.runScriptSync(`print('main runSync pyscript.')`);
~~~



#### runScript()

异步执行python语句，把要执行的python语句作为字符串参数传递，返回空值。如果需要在执行完成后进行某些操作，则需要把回调函数作为传递第2个参数传递。

~~~JavaScript
pyrunner.runScript(`print('main run pyscript.')`, (data) => {
    console.log('async run pyscript finish.');
})
~~~



#### loadModule()

加载python模块对象，使用模块对象的**callSync / call**调用模块中的方法。

~~~JavaScript
const pyrunner = require('node-pyrunner');

// 创建模块对象
let appModule = pyrunner.loadModule('app');

// 同步调用python的hello函数
let value = appModule.callSync('hello', ['node-pyrunner']);

// 异步调用python的show函数
appModule.call('show', [1, 2],
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
~~~



## Python nodepyrunner交互模块

Node-PyRunner为解释器创建了内置的pyrunner模块，用于在python脚本中与JavaScript交互，有runScript/callJs两个方法，需要在脚本中import pyrunner导入使用。要注意的是JavaScript同步执行python脚本时不能使用pyrunner模块，这个与JavaScript的单线程执行机制有关。



#### runScript()

把要执行的JS脚本作为字符串传递，成功返回true，失败返回false。

~~~python
import nodepyrunner
nodepyrunner.runScript(f"console.log('Python callBacksuper');")
~~~



#### callJs()

用于在python中异步调用js函数，传递target目标函数名，args传递参数值，callback为回调函数，当callback缺省时为不需要回调。调用成功返回true，失败返回false。

~~~python
import nodepyrunner
nodepyrunner.callJs(target='sayHi', args=['aa', 1], callback=['moduleName', 'call_back'])
~~~



## Python threading多线程模块

Node-PyRunner的异步任务是用的libuv线程池，但是python脚本中也可以自行创建线程执行任务。异步调用python或者在python子线程中执行任务，因为不阻塞JavaScript主线程，所以您可以随意使用nodepyrunner模块与JavaScript交互。

**app.py**

~~~python
import sys
import time
import nodepyrunner
import threading

''' 多线程BEGIN '''
def callBack(data):
    print('callback python.')

def th_func(name, delay):
    nodepyrunner.runScript(f"console.log('subthread run js:{name}');")
    state = nodepyrunner.callJs(target='sayHello', args=[1, delay], callback=[__name__, 'callBack']) # 返回0表示失败，1为成功
    for i in range(5):
        time.sleep(delay)
        print(f'{name}-{i}-{time.ctime(time.time())}')

def th_create(name, num):
    for i in range(num):
        t = threading.Thread(target=th_func, args=(f"{name}-thread-{i}", i))
        t.start()
        # t.join()
    print('create thread finish.')
''' 多线程END '''
~~~

**index.js**

~~~javascript
const pyrunner = require('node-pyrunner');
pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
pyrunner.config['module_search_paths'].push('./pyscript');
pyrunner.init();

// Python调用的JS函数
sayHello = function (num1, num2) {
  let total = num1 + num2;
  console.log('Main SayHello total:' + total);
  return ++total;
}

let appModule = pyrunner.loadModule('app');
// 同步执行
appModule.callSync('th_create', ['hi', 3]);
// 或者异步执行
appModule.call('th_create', ['hi', 100]);
~~~



## Python multiprocessing 多进程模块

Node-PyRunner是将cpython解释器嵌入到nodejs的c++addon模块中，所以对multiprocessing模块有一定影响，在windows操作系统需要在创建多进程任务前set_executable配置标准解释的路径，而linux和macos则不能使用multiprocessing模块。

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

''' 多进程BEGIN '''
def pro_create(name, num):
    pub_queue = Queue()
    import sub
    for i in range(num):
        p = Process(target=sub.pro_func, args=(pub_queue, f'{name}-{i}',))
        p.start()
        p.join()
    # print(pub_queue.get())
    print('create child process finish.')
    return 0
''' 多进程END '''
~~~

**sub.py**

~~~python
# 子进程不可以访问nodepyrunner模块，因此无法与JS交互
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

let appModule = pyrunner.loadModule('app');
// 同步执行
appModule.callSync('pro_create', ['subprocess', 3]);
// 或者异步执行
appModule.call('pro_create', ['subprocess', 3]);
~~~



## DOM操作

Electron集成了nodejs环境，因此可以在electron中使用node-pyrunner，并且nodejs与electron共享window对象所以node-pyrunner可以通过执行JavaScript来操作DOM元素。



## node-pyrunner-quick-start

基于electron-quick-start来快速创建node-pyrunner应用

https://github.com/supercoderlee/node-pyrunner-quick-start



## 案例

**index.js**

~~~JavaScript
const pyrunner = require('node-pyrunner')
// 配置初始化信息
// python_home 默认: [AppHome]/python/win32/x64/3.10.10
// win32/x64 自动根据平台和架构改变
pyrunner.config['python_home'] = './deps/python/win32/x64/3.10.10';
pyrunner.config['module_search_paths'][0] = './pyscript'; //默认: [AppHome]/pyscript
pyrunner.config['module_search_paths'].push('./myscript');
pyrunner.init(); // 初始化

// 执行python脚本
pyrunner.runScriptSync("print('main runSync pyscript')");
pyrunner.runScript("print('main run pyscript')");

// 调用python函数
let appModule = pyrunner.loadModule('apptest');

// 同步调用python的hello函数
appModule.callSync('hello', ['pyrunner']);

// 异步调用python的callJsFunc函数
appModule.call('callJsFunc', [1, 2],
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

// python调用的JS函数，必须是函数名=函数体，表示该函数在global对象之下，否则python无法调用
sayHello = function (num1, num2) {
    let total = num1 + num2;
    return ++total;
}
~~~

**app.py**

~~~python
import pyrunner

def hello(str):
    print(f'hello:{str}')

def callBack(data):
    pyrunner.runScript("console.log('Python callBack data:" + str(data) + "');")
    return 1 # 回调的Py函数返回值在JS中为空的JS函数，即此返回值将不会有任何操作

def callJsFunc(num1, num2):
    state = pyrunner.callJs(target='sayHello', args=[num1, num2], callback=[__name__, 'callBack']) # 返回0失败，1成功
~~~

