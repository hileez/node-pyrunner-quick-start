# node-pyrunner-quick-start

Language: 简体中文 | [English](https://github.com/supercoderlee/node-pyrunner-quick-start/blob/main/docs/readme/en.md)



**克隆和快速创建运行一个Electron应用。**

这是一个基于Electron创建并使用node-pyrunner使用python程序的最小应用 [Electron快速入门指南](https://electronjs.org/docs/latest/tutorial/quick-start)

Electron应用只需要这些文件:

- `package.json` - 指向应用程序的主文件，并列出其详细信息和依赖项。
- `index.js` - 启动应用程序并创建一个浏览器窗口来呈现HTML。这是应用程序的**主进程**。
- `index.html` - 窗体要渲染的网页。这是应用程序的渲染进程。
- `preload.js` - 渲染进程预加载文件。
- `renderer.js` - 渲染器的JS脚本。
- `python3.dll` - Node-PyRunner需要的python3.10动态链接库。 
- `python310.dll` - Node-PyRunner需要的python3.10动态链接库。 
- `pyscript` - Python脚本目录。
- `python` - Python安装目录。

您可以通过[Electron教程](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites)学习更多使用技巧，Node-PyRunner使用请阅读[文档](https://github.com/supercoderlee/node-pyrunner)。

## 使用

你需要[Git](https://git-scm.com)工具和[Node.js](https://nodejs.org/en/download/) (包含[npm](http://npmjs.com))克隆到本地才能运行，执行以下命令:

```bash
# 克隆仓库
git clone https://github.com/supercoderlee/node-pyrunner-quick-start.git
# 进入目录
cd node-pyrunner-quick-start
# 安装依赖
npm install
# 运行应用
npm start
```

注意：如果你在Windows运行Linux Bash [请看手册](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) 或者在命令行中使用node命令。

## 学习资料

- [electronjs.org/docs](https://electronjs.org/docs) - Electron所有文档
- [Electron Fiddle](https://electronjs.org/fiddle) - 测试Electron的实验。
- [node-pyrunner/docs](https://github.com/supercoderlee/node-pyrunner/tree/main/docs) - Node-PyRunner文档
