import React, { Component} from 'react';
import propTypes from 'prop-types'
class Todo extends Component{
    constructor(props){
        super(props)
        this.deleteItem = this.deleteItem.bind(this)
        
    }
    render(){
        const {content,item} = this.props
        return (
        <div>
            <li>{content} <div className='check' onClick={this.deleteItem}>OK</div></li>
        </div> 
        )
    }
    deleteItem(){
        const {deleteItem,index} = this.props
        deleteItem(index)
    }
}

Todo.propTypes={
    content:propTypes.string,
    deleteItem:propTypes.func,
    index:propTypes.number
}
Todo.defaultProps={
    content:'hello'
}
export default Todo