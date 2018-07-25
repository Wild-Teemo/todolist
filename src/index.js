import React from 'react';
import ReactDOM from 'react-dom';
import Todolist from './TodoList'
import  {Provider} from 'react-redux'
import store from './store'

const App = (
    <Provider store = {store}>  //Provider中的所有组件都可以获得store
    <Todolist/>
    </Provider>
)


ReactDOM.render(<Provider/>,document.getElementById('root'))

