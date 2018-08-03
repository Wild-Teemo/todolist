import React from 'react';
import style from './index.css';
import { connect } from 'dva';
import SearchResultContainer from './components/SearchResultContainer';
import { message } from 'antd';

const pageIndex = ({
    match,
    location,
    dispatch,
    score,
    searchKey,
    keyword,
    selectedName,
    memberList,
    eventsListAdd,
    eventsListMinus,
    selecedAddEvent,
    selecedMinusEvent,
    scoreListAdd,
    scoreListMinus,
    searchBarFlag,
    isInitRouteAdd,
    isInitRouteMinus,
    reFlag
}) => {
    message.config({
        top: '90%',
        duration: 3,
        maxCount: 1
    });
    const keyPressHandler = e => {
        if (e.key === 'Enter') {
            if (e.target['value'] === '' && memberList.length === 0) {
                dispatch({
                    type: 'search/save',
                    payload: {
                        memberList: [],
                        eventsListAdd: [],
                        eventsListMinus: []
                    }
                });
            } else if (e.target['value'] === '' && memberList.length !== 0) {
                message.error('请输入姓名进行查询');
            } else {
                searchKey = e.target['value'];
                dispatch({
                    type: 'search/fetchBysearchKey',
                    payload: { searchKey }
                });
                dispatch({
                    type: 'search/saveItemflag',
                    payload: { reFlag: false }
                });
                dispatch({
                    type: 'search/saveSearchBarFlag',
                    payload: { searchBarFlag: false }
                });
            }
        }
    };

    const clickitemhandler = e => {
        let p = e.target;
        while (p.tagName !== 'DIV') {
            p = p.parentNode;
        }
        let keyword = p.dataset.id;
        selectedName = memberList.filter(function(value) {
            if (value.id === keyword) {
                return true;
            }
            return false;
        });
        dispatch({
            type: 'search/fetchEventAdd',
            payload: { keyword, selectedName }
        });
        dispatch({
            type: 'search/fetchEventMinus',
            payload: { keyword }
        });
        dispatch({
            type: 'search/saveItemflag',
            payload: { reFlag: true }
        });
        dispatch({
            type: 'search/saveCurrentMsg',
            payload: { keyword: keyword, selectedName: selectedName }
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
                type: 'search/saveSelectedAdd',
                payload: { selecedAddEvent: arrList, scoreListAdd: checkedList }
            });
        } else {
            dispatch({
                type: 'search/saveSelectedMinus',
                payload: {
                    selecedMinusEvent: arrList,
                    scoreListMinus: checkedList
                }
            });
        }
    };

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
            type: 'search/saveSelectedAdd',
            payload: { selecedAddEvent: arrAdd1, scoreListAdd: checkedList }
        });
        dispatch({
            type: 'search/changeInitRoute',
            payload: { isInitRouteAdd: 1 }
        });
    };

    const filtrateMinus = checkedList => {
        let score = checkedList.join(',');
        let arrAdd2 = eventsListMinus.filter(val => {
            if (score.indexOf(val.score.toString()) !== -1) {
                return true;
            } else {
                return false;
            }
        });
        dispatch({
            type: 'search/saveSelectedMinus',
            payload: { selecedMinusEvent: arrAdd2, scoreListMinus: checkedList }
        });
        dispatch({
            type: 'search/changeInitRoute',
            payload: { isInitRouteMinus: 1 }
        });
    };

    let submitDone = () => {
        if (isInitRouteAdd === 1) {
            dispatch({
                type: 'search/fetchEventAdd',
                payload: { keyword, selectedName }
            }).then(res => {
                publicFilter(scoreListAdd, res, 1);
            });
        } else {
            dispatch({
                type: 'search/fetchEventAdd',
                payload: { keyword, selectedName }
            });
        }

        if (isInitRouteMinus === 1) {
            dispatch({
                type: 'search/fetchEventMinus',
                payload: { keyword }
            }).then(res => {
                publicFilter(scoreListMinus, res, 0);
            });
        } else {
            dispatch({
                type: 'search/fetchEventMinus',
                payload: { keyword }
            });
        }
    };

    return (
        <div className={style.searchPanel}>
            <SearchResultContainer
                clickitemhandler={clickitemhandler}
                dataMember={memberList}
                eventsListAdd={eventsListAdd}
                eventsListMinus={eventsListMinus}
                filtrateAdd={filtrateAdd}
                filtrateMinus={filtrateMinus}
                selecedAddEvent={selecedAddEvent}
                selecedMinusEvent={selecedMinusEvent}
                scoreListAdd={scoreListAdd}
                scoreListMinus={scoreListMinus}
                keyPressHandler={keyPressHandler}
                searchBarFlag={searchBarFlag}
                reFlag={reFlag}
                submitDone={submitDone}
            />
        </div>
    );
};

function mapStateToProps(state) {
    const {
        score,
        searchKey,
        memberList,
        eventsListAdd,
        eventsListMinus,
        selecedAddEvent,
        selecedMinusEvent,
        scoreListAdd,
        scoreListMinus,
        selectedName,
        keyword,
        searchBarFlag,
        isInitRouteAdd,
        isInitRouteMinus,
        reFlag
    } = state.search;
    return {
        score,
        searchKey,
        memberList,
        eventsListAdd,
        eventsListMinus,
        selecedAddEvent,
        selecedMinusEvent,
        scoreListAdd,
        scoreListMinus,
        selectedName,
        keyword,
        reFlag,
        searchBarFlag,
        isInitRouteAdd,
        isInitRouteMinus,
        loading: state.loading.models.search
    };
}

export default connect(mapStateToProps)(pageIndex);
