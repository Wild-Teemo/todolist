import React from 'react';
import MyEvents from './components/MyEvents';
import { connect } from 'dva';

const pageIndex = ({
    match,
    location,
    dispatch,
    selecedAddEvent,
    selecedMinusEvent,
    eventsAboutMeAdd,
    eventsAboutMeMinus,
    scoreListAdd,
    isInitRouteAdd,
    isInitRouteMinus,
    scoreListMinus
}) => {
    const filtrateAddAboutMe = checkedList => {
        let score = checkedList.join(',');
        let arrAdd1 = eventsAboutMeAdd.filter(val => {
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

    const filtrateMinusAboutMe = checkedList => {
        let score = checkedList.join(',');
        let arrAdd2 = eventsAboutMeMinus.filter(val => {
            if (score.indexOf(val.score.toString()) !== -1) {
                return true;
            } else {
                return false;
            }
        });
        dispatch({
            type: 'myEvents/saveSelectedMinus',
            payload: { selecedMinusEvent: arrAdd2, scoreListMinus: checkedList }
        });
    };

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
                type: 'myEvents/fetchAboutMeAdd',
                payload: {}
            }).then(res => {
                publicFilter(scoreListAdd, res, 1);
            });
        } else {
            dispatch({
                type: 'myEvents/fetchAboutMeAdd',
                payload: {}
            });
        }

        if (isInitRouteMinus === 1) {
            dispatch({
                type: 'myEvents/fetchAboutMeMinus',
                payload: {}
            }).then(res => {
                publicFilter(scoreListMinus, res, 0);
            });
        } else {
            dispatch({
                type: 'myEvents/fetchAboutMeMinus',
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
                filtrateAdd={filtrateAddAboutMe}
                filtrateMinus={filtrateMinusAboutMe}
                selectedAddlist={selecedAddEvent}
                selectedMinuslist={selecedMinusEvent}
                addList={eventsAboutMeAdd}
                minusList={eventsAboutMeMinus}
                scoreAdd={scoreListAdd}
                scoreMinus={scoreListMinus}
                searchTable={false}
                postDone={postDone}
                dispatch={dispatch}
            />
        </div>
    );
};
function mapStateToProps(state) {
    const {
        eventsAboutMeAdd,
        eventsAboutMeMinus,
        selecedAddEvent,
        selecedMinusEvent,
        scoreListAdd,
        isInitRouteAdd,
        isInitRouteMinus,
        scoreListMinus
    } = state.myEvents;
    return {
        eventsAboutMeAdd,
        eventsAboutMeMinus,
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
