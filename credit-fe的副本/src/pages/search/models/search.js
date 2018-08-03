import * as searchService from '../services/search';
import { message } from 'antd';
message.config({
    top: '90%',
    duration: 3,
    maxCount: 1
});

export default {
    namespace: 'search',
    state: {
        memberList: [],
        eventsListAdd: [],
        eventsListMinus: [],
        selecedAddEvent: [],
        selecedMinusEvent: [],
        scoreListAdd: [],
        scoreListMinus: [],
        searchBarFlag: true,
        reFlag: false,
        keyword: null,
        selectedName: null,
        isInitRouteAdd: 0,
        isInitRouteMinus: 0
    },
    reducers: {
        save(
            state,
            {
                payload: { memberList, eventsListAdd, eventsListMinus }
            }
        ) {
            return { ...state, memberList, eventsListAdd, eventsListMinus };
        },
        saveAdd(
            state,
            {
                payload: { memberList, eventsListAdd, selecedAddEvent }
            }
        ) {
            return { ...state, memberList, eventsListAdd, selecedAddEvent };
        },
        saveMinus(
            state,
            {
                payload: { eventsListMinus, selecedMinusEvent }
            }
        ) {
            return { ...state, eventsListMinus, selecedMinusEvent };
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
        saveItemflag(
            state,
            {
                payload: { reFlag }
            }
        ) {
            return { ...state, reFlag };
        },
        saveSearchBarFlag(
            state,
            {
                payload: { searchBarFlag }
            }
        ) {
            return { ...state, searchBarFlag };
        },
        saveCurrentMsg(state, action) {
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
        *fetchBysearchKey({ payload: searchKey }, { call, put }) {
            try {
                const { data } = yield call(searchService.fetchMember, {
                    searchKey
                });
                if (data === undefined || data === null || data === []) {
                    yield put({
                        type: 'save',
                        payload: {
                            memberList: [],
                            eventsListAdd: [],
                            eventsListMinus: []
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            memberList: data.sort((a, b) =>
                                a.name.localeCompare(b.name, 'zh-Hans-CN', {
                                    sensitivity: 'accent'
                                })
                            ),
                            eventsListAdd: [],
                            eventsListMinus: []
                        }
                    });
                }
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        },
        *fetchEventAdd(
            {
                payload: { keyword = '', selectedName }
            },
            { call, put }
        ) {
            try {
                const { data } = yield call(searchService.fetchEventAdd, {
                    keyword
                });
                if (data) {
                    if (data) {
                        yield put({
                            type: 'saveAdd',
                            payload: {
                                eventsListAdd: data,
                                memberList: selectedName,
                                selecedAddEvent: data
                            }
                        });
                    }
                    return data;
                }
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        },
        *fetchEventMinus(
            {
                payload: { keyword = '' }
            },
            { call, put }
        ) {
            try {
                const { data } = yield call(searchService.fetchEventMinus, {
                    keyword
                });
                if (data) {
                    if (data) {
                        yield put({
                            type: 'saveMinus',
                            payload: {
                                eventsListMinus: data,
                                selecedMinusEvent: data
                            }
                        });
                    }
                    return data;
                }
            } catch (error) {
                message.info('网络错误，请稍后再试！');
            }
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/search') {
                    dispatch({
                        type: 'saveItemflag',
                        payload: { reFlag: false }
                    });
                    dispatch({
                        type: 'saveSearchBarFlag',
                        payload: { searchBarFlag: true }
                    });
                }
            });
        }
    }
};
