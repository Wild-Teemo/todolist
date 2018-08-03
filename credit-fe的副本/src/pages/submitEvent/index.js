import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import EventForm from './components/EventForm';

// import styles from './index.css'

const pageIndex = ({
    dispatch,
    list: dataSource,
    total,
    page: current,
    score,
    keyword
}) => {
    return (
        <div style={{ marginTop: 24, padding: '0 49px' }}>
            <Card
                title={<span className="titleIcon">填写成就</span>}
                className="defaltCard"
            >
                <EventForm />
            </Card>
        </div>
    );
};

function mapStateToProps(state) {
    const { list, total, page, score, keyword } = state.events;
    return {
        list,
        total,
        page,
        score,
        keyword,
        loading: state.loading.models.events
    };
}

export default connect(mapStateToProps)(pageIndex);
