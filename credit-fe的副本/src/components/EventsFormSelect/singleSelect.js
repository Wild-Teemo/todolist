import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import ItemShow from './ItemShow';
import request from '../../utils/request';

const Option = Select.Option;

/**
 * 下拉选择框
 * 如果你想了解关于该组件的更多详情，请参考 {@link SelectIntelligent}
 *  @author 黄远
 */

class SelectIntelligent extends React.Component {
    constructor(props) {
        super(props);
        this.mode = props.mode === undefined ? 'multiple' : this.props.mode;
        this.fetchUser = debounce(this.fetchUser, 800);
        this.state = {
            data: [],
            value: [],
            fetching: false,
            label: this.props.labels
        };
        this.deSelect = this.deSelect.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value.value;
            this.setState({
                data: [],
                value,
                fetching: false
            });
        }
    }

    fetchUser = value => {
        if (!value) {
            return;
        }
        this.setState({ ...this.state, data: [], fetching: true });
        request(`/user/search?keywords=${value}`).then(body => {
            const data = body.data.map(user => ({
                text: (
                    <ItemShow
                        showDetail={true}
                        name={user.name}
                        position={user.career}
                        department={user.departName}
                    />
                ),
                value: user.id,
                email: user.email,
                avatar: user.avatar
            }));
            this.setState({ ...this.state, data, fetching: false });
        });
    };

    handleChange = (value, data) => {
        this.props.handleChange(data);
        this.triggerChange({ value });
        this.setState({
            value,
            data: [],
            fetching: false
        });
    };

    deSelect = () => {
        this.props.deSelect();
    };

    triggerChange = changedValue => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    };

    render() {
        let { fetching, data, value } = this.state;
        if (this.props.labels.length > 0) {
            value = this.props.labels[0];
        }
        return (
            <Select
                mode="mode"
                labelInValue={true}
                value={value}
                placeholder={this.props.placeholder}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={this.props.style}
                maxTagCount={1}
                dropdownMatchSelectWidth={this.props.dropdownMatchSelectWidth}
                showSearch={true}
                allowClear={true}
                onDeselect={this.deSelect}
                onFocus={this.deSelect}
                showArrow={
                    this.props.showArrow !== undefined
                        ? this.props.showArrow
                        : true
                }
            >
                {data.map(
                    d =>
                        d.email !== '' ? (
                            <Option
                                key={d.value}
                                id={d.value}
                                detail={d.text}
                                email={d.email}
                                avatar={d.avatar}
                            >
                                {this.props.keys === 'email' ? d.email : d.text}
                            </Option>
                        ) : (
                            <div style={{ display: 'none' }} key={d.value} />
                        )
                )}
            </Select>
        );
    }
}

export default SelectIntelligent;
