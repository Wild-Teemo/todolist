import * as eventsService from '../services/events';
import { message } from 'antd';

message.config({
    top: '90%',
    maxCount: 1,
    duration: 3
});

export default {
    namespace: 'events',
    state: {
        list: [],
        total: null,
        page: null,
        score: null,
        keyword: null,
        visible: false,
        partiesEmail: '',
        postType: 0,
        connectEmail: '',
        connectResponsible: '',
        labelEmail: [],
        labelDuty: [],
        fileList: null,
        uploadMsg: '上传文件',
        canSubmitStyle: {
            width: 576,
            height: 48,
            color: '#999',
            border: 'none',
            fontSize: '16px',
            letterSpacing: '4px',
            paddingLeft: '-200px',
            marginLeft: '-200px',
            background: 'linear-gradient(to left,#F6F6F6 , #EBEBEB)',
            boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
            cursor: 'not-allowed'
        },
        allowSubmit: false
    },
    reducers: {
        save(
            state,
            {
                payload: { data: list, total, page, score, keyword }
            }
        ) {
            return { ...state, list, total, page, score, keyword };
        },

        isVisible(state, action) {
            return {
                ...state,
                visible: action.payload
            };
        },
        labelChange(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        canSubmitStyle(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        changeFileList(state, action) {
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
        *fetch(
            {
                payload: { page = 1, score = '0,1,2,3,4', keyword = '', sort }
            },
            { call, put }
        ) {
            let params = '';
            // params += score === '' ? '' : '&score=' + score;
            params += keyword === '' ? '' : '&searchId=' + keyword;
            params += sort ? `&${sort}` : ''; // 排序
            try {
                const { data, total } = yield call(eventsService.fetch, {
                    page,
                    params
                });
                if (data) {
                    yield put({
                        type: 'save',
                        payload: {
                            data: data,
                            total: parseInt(total, 10),
                            page: parseInt(page, 10),
                            score: score,
                            keyword: keyword
                        }
                    });
                }
            } catch (e) {
                message.info('网络错误，请稍后再试！', 3);
            }
        },
        *submitForm({ payload }, { call, put }) {
            try {
                let data = yield call(eventsService.postForm, payload);
                if (data.success) {
                    yield put({ type: 'isVisible', payload: true });
                }
            } catch (e) {
                message.info('网络错误，请稍后再试！', 3);
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/submitEvent/history') {
                    dispatch({ type: 'fetch', payload: query });
                } else if (pathname === '/submitEvent') {
                    dispatch({
                        type: 'labelChange',
                        payload: { labelEmail: [], labelDuty: [] }
                    });
                    dispatch({
                        type: 'labelChange',
                        payload: { fileList: [] }
                    });
                }
            });
        }
    }
};
