# pycore-quick-start

pycore-quick-start是快速创建electron+pycore的最小应用程序，PyCore是为NodeJs开发的模块，通过PyCore您可以轻松实现JavaScript与Python的交互，充分利用libuv线程池以及异步特性提高开发和执行的效率。PyCore以Nodejs依赖包发布于npmjs平台（[https://www.npmjs.com/package/pycore](https://www.npmjs.com/package/pycore)），项目中使用npm包管理器安装即可。



## 文件说明

- `package.json` - 应用配置信息，npm依赖包信息等。
- `index.js` - 应用执行的入口文件，在主进程执行。
- `index.html` - 显示界面执行在渲染进程。
- `preload.js` - electron预加载文件，可在里面加载node插件暴露给渲染进程使用。
- `renderer.js` - 渲染进程执行的JavaScript。



## 使用方法

使用git克隆或者直接下载到本地，在项目目录（electron-quick-start）下执行npm安装包和启动应用。

```bash
# 克隆仓库
git clone https://github.com/supercoderlee/pycore-quick-start
# 进入仓库
cd electron-quick-start
# 安装npm包
npm install
# 启动应用（启动前须配置初始化信息）
npm start
```



## 初始化

项目启动前要保证python环境配置正确，配置中添加python的环境路径，虚拟环境路径以及项目python脚本目录等路径到PyCore中。

~~~JavaScript
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
~~~

**配置说明**

| 字段                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| python_version      | Python使用的版本                                             |
| python_home         | Python安装目录                                               |
| program_name        | python主程序名，windows是python，linux和macos系统python为2.7版本，python3为3.X版本 |
| base_prefix         | Python安装目录                                               |
| base_exec_prefix    | Python安装目录                                               |
| base_executable     | python主程序绝对路径                                         |
| prefix              | 虚拟环境目录，当不使用虚拟环境则设置为base_prefix            |
| exec_prefix         | 虚拟环境目录，当不使用虚拟环境则设置为base_exec_prefix       |
| executable          | 虚拟环境目录python主程序绝对路径，当不使用虚拟环境则设置为base_executable |
| pythonpath_env      | 虚拟环境模块目录                                             |
| module_search_paths | 搜索模块的路径                                               |
| encoding            | 解释器编码，一般默认utf-8即可                                |



## 依赖动态库

本项目依赖本地的Python3.10环境，如果没有环境windows和macos可安装官方的包，linux使用apt包管理器安装，命令行能够执行python命令并且版本是3.10表示安装成功。

**每个平台动态链接库名称和路径不一样，参考如下：**

- `windows` - 必须`python3.dll`和`python310.dll`动态库，存在于python3.10安装目录。
- `linux` - 必须`libpython3.10.so.1.0`动态库，存在于`/usr/lib/python3.10/config-3.10-x86_64-linux-gnu`目录。
- `macos` - 必须`libpython3.10.dylib`动态库，存在于`/Library/Frameworks/Python.framework/Versions/3.10/lib`目录。

以上安装方式一般情况可以在bash终端或者cmd执行，这时候pycore可以正常加载以上的动态链接库，当加载出现错误时**可以考虑将动态链接库拷贝到项目目录**。另外，您也可以使用pyenv来安装和管理多个Python版本，用pyenv安装的python在其下的目录中，使用时可以将动态链接库拷贝到pycore-quick-start项目目录，初始化时指定具体的python3.10路径即可。
