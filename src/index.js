import React from 'react';
import ReactDOM from 'react-dom';
import Todolist from './TodoList'
import  {Provider} from 'react-redux'
import store from './store'
import Father from './demo'

const App = () => {
    // <Provider store = {store}>  //Provider中的所有组件都可以获得store
    // <Todolist/>
    // </Provider>
    return (
   <Father />
    )
}



ReactDOM.render(<App/>,document.getElementById('root'))

