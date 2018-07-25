import React, { Component} from 'react';
import AppUI from './AppUI'
import store from './store/'

import { getChangeInput,getAddItem,getDelItem,initList} from './store/actionCreator'

class Todolist extends Component {
  constructor(props) {
    super(props)
    this.state = store.getState()
    this.onClickHandle = this.onClickHandle.bind(this)
    this.onChangeHandle = this.onChangeHandle.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
    store.subscribe(this.handleChange)
  }
  render() {
    return (
      <AppUI 
      inputValue = {this.state.inputValue}
      list = {this.state.list}
      onClickHandle={this.onClickHandle}
      onChangeHandle = { this.onChangeHandle }
      deleteItem = {this.deleteItem}
      />
    );
  }

  onChangeHandle(e) {
    const action = getChangeInput(e.target.value)
    store.dispatch(action)
  }
  handleChange(){
    this.setState(store.getState())
  }
  onClickHandle() {
    const action =  getAddItem()
    store.dispatch(action)
  }
  deleteItem(index) {
    const action = getDelItem(index)
    store.dispatch(action)
  }
  componentDidMount() {
    const action = initList()
    store.dispatch(action)
    
  }

}

export default Todolist;
