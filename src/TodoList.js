import React, { Component } from 'react'
import {connect} from 'react-redux'

class TodoList extends Component{
    render() {
        return (
            <div>
                <div>
                    <input value={this.props.inputValue}/>
                    <button> 提交</button>
                </div>
                <ul>

                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        inputValue:state.inputValue
    }
}
export default connect(mapStateToProps,null)(TodoList) //让TodoList和store做连接 首先TodoList要在provider里
//mapStateToProps连接的规则 把store里的数据变成组件的props