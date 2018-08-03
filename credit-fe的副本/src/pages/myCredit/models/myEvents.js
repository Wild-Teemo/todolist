import * as myEventsServices from '../services/myEvents';
import * as auditService from '../../audit/services/audit';
import { message } from 'antd';
message.config({
    top: '90%',
    duration: 3,
    maxCount: 2
});

// eventsListAdd 我的成就 源数据
// eventsAboutMeAdd 与我相关的成就 源数据

sessionStorage.token =
    new URL(window.location).searchParams.get('token') ||
    sessionStorage.token ||
    '';

export default {
    namespace: 'myEvents',
    state: {
        eventsListAdd: [],
        eventsListMinus: [],
        eventsAboutMeAdd: [],
        eventsAboutMeMinus: [],
        selecedAddEvent: [],
        selecedMinusEvent: [],
        scoreListAdd: [],
        scoreListMinus: [],
        //
        _showHasAuditedDetails: false,
        isAudit: '',
        _hasAEventauditResultList: [],
        _hasAEventMessage: {},
        _showUsAuditedDetails: false,
        _UnAEventauditResultList: [],
        _UnAEventMessage: {},
        _isAudit: false,
        _checkboxState: [false, false, false, false, false],
        _switchEdie: true, // 切换编辑状态 true 编辑
        _UnAEventauditResultListPro: [], // 评分进度
        //
        showInviteCard: 'hidden',
        successFlag: 'hidden',
        errorFlag: 'hidden',
        keywords: null,
        eventId: -1,
        email: '',
        users: [],
        _isSubmit: { submited: false, count: 0 },
        isInitRouteAdd: 0,
        isInitRouteMinus: 0
    },
    reducers: {
        saveAdd(
            state,
            {
                payload: { eventsListAdd, selecedAddEvent }
            }
        ) {
            return { ...state, eventsListAdd, selecedAddEvent };
        },
        saveMinus(
            state,
            {
                payload: { eventsListMinus, selecedMinusEvent }
            }
        ) {
            return { ...state, eventsListMinus, selecedMinusEvent };
        },
        saveAboutMeAdd(
            state,
            {
                payload: { eventsAboutMeAdd, selecedAddEvent }
            }
        ) {
            return { ...state, eventsAboutMeAdd, selecedAddEvent };
        },
        saveAboutMeMinus(
            state,
            {
                payload: { eventsAboutMeMinus, selecedMinusEvent }
            }
        ) {
            return { ...state, eventsAboutMeMinus, selecedMinusEvent };
        },
        saveSelectedAdd(
            state,
            {
                payload: { selecedAddEvent, scoreListAdd }
            }
        ) {
            return { ...state, selecedAddEvent, scoreListAdd };
        },
        saveSelectedMinus(
            state,
            {
                payload: { selecedMinusEvent, scoreListMinus }
            }
        ) {
            return { ...state, selecedMinusEvent, scoreListMinus };
        },
        _getUnAuditedEvent(state, action) {
            return { ...state, ...action.payload };
        },
        _showUnAuditedDetails(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        UnAcancelModal(state, action) {
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
        _getHasAuditedEvent(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        _showHasAuditedDetails(state, action) {
            return { ...state, ...action.payload };
        },
        //是否展示邀请评分人卡片@auth wency0//单选某个成就时，给eventId赋值
        isShow(
            state,
            {
                payload: { showInviteCard, eventId }
            }
        ) {
            return { ...state, showInviteCard, eventId };
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
        changeSubmit(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        initAddList(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeInitRoute(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects: {
        // 我的成就
        *fetchEventAdd({ payload }, { call, put }) {
            try {
                const { data } = yield call(
                    myEventsServices.fetchMyAddEvent,
                    {}
                );
                if (data) {
                    yield put({
                        type: 'saveAdd',
                        payload: {
                            eventsListAdd: data, // 加分成就
                            selecedAddEvent: data // 已过滤的加分成就
                        }
                    });
                    return data;
                }
            } catch (error) {
                if (sessionStorage.token !== '') {
                    message.info('网络错误，请稍后再试！', 3);
                }
            }
        },
        *fetchEventMinus({ payload }, { call, put }) {
            try {
                const { data } = yield call(
                    myEventsServices.fetchMyMinusEvent,
                    {}
                );
                if (data) {
                    yield put({
                        type: 'saveMinus',
                        payload: {
                            eventsListMinus: data,
                            selecedMinusEvent: data
                        }
                    });
                    return data;
                }
            } catch (error) {
                if (sessionStorage.token !== '') {
                    message.info('网络错误，请稍后再试！', 3);
                }
            }
        },

        // 与我相关成就
        *fetchAboutMeAdd({ payload }, { call, put }) {
            try {
                const { data } = yield call(
                    myEventsServices.fetchAboutMeAddEvent,
                    {}
                );
                if (data) {
                    yield put({
                        type: 'saveAboutMeAdd',
                        payload: {
                            eventsAboutMeAdd: data, // 与我相关的成就
                            selecedAddEvent: data // 过滤之后的 与我相关的成就
                        }
                    });
                    return data;
                }
            } catch (error) {
                if (sessionStorage.token !== '') {
                    message.info('网络错误，请稍后再试！', 3);
                }
            }
        },
        *fetchAboutMeMinus({ payload }, { call, put }) {
            try {
                const { data } = yield call(
                    myEventsServices.fetchAboutMeMinusEvent,
                    {}
                );
                if (data) {
                    yield put({
                        type: 'saveAboutMeMinus',
                        payload: {
                            eventsAboutMeMinus: data,
                            selecedMinusEvent: data
                        }
                    });
                    return data;
                }
            } catch (error) {
                if (sessionStorage.token !== '') {
                    message.info('网络错误，请稍后再试！', 3);
                }
            }
        },
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
                message.info('网络错误，请稍后再试！', 3);
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
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/myCredit') {
                    dispatch({
                        type: 'fetchEventAdd', // 我的成就
                        payload: {}
                    });
                    dispatch({
                        type: 'fetchAboutMeAdd', // 与我相关的成就（原来应该是 fetchEventMinus 减分成就）
                        payload: {}
                    });
                    dispatch({
                        type: 'initAddList',
                        payload: {
                            scoreListAdd: [],
                            eventsAboutMeAdd: [], // 添加 与我相关的成就
                            selecedAddEvent: [], // 添加 与我相关的成就
                            // scoreListMinus: [], // 删除减分成就
                            // eventsListMinus: [], // 删除减分成就
                            isInitRouteAdd: 0
                        }
                    });
                } else if (pathname === '/myCredit/aboutMe') {
                    dispatch({
                        type: 'fetchEventMinus', // 原来应该是 fetchAboutMeAdd
                        payload: {}
                    });
                    dispatch({
                        type: 'fetchAboutMeMinus',
                        payload: {}
                    });
                    dispatch({
                        type: 'initAddList',
                        payload: {
                            scoreListAdd: [],
                            scoreListMinus: [],
                            eventsAboutMeMinus: [],
                            isInitRouteMinus: 0
                        }
                    });
                }
            });
        }
    }
};
