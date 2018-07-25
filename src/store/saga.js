import {takeEvery,put} from 'redux-saga/effects'
import {INIT_LIST} from './actionType'
import {initList } from './actionCreator';
import axios from 'axios'
function* getList(){
  try {
    const res = yield axios.get('/todo')
  const action = initList(res.data)
  yield put(action)
    
  } catch (e) {
    console.log('网络请求失败')
    
  }
  
}
function* mySaga() {
    yield takeEvery(INIT_LIST,getList) //只要接收到INIT_LIST就会执行getList
  }
  
  export default mySaga;