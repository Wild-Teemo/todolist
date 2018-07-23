import React, { Component} from 'react';
class Todo extends Component{
    constructor(props){
        super(props)
        this.deleteItem = this.deleteItem.bind(this)
        
    }
    render(){
        const {content,index} = this.props
        return (
        <div>
          <label htmlFor={index}>{content}</label>
          <input type="checkbox" onChange={this.deleteItem} checked=""/>        
        </div> 
        )
    }
    deleteItem(){
        const {deleteItem,index} = this.props
        deleteItem(index)
    }
}
export default Todo