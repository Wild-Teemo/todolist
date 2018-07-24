import React, { Component,Fragment} from 'react';
import propTypes from 'prop-types'
class Todo extends Component{
    constructor(props){
        super(props)
        this.deleteItem = this.deleteItem.bind(this)
        
    }
    render(){
        const {content} = this.props
        return (
        <Fragment>
            <li>{content}<span className='check' onClick={this.deleteItem}>OK</span></li>
        </Fragment> 
        )
    }
    deleteItem(){
        const {deleteItem,index} = this.props
        deleteItem(index)
    }
    shouldComponentUpdate(nextprops,nextstate){
        if(nextprops.content !== this.props.content){
            return true
        }else{
            return false
        }
    }
}


Todo.propTypes={
    index:propTypes.number,
    deleteItem: propTypes.func,
    content:propTypes.oneOfType([propTypes.number,propTypes.string])
}
export default Todo