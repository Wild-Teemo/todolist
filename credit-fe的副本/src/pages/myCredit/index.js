import React from 'react';
import MyEvents from './components/MyEvents';
import { connect } from 'dva';

const pageIndex = ({
    match,
    location,
    dispatch,
    // selecedAddEvent,
    // selecedMinusEvent,   // 删除：减分成就
    eventsListMinus,
    scoreListAdd,
    scoreListMinus,
    isInitRouteAdd,
    isInitRouteMinus,

    eventsListAdd, // 加分成就 数据
    eventsAboutMeAdd // 与我相关的成就 数据
}) => {
    const filtrateAdd = checkedList => {
        let score = checkedList.join(',');
        let arrAdd1 = eventsListAdd.filter(val => {
            if (score.indexOf(val.score.toString()) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        dispatch({
            type: 'myEvents/saveSelectedAdd',
            payload: { selecedAddEvent: arrAdd1, scoreListAdd: checkedList }
        });
        dispatch({
            type: 'myEvents/changeInitRoute',
            payload: { isInitRouteAdd: 1 }
        });
    };

    // 删除 过滤减分成就的逻辑
    // const filtrateMinus = checkedList => {
    //     let score = checkedList.join(',');
    //     let arrAdd2 = eventsListMinus.filter(val => {
    //         if (score.indexOf(val.score.toString()) !== -1) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //     dispatch({
    //         type: 'myEvents/saveSelectedMinus',
    //         payload: { selecedMinusEvent: arrAdd2, scoreListMinus: checkedList }
    //     });
    //     dispatch({
    //         type: 'myEvents/changeInitRoute',
    //         payload: { isInitRouteMinus: 1 }
    //     });
    // };

    let publicFilter = (checkedList, data, type) => {
        let score = checkedList.join(',');
        let arrList = data.filter(val => {
            if (score.indexOf(val.score.toString()) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        if (type === 1) {
            dispatch({
                type: 'myEvents/saveSelectedAdd',
                payload: { selecedAddEvent: arrList, scoreListAdd: checkedList }
            });
        } else {
            dispatch({
                type: 'myEvents/saveSelectedMinus',
                payload: {
                    selecedMinusEvent: arrList,
                    scoreListMinus: checkedList
                }
            });
        }
    };

    let postDone = () => {
        if (isInitRouteAdd === 1) {
            dispatch({
                type: 'myEvents/fetchEventAdd',
                payload: {}
            }).then(res => {
                publicFilter(scoreListAdd, res, 1);
            });
        } else {
            dispatch({
                type: 'myEvents/fetchEventAdd',
                payload: {}
            });
        }

        if (isInitRouteMinus === 1) {
            dispatch({
                type: 'myEvents/fetchEventMinus',
                payload: {}
            }).then(res => {
                publicFilter(scoreListMinus, res, 0);
            });
        } else {
            dispatch({
                type: 'myEvents/fetchEventMinus',
                payload: {}
            });
        }
    };

    return (
        <div
            className="card-container"
            style={{ marginTop: 25, padding: '0 50px' }}
        >
            <MyEvents
                filtrateAdd={filtrateAdd}
                // filtrateMinus={filtrateMinus} // 删除 减分成就逻辑
                // selectedAddlist={selecedAddEvent}    // 删除 过滤之后的加分成就
                // selectedMinuslist={selecedMinusEvent} // 删除 减分成就逻辑
                minusList={eventsListMinus}
                dispatch={dispatch}
                scoreAdd={scoreListAdd}
                scoreMinus={scoreListMinus}
                searchTable={false}
                postDone={postDone}
                isInitRouteAdd={isInitRouteAdd}
                isInitRouteMinus={isInitRouteMinus}
                eventsListAdd={eventsListAdd} // 我的成就 *数据
                eventsAboutMeAdd={eventsAboutMeAdd} // 与我相关的成就 *数据
            />
        </div>
    );
};
function mapStateToProps(state) {
    const {
        eventsListAdd,
        // eventsListMinus,
        selecedAddEvent,
        selecedMinusEvent,
        scoreListAdd,
        scoreListMinus,
        isInitRouteAdd,
        isInitRouteMinus
    } = state.myEvents;
    return {
        eventsListAdd,
        // eventsListMinus,
        selecedAddEvent,
        selecedMinusEvent,
        scoreListAdd,
        scoreListMinus,
        isInitRouteAdd,
        isInitRouteMinus,
        loading: state.loading.models.myEvents
    };
}

export default connect(mapStateToProps)(pageIndex);
