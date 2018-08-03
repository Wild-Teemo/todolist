import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import ItemShow from './ItemShow';
import request from '../../utils/request';

const Option = Select.Option;

/**
 * 一个下拉选择框
 * @author 黄远
 */

class SelectIntelligent extends React.Component {
    /**
     * 构造方法
     * @param {Object} props - 传入的属性对象集合
     * @param {String} props.placeholder - 输入框提示语
     * @param {Function} props.handleChange - 输入框值变化时的执行函数
     * @param {boolean} props.showDetail - 是否显示名字+职位和部门，如果为否，只显示名字
     * @param {Function} props.globalUserId - 选择了某一个人的时候，获取当前选择对象的id，
     * @param {Object} props.style - 选择框的样式
     * @param {boolean} props.dropdownMatchSelectWidth - 下拉框是否与搜索框严格同宽
     */
    constructor(props) {
        super(props);
        this.mode = props.mode === undefined ? 'mode' : this.props.mode;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    /**
     * @type {{data: Array, value: Array, fetching: boolean, display: {display: string}}}
     */
    state = {
        data: [],
        value: [],
        fetching: false,
        display: { display: 'inline' }
    };

    /**
     * 生命周期函数
     * @param {Object} nextProps - 下一次接收到的属性对象集合
     * @constructor
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            const value = nextProps.value.value;
            this.setState({
                data: [],
                value,
                fetching: false
            });
        } else {
            this.setState({
                ...this.state,
                value: []
            });
        }
    }

    /**
     * 获取用户信息函数
     * @param {String} value - 监听onsearch成就的执行函数，value是一个字符串关键字
     */
    fetchUser = value => {
        if (!value) {
            return;
        }
        this.setState({ data: [], fetching: true });
        request(`/user/search?keywords=${value}`).then(body => {
            const data = body.data.map(user => ({
                text: (
                    <ItemShow
                        showDetail={this.props.showDetail}
                        name={user.name}
                        position={user.career}
                        department={user.departName}
                    />
                ),
                value: user.id,
                email: user.email,
                avatar: user.avatar,
                department: user.departName,
                name: user.name,
                position: user.career
            }));
            this.setState({
                data,
                display: { display: 'inline' }
            });
            this.setState({
                fetching: false
            });
        });
    };
    /**
     * 输入框变化时的监听函数
     * @param {Object} value - 选中的数据
     * @param {Object} data - 选中的数据
     * @return {bool} bool
     */
    handleChange = (value, data) => {
        if (this.state.fetching) {
            return false;
        }
        let email = '';
        if (data) {
            email = data.props;
        }
        if (data && data.length > 0) {
            email = data[0].props;
        }

        this.props.handleChange(email, data);
        this.triggerChange({ value });
        this.setState({
            value,
            data: [],
            fetching: false,
            display: { display: 'none' }
        });
    };
    /**
     * 用于该组件作为form表单子组件时的控制函数
     * @param {Object} changedValue - 修改的数据
     */
    triggerChange = changedValue => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    };

    render() {
        const { fetching, data, value } = this.state;
        return (
            <Select
                mode={this.mode}
                labelInValue
                value={value}
                placeholder={this.props.placeholder}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={this.props.style}
                dropdownMatchSelectWidth={false}
                showSearch={true}
                allowClear={true}
                dropdownStyle={{ lineHeight: 10 }}
            >
                {data.map(d => (
                    <Option
                        key={d.value}
                        id={d.value}
                        name={d.name}
                        email={d.email}
                        department={d.department}
                        position={d.position}
                        avatar={d.avatar}
                    >
                        {d.text}
                    </Option>
                ))}
            </Select>
        );
    }
}

export default SelectIntelligent;
