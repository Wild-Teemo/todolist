import React from 'react';
import EventHistoryList from './components/EventHistoryList';
import SearchPanel from './components/SearchPanel';
import { connect } from 'dva';

const HistoryPage = ({
    dispatch,
    list: dataSource,
    total,
    page: current,
    score,
    keyword,
    loading
}) => {
    //处理antd table rowkey警告
    dataSource.map((row, index) => (row.key = index));
    const pageChangeHandler = page => {
        dispatch({
            type: 'events/fetch',
            payload: { keyword, page, score }
        });
    };

    const searchByKeyword = item => {
        keyword = item.key;
        dispatch({
            type: 'events/fetch',
            payload: { keyword, score }
        });
    };

    const filtrate = checkedList => {
        let score = checkedList.join(',');
        if (!score) {
            dispatch({
                type: 'events/save',
                payload: {
                    data: [],
                    total: 0,
                    page: 0,
                    score: score,
                    keyword: keyword
                }
            });
            return;
        }
        dispatch({
            type: 'events/fetch',
            payload: { keyword, score }
        });
    };

    let postDone = () => {
        let page = current;
        dispatch({
            type: 'events/fetch',
            payload: { keyword, page, score }
        });
    };
    // 当表格onChange成就被触发时
    const onHistoryTableChange = (pagination, filters, sorter = {}) => {
        const { order, field } = sorter;
        if (!order || !field) return;
        const sort = `${field === 'createAt' ? 'sortCreatedAt' : 'sortType'}=${
            order === 'descend' ? 1 : 0
        }`;
        dispatch({
            type: 'events/fetch',
            payload: { sort }
        });
    };
    return (
        <div style={{ marginTop: 24, padding: '0 49px' }}>
            <SearchPanel searchByKeyword={searchByKeyword} />
            <EventHistoryList
                loading={loading}
                dataSource={dataSource}
                total={total}
                current={current}
                pageChangeHandler={pageChangeHandler}
                filtrate={filtrate}
                postDone={postDone}
                handleTableChange={onHistoryTableChange}
            />
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

export default connect(mapStateToProps)(HistoryPage);
