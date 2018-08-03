# react
PWA progressive web application渐进式Web应用程序
利用网页写app
registerServerWorker 网页上线到支持http协议的服务器上，第一次访问缓存在浏览器里，用户断网也能看到上一次的网页内容，实现pwa效果。
manifest实现pwa效果，把网页当作一个app可以离线访问，里面是app的标题图标的数据信息
app.test自动化测试文件
`ReactDOM.render(<App />, document.getElementById('root'));`
//组件挂在到节点上

自己的组件必须大写字母开头 引入自己的组件<App />
render返回的内容必须整体包含在一个div中
不想用div可以引入fragment占位符 用<Fragment>
  
constructor(props){
  super(props)
  this.state={
    数据
  }
  }
  
list:[...this.state.list,this.state.inputValue],
先把list数组拆开 相当于push inputvalue进去list数组

immutable 不可以直接修改state
  可以先拷贝一个state的副本在上面修改
  
dangerouslySetInnerHtml = { {__html:item}}
会把itme当作html语法转译 xss攻击 
  
光标聚焦 点击label就会聚焦
  `<label htmlFor="insert">输入</label>
  <input id="insert">`
  
  
this.deleteItem.bind(this,index)bind可以传入index在事件处理函数中使用
  
父组件向子组件传递数据 用属性 子组件用this.props.属性名接收
子组件向父组件传值 调用一个父组件的方法
  
在constructor里绑定好事件 的this指向：this.onClickHandle  = this.onClickHandle.bind(this)

现在不提倡setState直接写值，可以写成函数的形式
this.setState(()=>{return{}})
  return 也可以直接写成括号 即：
  ```javascript
  this.setState(()=>({
      list:list,
    }))
  ```
这样是异步的setState
  ```javascript
  this.setState(()=>({
      inputValue:e.target.value,
    }
  ```
  会报错 e.target.value异步获取不到，需要在外面先保存一下，const value = e.target.value
  
setState可以传入参数
  ```javascript
  this.setState((prevState)=>({
      list:[...prevState.list,prevState.inputValue],
      inputValue:''
    }))
  ```
  index做key值的问题
  
  ES6语法
  const {content,index} = this.props
  content就相当于this.props.content
  index就相当于this.props.index

  操作dom 如jq 命令式开发
  react是声明式开发 减少大量的dom操作
  组件都是挂在到节点上 react只管理这个节点 其他地方可以用jq等语法 每个语法可以共存
  组件化 组件首字母大写 父子组件传值
  单向数据流 父组件传值 子组件只读 不可以修改这个值 如果要修改 需要用父组件的方法传给子组件 还是用这个方法修改 方便维护 修改都在父组件中
  组件中的复杂传值 flux redux等 react只负责视图框架
  函数式编程更方便自动化测试
  
## 问题
  jsx自动补全标签emmet.triggerExpansionOnTab
  