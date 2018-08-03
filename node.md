# node 
浏览器 反向代理 服务器 缓存 db数据库
release发布机

top命令 cpu负载情况
302服务器重定向
502服务器禁止
304缓存

## http协议
### request
* 请求头
方法 url http协议版本
各字段
cookie
content-type 后面有二进制分隔符
* 请求体/数据体
文本格式 直接用&传输
二进制格式 会有分隔符
数据开头结尾是二进制分隔符
结束分隔符后面还有-- 
### response
返回头
set-cookie
协议 状态码
数据体

### node搭建一个简单的服务器发送http请求
``````javascript
var http = require('http')
function hello(req,res){
    res.writeHead(200,{'content-type':'text/plain'});
    res.write('hello')
    res.end()
}
http.createServer(hello).listen(12306,'172.20.150.173')

console.log(1)
``````

### cache control
可否缓存
public 可以被任何中间层缓存 包括服务器 代理等
private 只能被一个缓存 优先服务器
no-cache 不要相信缓存 使用缓存前 向服务器验证一下
only-if-cached 只要有缓存就不要请求服务器
到期时间
max-age 缓存的最大周期 单位秒
max-state 客户端愿意接受一个过期的缓存 但是响应不能超过设置的时间
min-fresh 客户端在指定时间内获得响应
重新验证加载
must-revalidate 使用之前验证资源状态 资源过期不能使用
prox-revalidate 作用同上，适用于共享缓存（代理服务器）

no-store 不使用缓存
no-transform 不许对缓存资源进行转换转码

## node的开发环境
### nvm node版本管理器
切换到 v6.9.5，命令：nvm use v6.9.5
查看安装效果，命令：nvm use node
nvm list 查看本机安装的node
### 模块化
common js规范
一个文件是一个模块
每个模块内变量函数对象的作用域都属于这个模块本身 其他模块无法访问
模块之间的互相引用require
exports/module.exports把对象暴露出来
#### exports和module.exports
栈内存 基本类型 变量名-值
b=a 只拷贝值
堆内存 引用类型 变量名-值 值存的是地址 地址用指针指向这一个空间
b=a 就是让b的指针也指向这个地址
```javascript
var a = {name: 1};
var b = a;

console.log(a);
console.log(b);

b.name = 2;
console.log(a);
console.log(b);

var b = {name: 3};
console.log(a);
console.log(b);

运行 test.js 结果为：

{ name: 1 }
{ name: 1 }
{ name: 2 }
{ name: 2 }
{ name: 2 }
{ name: 3 }
```
module.exports 初始值为一个空对象 {}
exports 是指向的 module.exports 的引用
require() 返回的是 module.exports 而不是 exports

`exports = module.exports = somethings`
上面的代码等价于:

`module.exports = somethings
exports = module.exports`
原理很简单，即 module.exports 指向新的对象时，exports 断开了与 module.exports 的引用，那么通过 exports = module.exports 让 exports 重新指向 module.exports 即可。

`exports = function(){};`
// 这样就是重新给 exports 赋值，它将不再是 module.exports 的引用，二者将无任何联系。

### restful api
表述性状态转移
URL定位资源，用HTTP动词（GET,POST,DELETE,put）描述操作。
RESTful 符合REST约束条件和原则的网络接口
统一接口原则

POST和PUT在创建资源的区别在于，所创建的资源的名称(URI)是否由客户端决定。
统一资源接口要求使用标准的HTTP方法对资源进行操作，所以URI只应该来表示资源的名称，而不应该包括资源的操作。
* 可寻址性（Addressability）
  REST 中的所有东西都基于资源 的概念。资源与 OOP 中的对象或其他名词不同，它是一种抽象，必须可以通过 URI 寻址或访问。
* 接口一致性（Interface uniformity）
  REST要求用来操纵资源的方法或动词不是任意的。这意味着RESTful服务的开发人员只能使用HTTP支持的方法，比如GET、PUT、POST、DELETE等等。因此不需要使用WSDL等服务描述语言
  **如果按照HTTP方法的语义来暴露资源，那么接口将会拥有安全性和幂等性的特性，例如GET和HEAD请求都是安全的， 无论请求多少次，都不会改变服务器状态。而GET、HEAD、PUT和DELETE请求都是幂等的，无论对资源操作多少次， 结果总是一样的，后面的请求并不会产生比第一次更多的影响**
* 无状态（Statelessness
  为了增强可伸缩性，服务器端不存储客户机的状态信息。这使服务器不与特定的客户机相绑定，负载平衡变得简单多了。这还让服务器更容易监视、更可靠
* 具象（Representational）
  客户机总是与资源的某种具象交互，绝不会直接与资源本身交互。同一资源还可以有多个具象。理论上说，持有资源的具象的任何客户机应该有操纵底层资源的足够信息。
* 连通性（Connectedness）
  任何基于REST的系统都应该预见到客户机需要访问相关的资源，应该在返回的资源具象中包含这些资源。例如，可以以超链接的形式包含特定RESTful服务的操作序列中的相关步骤，让客户机可以根据需要访问它们。
### node模块
同步 阻塞
异步 非阻塞
**在 Node 应用程序中，执行异步操作的函数将回调函数作为最后一个参数， 回调函数接收错误对象作为第一个参数。**
* fs
同步读取 返回BUFFER tostring转换成字符串
`var text = fs.readFileSync(fileName, 'utf8');`
异步读取  
`fs.readFile('./image.png', function (err, buffer) {
  if (err) throw err;
  process(buffer);
});`
* 事件
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
// 绑定事件及事件的处理程序
eventEmitter.on('eventName', eventHandler);
// 触发事件
eventEmitter.emit('eventName');
//为指定事件添加一个监听器到监听器数组的尾部。
addListener(event, listener)
//返回指定事件的监听器数组。
listeners(event)
//返回指定事件的监听器数量。
listenerCount(emitter, event)

### buffer
在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。
Buffer.from() 接口去创建Buffer对象。
