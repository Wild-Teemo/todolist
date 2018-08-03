import React from 'react';
import { Row, Card } from 'antd';

import SelectIntelligent from '../../../components/SelectIntelligent/SelectIntelligent';
import styles from './components.css';

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {}
        };
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
    }

    onChange(value) {
        let actValue = value;
        if (value === '') {
            actValue = {};
        }
        this.setState({
            ...this.state,
            value: actValue
        });
        this.props.searchByKeyword(value);
    }

    search() {
        this.props.searchByKeyword(this.state.value);
    }

    render() {
        return (
            <Card className={styles.defaultColor}>
                <Row className="self-define">
                    <div style={{ position: 'relative', width: 286 }}>
                        <SelectIntelligent
                            placeholder="请输入姓名查询"
                            onChange={this.onChange}
                            mode=""
                            dropdownMatchSelectWidth={false}
                        />
                        <span
                            type="primary"
                            className={styles.btnSearch}
                            onClick={this.search}
                        />
                    </div>
                </Row>
            </Card>
        );
    }
}

export default SearchPanel;
