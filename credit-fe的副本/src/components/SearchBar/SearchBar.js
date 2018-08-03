import React from 'react';
import SelectIntelligent from '../EventsFormSelect/SelectIntelligent';
import style from './SearchBar.css';
import { Form } from 'antd';

/**
 * 一个带搜索按钮下拉选择框
 * @author 黄远
 */

const FormItem = Form.Item;

/**
 * 将下拉搜索框和搜索按钮组合
 * @param {Object} props -传入属性对象集合
 * @returns {*} - 返回组件的渲染描述
 * @constructor
 */

function SearhBar(props) {
    const { getFieldDecorator } = props.form;
    /**
     * 传递给子组件状态发生变化时的处理函数
     * @param {Object} value - 由子组件传过来的参数，
     * @param {Object} data - 由子组件传过来的参数，
     */
    let onchange = (value, data) => {
        props.globalUserId(value.id, value);
    };
    /**
     * 点击搜索按钮时执行的函数
     */
    let search = () => {
        props.form.validateFields((err, values) => {
            if (!err) {
                let getUserId = '';
                if (values.userId) {
                    if (values.userId.value) {
                        getUserId = values.userId.value.key;
                    } else getUserId = '';
                }
                props.search(getUserId);
            }
        });
    };

    let globalUserId = () => {};

    return (
        <div style={props.style} className="self-define">
            <Form>
                <FormItem>
                    {getFieldDecorator('userId', {
                        rules: [
                            {
                                required: false
                            }
                        ]
                    })(
                        <SelectIntelligent
                            placeholder="请输入姓名查询"
                            handleChange={onchange}
                            showDetail={true}
                            globalUserId={globalUserId}
                            style={{ width: '100%', height: 40 }}
                            dropdownMatchSelectWidth={false}
                        />
                    )}
                </FormItem>
                <span
                    type="primary"
                    className={style.btnSearch}
                    onClick={search}
                />
            </Form>
        </div>
    );
}

/**
 * 使用Form.create()()函数使组件成为受控表单组件
 */
export default Form.create()(SearhBar);
