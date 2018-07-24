import { CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DEL_TODO_ITEM} from './actionType'
const defaultState = {
    inputValue:'',
    list:[]
}

//reducer可以接收state 但不可以修改state
export default(state = defaultState,action) => {
    if(action.type === CHANGE_INPUT_VALUE){
        const newState = JSON.parse(JSON.stringify(state))
        newState.inputValue = action.value
        return newState
    }
    if(action.type === ADD_TODO_ITEM){
        const newState = JSON.parse(JSON.stringify(state))
        newState.list.push(newState.inputValue)
        newState.inputValue = ''
        return newState
    }
    if(action.type ===  DEL_TODO_ITEM){
        const newState = JSON.parse(JSON.stringify(state))
        newState.list.splice(action.index,1)
        return newState
    }
    return state; //state是store中的数据
}