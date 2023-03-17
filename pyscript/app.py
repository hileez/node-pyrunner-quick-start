import nodepyrunner

def sum(num1, num2):
    return num1 + num2

def callback(data):
    nodepyrunner.runScript("console.log('Python callBack data:" + str(data) + "');")

def call_js(num1, num2):
    nodepyrunner.callJs(target='sayHello', args=[num1, num2], callback=[__name__, 'callback']) # 返回0表示失败，1为成功
    return num1 + num2

def change_dom():
    nodepyrunner.runScript("document.getElementsByTagName('h1')[0].innerHTML = 'Hello Node-PyRunner';")