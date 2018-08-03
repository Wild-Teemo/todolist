import * as formGetData from '../../services/DiscussForm/DiscussForm';
import { message } from 'antd';

message.config({
    top: '90%',
    duration: 3,
    maxCount: 1
});

export default {
    namespace: 'discussForm',

    state: {
        data: []
    },

    subscriptions: {
        setup({ dispatch, history }) {}
    },

    effects: {
        *getCommentList({ payload }, { call, put }) {
            try {
                let data = yield call(formGetData.getCommentList, payload);
                if (data.success) {
                    yield put({
                        type: 'fetching',
                        payload: { data: data.data }
                    });
                }
            } catch (e) {
                message.info('网络错误，请稍后再试！');
            }
        },
        *addComment({ payload }, { call, put }) {
            try {
                yield call(formGetData.addComment, payload);
                let newData = yield call(
                    formGetData.getCommentList,
                    payload.topicId
                );
                if (newData.success) {
                    yield put({
                        type: 'fetching',
                        payload: { data: newData.data }
                    });
                }
            } catch (e) {
                message.info('网络错误，请稍后再试！');
            }
        }
    },

    reducers: {
        fetching(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    }
};
