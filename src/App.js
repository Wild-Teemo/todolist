import React, { Component, Fragment } from 'react';
import 'antd/dist/antd.css'; 
import { Input,Button,List} from 'antd';
import Todo from './todo'
//import axios from 'axios'
import './style.css'
//const component = react.component


class Todolist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      list: []
    }
    this.onClickHandle = this.onClickHandle.bind(this)
    this.onChangeHandle = this.onChangeHandle.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }
  render() {
    return (
      <Fragment>

        <div> 
          <label htmlFor="insert">todo：</label>
          <Input id="insert" className="input" type="text" value={this.state.inputValue}
            onChange={this.onChangeHandle}
            onKeyDown={(e) => { if (e.keyCode === 13) { this.onClickHandle() } }}
          />
          <Button type="primary" onClick={this.onClickHandle}>提交</Button></div>
        <List className="list" dataSource={this.state.list} renderItem={(item,index) => (<List.Item><Todo key={item} content={item} index={index} deleteItem={this.deleteItem}/></List.Item>)}>

        </List>

      </Fragment>

    );
  }
  // getTodo() {
  //   return this.state.list.map((item, index) => {
  //     return (
        
  //       />
  //     )
  //   })
  // }
  onChangeHandle(e) {
    const value = e.target.value
    this.setState(() => ({
      inputValue: value
    }))

  }
  onClickHandle() {
    // const list = this.state.list
    // list.push(this.state.inputValue)
    //list : [...this.state.list,this.state.value]

    this.setState((prevState) => {
      if (prevState.inputValue === '') {
        alert('请输入')
        return {
          list: prevState.list,
          inputValue: ''
        }
      }
      else {
        return {
          list: [...prevState.list, prevState.inputValue],
          inputValue: ''
        }
      }
    })
  }
  deleteItem(index) {

    //不可以直接修改state中的数据 拷贝一个副本修改
    this.setState((prevState) => {
      const list = prevState.list
      list.splice(index, 1)

      return {
        list: list
      }
    })
  }
  // componentDidMount() {
  //   axios.get('./todo').then((res) => {
  //     this.setState(() => ({
  //       list: [...res.data]
  //     }))
  //   })
  //     .catch(() => {
  //       console.log('false')
  //     })
  // }

}


export default Todolist;
