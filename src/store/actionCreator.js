import { CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DEL_TODO_ITEM,INIT_LIST} from './actionType'


export const getChangeInput = (value)=> ({
    type:CHANGE_INPUT_VALUE,
    value
})
export const getAddItem = ()=> ({
    type:ADD_TODO_ITEM
})
export const getDelItem = (index)=> ({
    type: DEL_TODO_ITEM,
    index
})

export const initList= (data)=> ({
    type: INIT_LIST,
    data
})

