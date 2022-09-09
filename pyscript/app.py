import sys
import pycore

def sum(num1, num2):
    return num1 + num2

def callBack(data):
    pycore.runScript("console.log('Python callBack data:" + str(data) + "');")
    return data # 该函数return返回值，在JS中为空的JS回调函数接收，将不会有任何操作

def callJS(num1, num2):
    state = pycore.callJS(target='sayHello', args=(num1, num2), callback=(__name__, 'callBack')) # 返回0表示失败，1为成功
    return num1 + num2