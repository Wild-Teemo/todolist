import React, { Component, Fragment } from 'react';
import Todo from './todo'
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

        <div> <label htmlFor="insert">todo：</label>
          <input id="insert" className="input" type="text" value={this.state.inputValue} onChange={this.onChangeHandle} />
          <button onClick={this.onClickHandle}>添加</button></div>
        <ul>
          {this.getTodo()}
        </ul>

      </Fragment>

    );
  }
  getTodo() {
    return this.state.list.map((item, index) => {
      return (
          <Todo key={index} content={item} index={index} item={item} deleteItem={this.deleteItem}
          />
      )
    })
  }
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
    this.setState((prevState) => ({
      list: [...prevState.list, prevState.inputValue],
      inputValue: ''
    }))
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
}


export default Todolist;
