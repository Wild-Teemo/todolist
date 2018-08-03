import React from 'react';
import { Menu, Dropdown, Icon, Checkbox } from 'antd';
import styles from './Filter.css';

const CheckboxGroup = Checkbox.Group;

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            checkedList: this.props.defaultCheckedList
                ? this.props.defaultCheckedList
                : [],
            indeterminate:
                this.props.defaultCheckedList.length === this.props.menu.length
                    ? false
                    : true,
            checkAll:
                this.props.defaultCheckedList.length === this.props.menu.length
                    ? this.props.checkAll
                    : false
        };
    }

    handleVisibleChange = flag => {
        this.setState({ visible: flag });
    };

    onCheckAllChange = e => {
        let listAll = [];

        this.props.menu.map(item => listAll.push(item.value));

        this.setState({
            checkedList: e.target.checked ? listAll : [],
            indeterminate: false,
            checkAll: e.target.checked
        });
        this.props.filtrate(e.target.checked ? listAll : []);
    };

    onChange = checkedList => {
        this.props.filtrate(checkedList);
        this.setState({
            checkedList,
            indeterminate:
                !!checkedList.length &&
                checkedList.length < this.props.menu.length,
            checkAll: checkedList.length === this.props.menu.length
        });
    };

    render() {
        const menu = (
            <Menu className={this.props.listBgc ? this.props.listBgc : ''}>
                <Menu.Item key="0">
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        全部
                    </Checkbox>
                </Menu.Item>
                <Menu.Divider />
                <CheckboxGroup
                    value={this.state.checkedList}
                    onChange={this.onChange}
                    style={this.props.style}
                >
                    {this.props.menu.map((item, index) => {
                        return (
                            <li
                                key={index + 1}
                                className={
                                    this.props.largeWidth
                                        ? styles.MenuLiLarge
                                        : styles.MenuLi
                                }
                            >
                                <Checkbox value={item.value}>
                                    {item.label}
                                </Checkbox>
                            </li>
                        );
                    })}
                </CheckboxGroup>
            </Menu>
        );
        return (
            <Dropdown
                overlay={menu}
                trigger={['click']}
                onVisibleChange={
                    this.props.outsideCall
                        ? this.props.filtrateChangeHandler
                        : this.handleVisibleChange
                }
                visible={
                    'outsideVisible' in this.props
                        ? !!this.props.outsideVisible
                        : this.state.visible
                }
            >
                <a className="ant-dropdown-link">
                    {this.props.title}
                    <Icon
                        type="caret-down"
                        style={{
                            fontSize: 13,
                            paddingLeft: 4,
                            color: '#666666',
                            verticalAlign: 'top',
                            paddingTop: 3
                        }}
                    />
                </a>
            </Dropdown>
        );
    }
}
export default Filter;
