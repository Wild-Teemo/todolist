import React, { Component, Fragment } from 'react';
import 'antd/dist/antd.css'; 
import { Input,Button,List} from 'antd';
import Todo from './todo'
//import axios from 'axios'
import './style.css'
import store from './store/'
import { CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DEL_TODO_ITEM} from './store/actionType'


class Todolist extends Component {
  constructor(props) {
    super(props)
    this.state = store.getState()
    this.onClickHandle = this.onClickHandle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    store.subscribe(this.handleChange)
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

  onChangeHandle(e) {
    const action = {
      type:CHANGE_INPUT_VALUE,
      value:e.target.value
    }
    store.dispatch(action)
  }
  handleChange(){
    this.setState(store.getState())
  }
  onClickHandle() {
    const action = {
      type:ADD_TODO_ITEM
    }
    store.dispatch(action)
  }
  deleteItem(index) {
    const action = {
      type: DEL_TODO_ITEM,
      index:index
    }
    store.dispatch(action)
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
