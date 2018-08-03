import React from 'react';
import * as auditService from '../services/audit';
import Grade from '../components/Grade';
import { changeScore, formatDate } from '../../../utils/mytool';
import { message } from 'antd';

message.config({
    top: '90%',
    duration: 3,
    maxCount: 1
});

function currentTime() {
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMonth = date.getMonth() + 1;
    nowMonth = nowMonth > 10 ? nowMonth : '0' + nowMonth;
    let current = nowYear + '/' + nowMonth;
    return current;
}
export default {
    namespace: 'audit',
    state: {
        showInviteCard: 'hidden',
        successFlag: 'hidden',
        errorFlag: 'hidden',
        keywords: null,
        eventId: -1,
        email: '',
        users: [],
        data: [],
        dataQueryParams: {},
        pagination: {
            showQuickJumper: true,
            pageSize: 8,
            total: 1,
            current: 1
        },
        loading: true,
        _hasAuditedData: [],
        auditedDataQueryParams: {},
        auditedDataPagination: {
            showQuickJumper: true,
            pageSize: 8,
            total: 1,
            current: 1
        },
        _total: 0,
        _loading: true,
        _pageNum: 8,
        _currenPage: 1,
        // _chooseDate: formatDate('yyyy-MM', new Date()),
        _chooseDate: '',
        _searchId: '',
        _scores: [],
        _showHasAuditedDetails: false,
        selectDate: currentTime(),
        unAuditId: '',
        unStartDate: '',
        unCurrentPage: 1,
        isAudit: '',
        _hasAEventauditResultList: [],
        _hasAEventMessage: {},
        _showUsAuditedDetails: false,
        _UnAEventauditResultList: [],
        _UnAEventMessage: {},
        _isAudit: false,
        _checkboxState: [false, false, false, false, false],
        _switchEdie: true, // 切换编辑状态 true 编辑,
        _UnAEventauditResultListPro: [], // 评分进度
        _isSubmit: { submited: false, count: 0 }
    },

    reducers: {
        // 修改已评分表格查询条件
        changeAuditedDataQueryParams(
            state,
            {
                payload: { auditedDataQueryParams }
            }
        ) {
            return { ...state, auditedDataQueryParams };
        },
        // 修改待评分查询条件
        changeDataQueryParams(
            state,
            {
                payload: { dataQueryParams }
            }
        ) {
            return { ...state, dataQueryParams };
        },
        //是否展示邀请评分人卡片@auth wency0//单选某个成就时，给eventId赋值
        isShow(
            state,
            {
                payload: { showInviteCard, eventId, email }
            }
        ) {
            return { ...state, showInviteCard, eventId, email };
        },
        //setEmail @auth wency
        setEmail(
            state,
            {
                payload: { email }
            }
        ) {
            return { ...state, email };
        },
        //邀请评分人输入变化时请求到的用户 @auth wency0
        saveUsers(state, action) {
            return { ...state, ...action.payload };
        },
        //邀请评审请求成功标志 @auth wency0
        sucesFlag(state, action) {
            // console.log(action)
            return { ...state, ...action.payload };
        },

        changePagination(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _getHasAuditedData(state, action) {
            console.log(action);
            return { ...state, ...action.payload };
        },
        _updatedLoading(state, action) {
            return { ...state, ...action.payload };
        },
        _errLoading(
            state,
            {
                payload: { _loading }
            }
        ) {
            return { ...state, _loading };
        },
        errLoading(
            state,
            {
                payload: { loading }
            }
        ) {
            return { ...state, loading };
        },
        _showHasAuditedDetails(state, action) {
            return { ...state, ...action.payload };
        },
        _changeUserIdstate(state, action) {
            return { ...state, ...action.payload };
        },
        tableData(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeTime(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeUnAuditId(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeIsAudit(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _getHasAuditedEvent(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        // 未评分 隐藏模态框
        UnAcancelModal(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _getUnAuditedEvent(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _showUnAuditedDetails(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _addUnAuditedEvent(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeSubmit(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        clearData(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects: {
        //邀请评分人组件中模糊查询用户 @parm String keywords
        // @auth wency0
        *seachUsers({ payload }, { call, put }) {
            let data = null;
            try {
                data = yield call(auditService.seachUsers, payload);
                yield put({
                    type: 'saveUsers',
                    payload: {
                        users: data.data
                    }
                });
            } catch (e) {
                message.info('网络错误，请稍后再试！');
            }
        },
        //邀请评分人请求 @parm String email,@parm Integer eventId
        //@auth wency0
        *sendInvite({ payload }, { call, put }) {
            auditService
                .sendInvite(payload)
                .then(function() {
                    return message.success(
                        ' 已向' + payload.email + '发送评审邀请',
                        3
                    );
                })
                .catch(e => {
                    return message.error('邀请失败，请稍后重试', 3);
                })
                .finally(
                    yield put({
                        type: 'isShow',
                        payload: {
                            showInviteCard: 'hidden'
                        }
                    })
                );
        },

        *getAuditMsg({ payload = {} }, { call, put, select }) {
            try {
                // 保存查询条件
                const { dataQueryParams } = yield select(_ => _.audit);
                yield put({
                    type: 'changeDataQueryParams',
                    payload: {
                        dataQueryParams: { ...dataQueryParams, ...payload }
                    }
                });
                const { dataQueryParams: query } = yield select(_ => _.audit);
                let data = yield call(auditService.getAuditMsg, query);
                let listData = data.data;
                let dataContainer = [];
                for (let i in listData) {
                    let itemObj = {};
                    itemObj.isAudit = listData[i].auditDTO.isAudit;
                    itemObj.key = listData[i].eventDTO.id;
                    itemObj.title = listData[i].eventDTO.reexaminationFlag
                        ? listData[i].eventDTO.title + '（复议）'
                        : listData[i].eventDTO.title;
                    itemObj.type =
                        listData[i].eventDTO.type === 0
                            ? '加分成就'
                            : '减分成就';
                    itemObj.responsibleUserName =
                        listData[i].eventDTO.responsibleUserName;
                    itemObj.reprotUserName = listData[i].eventDTO.reportUserName
                        ? listData[i].eventDTO.reportUserName
                        : '匿名';
                    itemObj.createAt = formatDate(
                        'yyyy.MM.dd hh:mm',
                        new Date(listData[i].eventDTO.createAt)
                    );
                    itemObj.progress =
                        listData[i].auditDTO.current +
                        '/' +
                        listData[i].auditDTO.total;
                    itemObj.score = listData[i].auditDTO.isAudit ? (
                        <Grade
                            style={{
                                color: '#333333',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                            content="已评"
                        />
                    ) : (
                        <Grade
                            style={{
                                color: '#F18D55',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                            content="评分"
                        />
                    );
                    dataContainer.push(itemObj);
                }

                if (data.success) {
                    yield put({
                        type: 'tableData',
                        payload: {
                            data: dataContainer,
                            loading: false,
                            pagination: {
                                showQuickJumper: true,
                                pageSize: 8,
                                total: data.total,
                                current: payload.currentPage
                            },
                            unAuditId: payload.searchId,
                            unStartDate: payload.startDate
                        }
                    });
                }
            } catch (error) {
                message.error('网络异常，请稍后重试', 3);
                yield put({
                    type: 'errLoading',
                    payload: {
                        loading: false
                    }
                });
            }
        },
        // 以评审初始数据
        *fetch_getHasAuditedData({ payload = {} }, { call, put, select }) {
            try {
                // 每次请求更新状态
                // yield put({
                //     type: '_updatedLoading',
                //     payload: {
                //         _loading: true,
                //         _currenPage: hasAuditedObj.pageNum,
                //         _chooseDate: hasAuditedObj.startDate,
                //         _searchId: hasAuditedObj.searchId,
                //         _scores: hasAuditedObj.scores
                //     }
                // });
                const { auditedDataQueryParams } = yield select(_ => _.audit);
                yield put({
                    type: 'changeAuditedDataQueryParams',
                    payload: {
                        auditedDataQueryParams: {
                            ...auditedDataQueryParams,
                            ...payload
                        }
                    }
                });
                const { auditedDataQueryParams: query } = yield select(
                    _ => _.audit
                );
                const data = yield call(auditService._getData, query);
                if (data.success) {
                    let newDataArr = data.data.map((ele, index) => {
                        return {
                            key: index,
                            eventID: ele.eventDTO.id,
                            title: ele.eventDTO.reexaminationFlag
                                ? ele.eventDTO.title + '（复议）'
                                : ele.eventDTO.title,
                            type:
                                ele.eventDTO.type === 0
                                    ? '加分成就'
                                    : '减分成就',
                            responsibleUserName:
                                ele.eventDTO.responsibleUserName,
                            reportUserName: ele.eventDTO.reportUserName
                                ? ele.eventDTO.reportUserName
                                : '匿名',
                            createAt: formatDate(
                                'yyyy.MM.dd hh:mm',
                                new Date(ele.eventDTO.createAt)
                            ),
                            progress: `${ele.auditDTO.current}/${
                                ele.auditDTO.total
                            }`,
                            score: ele.eventDTO.score
                        };
                    });
                    yield put({
                        type: '_getHasAuditedData',
                        payload: {
                            _hasAuditedData: newDataArr,
                            _total: data.total,
                            _loading: false,
                            auditedDataPagination: {
                                showQuickJumper: true,
                                pageSize: 8,
                                total: data.total,
                                current: payload.currentPage || 1
                            }
                        }
                    });
                } else {
                    message.error('网络异常，请稍后重试', 3);
                    yield put({
                        type: '_errLoading',
                        payload: {
                            _loading: false
                        }
                    });
                }
            } catch (error) {
                message.error('网络异常，请稍后重试', 3);
                yield put({
                    type: '_errLoading',
                    payload: {
                        _loading: false
                    }
                });
            }
        },
        // 获取已审结成就信息
        *fetch_getHasAuditedEvent(
            {
                payload: { eventID }
            },
            { call, put }
        ) {
            try {
                const data = yield call(
                    auditService._getHasAuditedEvent,
                    eventID
                );
                let source = {
                    type: data.type,
                    title: data.title,
                    witnesses: data.witnesses,
                    createdAt: data.createdAt,
                    reportUser: data.reportUser,
                    responsibleUser: data.responsibleUser,
                    file: data.file,
                    description: data.description,
                    reexaminationList: data.reexaminationList,
                    score: data.score,
                    id: data.id
                };
                yield put({
                    type: '_getHasAuditedEvent',
                    payload: {
                        _hasAEventauditResultList: data.auditResultList,
                        _hasAEventMessage: source
                    }
                });
                yield put({
                    type: '_showHasAuditedDetails',
                    payload: { _showHasAuditedDetails: true }
                });
            } catch (error) {
                message.error('网络异常，请稍后重试', 3);
            }
        },
        // 获取未评审成就信息
        *fetch_getUnAuditedEvent(
            {
                payload: { eventID, isAudit }
            },
            { call, put }
        ) {
            try {
                const data = yield call(
                    auditService._getHasAuditedEvent,
                    eventID
                );
                // console.log(data)
                if (data) {
                    let source = {
                        type: data.type,
                        title: data.title,
                        witnesses: data.witnesses,
                        createdAt: data.createdAt,
                        reportUser: data.reportUser,
                        responsibleUser: data.responsibleUser,
                        file: data.file,
                        description: data.description,
                        reexaminationList: data.reexaminationList,
                        score: data.score,
                        id: data.id
                    };
                    yield put({
                        type: '_getUnAuditedEvent',
                        payload: {
                            _UnAEventauditResultListPro: data.auditResultList,
                            _UnAEventauditResultList: data.auditResultList,
                            _UnAEventMessage: source,
                            _isAudit: isAudit,
                            _checkboxState: [false, false, false, false, false],
                            _switchEdie: true
                        }
                    });
                    yield put({
                        type: '_showUnAuditedDetails',
                        payload: { _showUsAuditedDetails: true }
                    });
                }
            } catch (error) {
                message.error('网络异常，请稍后重试', 3);
            }
        },
        // 提交
        *submitAudited(
            {
                payload: { obj }
            },
            { call, put }
        ) {
            try {
                const data = yield call(auditService._submitAudited, obj);
                if (data) {
                    if (data.success) {
                        message.info('提交成功');
                        yield put({
                            type: 'fetch_getUnAuditedEvent',
                            payload: {
                                eventID: obj.eventId,
                                isAudit: true
                            }
                        });
                        yield put({
                            type: 'changeSubmit',
                            payload: {
                                _isSubmit: { submited: true, count: 1 }
                            }
                        });
                    }
                }
            } catch (error) {
                message.error('网络异常，请稍后重试', 3);
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/audit') {
                    dispatch({
                        type: 'getAuditMsg',
                        payload: {
                            // auditStatus: '',
                            pageNum: 1,
                            pageRow: 8,
                            // startDate: currentTime().replace('/', '-'),
                            // startDate: '',
                            // searchId: '',
                            // endDate: '',
                            // _showUsAuditedDetails: false,
                            currentPage: 1
                        }
                    });
                    dispatch({
                        type: 'changeTime',
                        payload: {
                            selectDate: currentTime(),
                            loading: true,
                            isAudit: ''
                        }
                    });
                }
            });
        },
        _hiddenHasAuditedDetails({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname !== '/audit/hasAudit') {
                    dispatch({
                        type: '_showHasAuditedDetails',
                        payload: {
                            // _chooseDate: formatDate('yyyy-MM', new Date()),
                            _chooseDate: '',
                            _showHasAuditedDetails: false,
                            _searchId: '',
                            _scores: []
                        }
                    });
                }
            });
        }
    }
};
