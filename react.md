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
  _*index做key值的问题*_
  
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
## props
### proptypes
传来的pros类型校验
```javascript
  import propTypes from 'prop-types'
  Todo.propTypes={
    content:propTypes.string.isrequired
  //isrequired表示必须传 
    deleteItem:propTypes.func,
  // content:propTypes.oneOfType([propTypes.number,propTypes.string])
  //多个类型
    index:propTypes.number
}
  ```
如果没有传值 设置一个默认值
  ```JavaScript
  Todo.defaultProps={
    content:'hello'
}
  ```
一个组件的state props发生改变的时候 自己的render就会重新执行 重新渲染页面
  
虚拟dom的重新渲染效率非常高
如果每次修改后都生成真实dom替换前一个 非常消耗性能
如果比对差异 替换差异部分 虽然不用替换全部 但是对比也很消耗性能
生成虚拟dom和比较虚拟dom都很节约性能，减少了对真实dom的创建和比较的性能消耗，比较一个js对象非常简单。

* state数据 模版 
* 数据+模版生成虚拟dom 
* 虚拟dom生成真实dom 显示
  * 虚拟dom就是一个js对象 描述真实的dom
  * ['div',{id:'a'},[span,{},'hello']] 标签名 属性 子节点的标签名属性内容
* state变化时 用state和模版生成一个新的虚拟dom
* 比较两次的虚拟dom 直接操作dom 改变内容
过程是jsx-虚拟dom js对象-真实dom
jsx-js对象是用了react.createElement

虚拟dom优点
  * 提升性能
  * 跨端应用 如react-native 虚拟dom不光在浏览器被识别 生成原生dom就可以在浏览器中 虚拟dom生成原生应用组件就可以开发一些原生应用

比对两个虚拟dom - diff算法
发生变化：state或props发生变化，props变化实际上也是父组件的state变化，所以每次用setstate时改变数据时，就需要进行比对。
* 短时间多次setstate合并为一次 减少比对次数 所以setstate设计成异步函数
* 同级比对
  顶层dom就不一致，不比较下面的，把这个dom下的所有节点都替换掉。虽然也许下面的dom也会有一样的，由于顶层不同都被替换掉了，但是这个算法简单，还是提升了性能。
* key值
  key值比对也可以提高性能
  尽量不要用index作为key值，删除一项后会改变key值。可以用item
  
### ref获取dom react不提倡操作dom 尽量不要使用
 ref={(input)=>{this.input = input}}
  input指向真实的dom节点
  input.value可以获得这个dom节点的value值
  
有时ref和setstate一起使用会出现问题，setstate异步 获取到的是更新前的dom
  
```javascript
     this.setState((prevState) => {
      const list = prevState.list
      list.splice(index, 1)
      
      return {
        list: list
      }
    })
    console.log(this.state.list) //获取到的是splice前的list
  }
  ```
  修改 setstate的第二个参数 回调函数，在setstate异步执行后才会执行 可以用于获取更新后的dom元素信息
```javascript
      this.setState((prevState) => {
      const list = prevState.list
      list.splice(index, 1)

      return {
        list: list
      }
    }, () => {
      console.log(this.state.list)
    }
    )
  }
}
  ```
  
## 生命周期函数
在某一时刻组件会自动调用执行的函数
render 第一次挂载组件和数据发现变化时 组件会自动调用渲染
constructor是es6的函数 不算在react生命周期函数中
* 初始化 state props
* mounting挂载 
  * componentwillmount 组件即将被挂载到页面时 挂载到页面之前
  * render
  * componentdidmount 组件被挂载到页面之后
  数据被修改只会执行render 挂载执行只会执行第一次
* updation组件更新 state props发生变化
  * componentwillreceiveprops 顶层组件没有父组件，没有接收到的props不会执行这个函数。当一个组件从父组件接收到参数，父组件的render函数重新被执行，子组件的这个函数才会执行。（这个组件第一次存在于父组件，不会执行，之前已经存在于父组件中才会被执行）
  * shouldcomponentupdate 更新之前 返回一个布尔值return true 决定是否被更新 返回true才会执行下面的函数
  * componentwillupdate 组件更新之前
  * render
  * componentdidupdate 更新完成之后
* unmounting
  * componentwillunmount 组件从页面中去除之前
## 生命周期函数的作用
继承自component component有除了render的所有生命周期函数 render必须写
* 利用shouldcomponentupdate避免子组件不改变也要随父组件重新渲染
```javascript
shouldcomponentupdate(nextProps,nextState){
  if(nextprops.content !== this.props.content){
  return true
  }else{
  return false
  }
  }
```
  只有子组件改变 才会执行子组件的render
  
* react中的异步ajax放在componentdidmount中。如果放在render中，render会多次执行，会发送多次ajax请求。_*放在componentwillmount中 constructor中?*_

## react中的性能优化
* 事件绑定this全放到constructor中 使绑定操作只用执行一次 避免子组件无谓渲染 _*为什么会优化*_
* setstate异步，合并成一次
* 虚拟dom 同层比对key值对比
* 子组件shouldcomponentupdate

  
## react中的ajax模块 - axios
成功回调.then 失败.catch
import axios from 'axios'
```javascript
  componentDidMount(){
  axios.get('./todo.js').then(()=>{
    console.log('success')

  }).catch(()=>{
    console.log('false')
  })
}
  ```
  
