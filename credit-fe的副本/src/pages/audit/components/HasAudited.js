import React from 'react';
import HeaderSearch from './_HeaderSearch';
import Table from './AuditedTable';
import { connect } from 'dva';
import { updateDate } from '../../../utils/mytool';
import Filter from '../../../components/FilterTable/Filter';
import HasAuditedDetails from './HasAuditedDetails';

class HasAudited extends React.Component {
    constructor(props) {
        super(props);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.hasAuditedOnChange = this.hasAuditedOnChange.bind(this);
        this.hasAuditedDataFilter = this.hasAuditedDataFilter.bind(this);
        this.userSearch = this.userSearch.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.setGlobalUser = this.setGlobalUser.bind(this);
    }
    componentDidMount() {
        const hasAuditedObj = {
            pageNum: 1,
            pageRow: this.props._pageNum
            // startDate: this.props._chooseDate,
            // searchId: this.props._searchId,
            // scores: this.props._scores
        };
        this.props._chooseDate &&
            (hasAuditedObj.startDate = this.props._chooseDate);
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 分页
    hasAuditedOnChange(pageNumber) {
        const hasAuditedObj = {
            pageNum: pageNumber
            // pageRow: this.props._pageNum,
            // startDate: this.props._chooseDate,
            // searchId: this.props._searchId,
            // scores: this.props._scores
        };
        this.props._chooseDate &&
            (hasAuditedObj.startDate = this.props._chooseDate);
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 日期筛选
    dateOnChange(chooseDate) {
        const hasAuditedObj = {
            pageNum: 1
            // pageRow: this.props._pageNum,
            // startDate: updateDate(chooseDate),
            // searchId: this.props._searchId,
            // scores: this.props._scores
        };
        updateDate(chooseDate) &&
            (hasAuditedObj.startDate = updateDate(chooseDate));
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 评审结果过滤
    hasAuditedDataFilter(listArr) {
        const hasAuditedObj = {
            pageNum: 1,
            pageRow: this.props._pageNum,
            startDate: this.props._chooseDate,
            searchId: this.props._searchId,
            scores: listArr
        };
        if (listArr.length === 0) {
            this.props.dispatch({
                type: 'audit/_getHasAuditedData',
                payload: {
                    _hasAuditedData: [],
                    _total: 0,
                    _loading: false
                }
            });
            return;
        }
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 用户ID查询
    userSearch(userId) {
        const hasAuditedObj = {
            pageNum: 1,
            // pageRow: this.props._pageNum,
            // startDate: this.props._chooseDate,
            searchId: userId
            // scores: this.props._scores
        };
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 点击行成就
    rowClick(record) {
        // 获取已评分成就信息
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedEvent',
            payload: { eventID: record.eventID }
        });
    }
    // 取消详情节
    cancelModal() {
        this.props.dispatch({
            type: 'audit/_showHasAuditedDetails',
            payload: {
                _showHasAuditedDetails: !this.props._showHasAuditedDetails
            }
        });
    }
    // 新增搜索框全局
    setGlobalUser(userId) {
        this.props.dispatch({
            type: 'audit/_changeUserIdstate',
            payload: { _searchId: userId }
        });
        if (!userId) userId = '';

        const hasAuditedObj = {
            pageNum: 1,
            // pageRow: this.props._pageNum,
            // startDate: this.props._chooseDate,
            searchId: userId
            // scores: this.props._scores
        };
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: hasAuditedObj
        });
    }
    // 表格排序事件
    handleSortEvent = (pagination = {}, filters, sorter = {}) => {
        const query = {};
        // 换页事件被触发
        const { current } = pagination;
        if (current) {
            query.pageNum = current;
            query.currentPage = current;
        }

        // 排序事件被触发
        const { order, field } = sorter;
        console.log(field);
        if (field === 'createAt') {
            query.sortCreatedAt = order === 'descend' ? 1 : 0;
            query.sortType = undefined;
        }
        if (field === 'score') {
            query.sortType = order === 'descend' ? 1 : 0;
            query.sortCreatedAt = undefined;
        }
        this.props.dispatch({
            type: 'audit/fetch_getHasAuditedData',
            payload: { ...query }
        });
    };
    render() {
        // 定义表格数据
        const filterMenus = [
            { label: '大', value: '1' },
            { label: '中', value: '2' },
            { label: '小', value: '3' },
            { label: '无效', value: '4' }
        ];
        const defaultCheckedList = ['1', '2', '3', '4'];
        const columns = [
            {
                title: '成就简介',
                dataIndex: 'title',
                width: '25%'
            },
            // {
            //     title: '类型',
            //     dataIndex: 'type',
            //     width: '15%'
            // },
            {
                title: '拥有人',
                dataIndex: 'responsibleUserName',
                width: '10%'
            },
            {
                title: '提交人',
                dataIndex: 'reportUserName',
                width: '10%'
            },
            {
                title: '时间',
                dataIndex: 'createAt',
                width: '15%',
                sorter: true
            },
            {
                title: '进度',
                dataIndex: 'progress',
                width: '10%'
            },
            {
                title: '评分结果',
                width: '15%',
                dataIndex: 'score',
                // key: 'result',
                sorter: true,
                render: text => {
                    if (text === -2) return '评分中';
                    if (text === -1) return '无效';
                    return text;
                }
            }
        ];
        return (
            <div style={{ position: 'relative' }}>
                <HeaderSearch
                    dateSearch={this.dateOnChange}
                    userSearch={this.userSearch}
                    globalUserId={this.setGlobalUser}
                />
                <Table
                    menu={columns}
                    AuditedData={this.props}
                    changePage={this.handleSortEvent}
                    click={this.rowClick}
                />
                <HasAuditedDetails
                    allSources={{
                        eventData: this.props._hasAEventMessage,
                        auditResultList: this.props._hasAEventauditResultList
                    }}
                    cancelModal={this.cancelModal}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(HasAudited);
