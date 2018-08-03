import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin, message } from 'antd';
import debounce from 'lodash/debounce';
import ItemShow from './ItemShow';
import request from '../../utils/request';

const Option = Select.Option;
class SelectIntelligent extends React.Component {
    constructor(props) {
        super(props);
        this.mode = props.mode === undefined ? 'multiple' : props.mode;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    state = {
        data: [],
        value: [],
        fetching: false
    };

    fetchUser = value => {
        value = value.trim();
        if (!value) {
            this.setState({
                data: []
            });
            return;
        }
        this.setState({ data: [], fetching: true });
        request(`/user/search?keywords=${value}`).then(result => {
            const data = result.data;
            if (!data || data.length <= 0) {
                message.error('用户不存在');
                this.setState({
                    value: []
                });
            }
            this.setState({
                data: data.map(user => ({
                    text: <ItemShow userdata={user} />,
                    value: user.id
                })),
                fetching: false
            });
        });
    };

    handleChange = value => {
        if (!value) value = [];
        this.props.onChange(value);
        this.setState({
            value,
            data: [],
            fetching: false
        });
    };
    delResult = () => {
        this.setState({
            value: [],
            data: []
        });
    };
    sel = () => {
        if (this.state.data.length <= 0) {
            message.error('用户不存在');
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
                style={{ width: '100%' }}
                maxTagCount={this.props.maxTagCount}
                dropdownMatchSelectWidth={this.props.dropdownMatchSelectWidth}
                showSearch={true}
                allowClear={true}
                onSelect={this.sel}
                onFocus={this.delResult}
            >
                {data.map(d => (
                    <Option key={d.value}>{d.text}</Option>
                ))}
            </Select>
        );
    }
}

SelectIntelligent.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default SelectIntelligent;