## react中的动画
###css动画
animation 最后一个参数 forwards保存最后一帧效果
```javascript
  .show{
    opacity: 1;
    animation: hide-show 2s ease-in forwards
}
.hide{
    opacity: 0;
    animation: hide-show 2s ease-in forwards
}

@keyframes hide-show{
    0% {
        color:red;
        opacity: 1;
    }
    50%{
        color:blue;
        opacity: 0.5;
    }
    100%{
        color:green;
        opacity: 1
    }
}
import React,{Component,Fragment} from 'react';
import './animation.css'
class Animation extends Component{
    constructor(props){
        super(props)
        this.state={
            show:true
        }
        this.toggle = this.toggle.bind(this)
    }
    render(){
        return(
            <Fragment>
            <div className={this.state.show?'show':'hide'}>show</div>
            <div onClick={this.toggle}>toggle</div>
            </Fragment>
        )
    }
    toggle(){
        this.setState(()=>({
            show:this.state.show?false:true
        }))
    }
}

export default Animation
  ```
### react-transition-group
  
# redux
redux把数据放在公共区域store
reducer+flux
## 工作流程
react component
action creators
store
reducer
组件向store获取数据前，通过action creators创建需要获取数据这句话告诉store，store向reducer查询，reducer告诉store查询数据。
  

const newState = JSON.parse(JSON.stringify(state))
对state做一次深拷贝
因为reducer可以接收state 但不可以修改state 只能修改拷贝的
  
actionType.js 用来检查action type 防止拼写错误检查不出来
```javascript
  import { CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DEL_TODO_ITEM} from './store/actionType'
  export const CHANGE_INPUT_VALUE = 'change_input_value'
export const ADD_TODO_ITEM = 'add_todo_item'
export const DEL_TODO_ITEM = 'del_todo_item'
  ```
actioncreator统一管理action
  
* store必须唯一
* 别的只能改变store的副本 只有store能改变自己的内容 reducer中store取得更新完的副本再对自己更新
* reducer必须是纯函数 （给定固定输入，就会有固定输出。并且不会有副作用）如用了new date（）输出，就不是纯函数 直接修改了state会产生副作用，也不叫纯函数

createstore
store.dispatch
store.getstate
store.subscribe

## UI组件和容器组件
UI组件负责渲染 容器组件负责逻辑
把ui部分单独写成一个组件 
## 无状态组件
一个组件只有一个render函数 可以用无状态组件替换这个组件
无状态组件性能高
```javascript
class AppUI extends Component {
    render() {
        return (this.props.
        )
    }
}
```
```javascript
  const AppUI = (props)=>{
    return (props.
    )
}
```
## redux中的异步请求
### axios
### redux中间件 redux-thunk 
同时使用thunk和devtools两个中间件
```javascript
  import { createStore ,applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
const composeEnhancers =window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(
        applyMiddleware(thunk),
      );
const store = createStore(
    reducer,//使用reducer构建store里的初始数据
    enhancer
    
);
export default store
  ```
使用redux-thunk把异步操作都移到action中去
action中都是return出一个对象 使用redux之后可以return出一个函数 函数里做异步的操作
返回函数可以接收别的action，用dispatch方法，直接在返回函数里dispatch(action)
  
view派发action action通过dispatch派发给store store接收到action连同之前的state一起发送给reducer  reducer返回一个新的数据给store store改变自己的state
中间件是在action和store中间 action不仅可以是对象，也可以是函数
redux-thunk实际上就是dispatch方法的升级，接收到的参数可以是函数 直接执行
redux-logger 记录action派发日志  每一次调用action时调用dispatch方法把action传给store 对dispatch升级：每次传递action给store前，打印出传递的action
### redux-saga 单独把异步操作放到一个文件中
``` javascript
import { createStore,applyMiddleware,compose} from 'redux';
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer';
import mySaga from './saga'

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers =window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(
        applyMiddleware(sagaMiddleware),
      )
const store = createStore(
    reducer, //使用reducer构建store初始数据
    enhancer 
)
sagaMiddleware.run(mySaga)
export default store
```
saga.js中 使用 *_generator函数 ？_* 

## react-redux
### provider
``` javascript
  import  {Provider} from 'react-redux'
  const App = (
    <Provider store = {store}>  //Provider中的所有组件都可以获得store
    <Todolist/>
    </Provider>
)
  ```
### connet
```javascript
  import connect from 'react-redux'
  export default connect(null,null)(TodoList) //让TodoList和store做连接 首先TodoList要在provider里
  ```
## dva
babel-plugin-import 是用来按需加载 antd 的脚本和样式的

put 用于触发 action 。
`yield put({ type: 'todos/add', payload: 'Learn Dva' });`
call 用于调用异步逻辑，支持 promise 。
` const result = yield call(fetch, '/todos'); `
select 用于从 state 里获取数据。
` const todos = yield select(state => state.todos);`

  ## 问题
  jsx自动补全标签emmet.triggerExpansionOnTab
  
http://ochukai.me/dva-in-action/
https://github.com/dvajs/dva-knowledgemap#effects
https://github.com/dvajs/dva/tree/master/examples/user-dashboard
https://dvajs.com/guide/introduce-class.html#dispatch-%E6%96%B9%E6%B3%95


  list: [...res.data]
  而不使用 list:res.data
  先把res.data拆分再构建新的数组传给list
  避免res数据被修改后 不可预知的数据改变的情况
  