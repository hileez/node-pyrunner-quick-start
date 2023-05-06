# node-pyrunner-quick-start

Language: [Chiness](https://github.com/supercoderlee/node-pyrunner-quick-start/blob/main/docs/readme/zh-cn.md) | English



**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start) within the Electron documentation.

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `index.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.
- `preload.js` - A content script that runs before the renderer process loads.
- `renderer.js` - A content script to render. 
- `python3.dll` - A Dynamic link library to node-pyrunner. 
- `python310.dll` - A Dynamic link library to node-pyrunner. 
- `pyscript` - Python script directory. 
- `python` - Python home directory. 

You can learn more about each of these components in depth within the [Tutorial](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites). Read the usage [DOC](https://github.com/supercoderlee/node-pyrunner) for node-pyrunner.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/supercoderlee/node-pyrunner-quick-start.git
# Go into the repository
cd node-pyrunner-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [Electron Fiddle](https://electronjs.org/fiddle) - Electron Fiddle, an app to test small Electron experiments
- [node-pyrunner/docs](https://github.com/supercoderlee/node-pyrunner/tree/main/docs) - all of Node-PyRunner's documentation
