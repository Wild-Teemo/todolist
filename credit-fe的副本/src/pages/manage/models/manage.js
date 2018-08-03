import * as manageServices from '../services/manage';
import { message } from 'antd';
message.config({
    top: '90%',
    duration: 3,
    maxCount: 1
});

export default {
    namespace: 'manage',
    state: {
        isEditor: '编辑',
        showPlus: false,
        showModal: false,
        showMsg: 'init',
        showDelete: 'init',
        showManager: false,
        auditUser: [],
        addAuditMsg: []
    },
    reducers: {
        editor(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        addManager(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        showModal(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        search(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        showSearchManager(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        addAuditUser(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        addAuditMsg(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects: {
        *getAuditUser({ payload }, { put, call }) {
            try {
                let data = yield call(manageServices.getAuditUser);
                let newData = data.data;
                newData.unshift({ id: 'add' });
                yield put({
                    type: 'addAuditUser',
                    payload: { auditUser: newData, ...payload }
                });
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        },
        *deleteAuditUser({ payload }, { call, put }) {
            try {
                yield call(manageServices.deleteAuditUser, payload);
                yield put({ type: 'getAuditUser', payload: '' });
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        },
        *addAuditUsers({ payload }, { call, put }) {
            try {
                yield call(manageServices.addAuditUser, payload);
                yield put({ type: 'getAuditUser', payload: '' });
                yield put({
                    type: 'showSearchManager',
                    payload: { showManager: false }
                });
                yield put({ type: 'showModal', payload: { showModal: false } });
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/manage') {
                    dispatch({ type: 'getAuditUser', payload: '' });
                } else {
                    dispatch({
                        type: 'editor',
                        payload: {
                            isEditor: '编辑',
                            showPlus: false,
                            showModal: false,
                            showMsg: 'init',
                            showDelete: 'init',
                            showManager: false,
                            addAuditMsg: []
                        }
                    });
                }
            });
        }
    }
};
