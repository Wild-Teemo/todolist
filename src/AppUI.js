import React, {Fragment } from 'react';
import 'antd/dist/antd.css'; 
import { Input,Button,List} from 'antd';
import './style.css'
import Todo from './todo'
// class AppUI extends Component {
//     render() {
//         return (
//             <Fragment>
//                 <div>
//                     <label htmlFor="insert">todo：</label>
//                     <Input id="insert" className="input" type="text" value={this.props.inputValue}
//                         onChange={this.props.onChangeHandle}
//                         onKeyDown={(e) => { if (e.keyCode === 13) { this.props.onClickHandle() } }}
//                     />
//                     <Button type="primary" onClick={this.props.onClickHandle}>提交</Button></div>
//                 <List className="list" dataSource={this.props.list} renderItem={(item, index) => (
//                 <List.Item><Todo key={item} content={item} index={index} deleteItem={this.props.deleteItem} 
//                 />
//                 </List.Item>)}>
//                 </List>
//             </Fragment>
//         )
//     }
// }

const AppUI = (props)=>{
    return (
        <Fragment>
            <div>
                <label htmlFor="insert">todo：</label>
                <Input id="insert" className="input" type="text" value={props.inputValue}
                    onChange={props.onChangeHandle}
                    onKeyDown={(e) => { if (e.keyCode === 13) { props.onClickHandle() } }}
                />
                <Button type="primary" onClick={props.onClickHandle}>提交</Button></div>
            <List className="list" dataSource={props.list} renderItem={(item, index) => (
            <List.Item><Todo key={item} content={item} index={index} deleteItem={props.deleteItem} 
            />
            </List.Item>)}>
            </List>
        </Fragment>
    )
}

export default AppUI