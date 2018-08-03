import React from 'react';
import HeaderSearch from './HeaderSearch';
import TablePage from './TablePage';
import { connect } from 'dva';
import AuditForm from './AuditForm';
import UnAuditedDetails from './UnAuditedDetails';

function Unaudited(props) {
    let globalDate = props.selectDate.replace('/', '-');
    let globalId = '';
    let changeSubmit = bool => {
        props.dispatch({
            type: 'audit/changeSubmit',
            payload: { _isSubmit: bool }
        });
    };
    let search = userId => {
        let { selectDate } = { ...props };
        selectDate = selectDate.replace('/', '-');
        globalDate = selectDate;
        globalId = userId;
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: {
                // auditStatus: props.isAudit,
                pageNum: 1,
                // pageRow: 8,
                startDate: selectDate,
                searchId: userId,
                // endDate: '',
                currentPage: 1
            }
        });
    };
    let setGlobalUser = userId => {
        globalId = userId;
        // let { selectDate } = { ...props };
        // selectDate = selectDate.replace('/', '-');
        props.dispatch({
            type: 'audit/changeUnAuditId',
            payload: { unAuditId: userId }
        });
        props.dispatch({
            type: 'audit/changeUnAuditId',
            payload: {
                auditStatus: props.isAudit,
                pageNum: 1,
                pageRow: 8,
                startDate: globalDate,
                searchId: globalId,
                endDate: '',
                currentPage: 1
            }
        });
        if (!userId) userId = '';
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: {
                // auditStatus: props.isAudit,
                pageNum: 1,
                // pageRow: 8,
                // startDate: selectDate,
                searchId: userId,
                // endDate: '',
                currentPage: 1
            }
        });
    };
    let changeTime = selectTime => {
        if (!selectTime) {
            props.dispatch({
                type: 'audit/getAuditMsg',
                payload: {
                    // auditStatus: props.isAudit,
                    pageNum: 1,
                    // pageRow: 8,
                    // searchId: props.unAuditId,
                    // endDate: '',
                    currentPage: 1
                }
            });
        } else {
            selectTime = selectTime.replace('/', '-');
            props.dispatch({
                type: 'audit/changeTime',
                payload: { selectDate: selectTime }
            });
            props.dispatch({
                type: 'audit/getAuditMsg',
                payload: {
                    // auditStatus: props.isAudit,
                    pageNum: 1,
                    // pageRow: 8,
                    startDate: selectTime,
                    // searchId: props.unAuditId,
                    // endDate: '',
                    currentPage: 1
                }
            });
        }
    };
    let pageChange = (currentPage, pager) => {
        props.dispatch({
            type: 'audit/changePagination',
            payload: { pagination: pager, loading: true }
        });
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: {
                // auditStatus: props.isAudit,
                pageNum: currentPage,
                // pageRow: 8,
                // startDate: props.unStartDate,
                // searchId: props.unAuditId,
                // endDate: '',
                currentPage: currentPage
            }
        });
    };
    let cored = grade => {
        if (grade === 2) {
            props.dispatch({
                type: 'audit/clearData',
                payload: {
                    data: [],
                    pagination: {
                        showQuickJumper: true,
                        pageSize: 8,
                        total: 0,
                        current: 1
                    }
                }
            });
            return;
        }
        props.dispatch({
            type: 'audit/changeIsAudit',
            payload: { isAudit: grade, loading: true }
        });
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: {
                auditStatus: grade,
                pageNum: 1,
                pageRow: 8,
                // startDate: globalDate,
                // searchId: props.unAuditId,
                // endDate: '',
                currentPage: 1
            }
        });
    };
    // 隐藏详情 提交
    let cancelModal = () => {
        props.dispatch({
            type: 'audit/UnAcancelModal',
            payload: { _showUsAuditedDetails: !props._showUsAuditedDetails }
        });
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: {
                // auditStatus: props.isAudit,
                // pageNum: props.pagination.current,
                // currentPage: props.pagination.current,
                // pageRow: 8,
                // startDate: props.unStartDate,
                // searchId: props.unAuditId,
                // endDate: ''
            }
        });
    };
    // 显示详情
    let showlModal = record => {
        // 获取成就详情
        props.dispatch({
            type: 'audit/fetch_getUnAuditedEvent',
            payload: { eventID: record.key, isAudit: record.isAudit }
        });
    };
    // 评分单选按钮
    let getSource = (source, check, index) => {
        let newObj = {
            score: source,
            message: '',
            inviterUser: null,
            auditUser: JSON.parse(sessionStorage.user),
            _isEdit: true // 可编辑
        };
        let checkly = [false, false, false, false, false];
        checkly[index] = !checkly[index];
        let newList;
        let list = [];
        props._UnAEventauditResultList.forEach(e => {
            list.push(JSON.parse(JSON.stringify(e)));
        });
        let ttlist = list[list.length - 1].auditRecordList;
        for (let i = ttlist.length - 1; i >= 0; i--) {
            let id = ttlist[i].auditUser ? ttlist[i].auditUser.id : '';
            if (id === newObj.auditUser.id) {
                ttlist.splice(i, 1);
            }
        }
        if (check) {
            list[list.length - 1].auditRecordList.push(newObj);
        } else {
            checkly = [false, false, false, false, false];
        }
        newList = list;
        props.dispatch({
            type: 'audit/_addUnAuditedEvent',
            payload: {
                _checkboxState: checkly
            }
        });
        // 异步处理闪烁
        setTimeout(() => {
            props.dispatch({
                type: 'audit/_addUnAuditedEvent',
                payload: {
                    _UnAEventauditResultList: newList
                }
            });
        }, 120);
    };
    // 提交评分结果
    let submitIpt = obj => {
        props.dispatch({
            type: 'audit/submitAudited',
            payload: { obj }
        });
    };
    // 编辑
    let handleEdit = () => {
        let userId = JSON.parse(sessionStorage.user).id;
        let list = [];
        props._UnAEventauditResultList.forEach(e => {
            list.push(JSON.parse(JSON.stringify(e)));
        });
        let ttlist = list[list.length - 1].auditRecordList;
        let checkly = [false, false, false, false, false];
        if (props._switchEdie) {
            ttlist.forEach(e => {
                let id = e.auditUser ? e.auditUser.id : '';
                if (userId === id) {
                    e._isEdit = true;
                    checkly[e.score - 1] = true;
                    list[list.length - 1]._canEdit = true;
                }
            });
            props.dispatch({
                type: 'audit/_addUnAuditedEvent',
                payload: {
                    _UnAEventauditResultList: list,
                    _checkboxState: checkly,
                    _switchEdie: !props._switchEdie // 切换编辑状态
                }
            });
        } else {
            // 取消编辑 重新获取成就信息
            props.dispatch({
                type: 'audit/fetch_getUnAuditedEvent',
                payload: {
                    eventID: list[list.length - 1].eventId,
                    isAudit: true
                }
            });
        }
    };
    // 邀请
    let inviteAudit = id => {
        props.dispatch({
            type: 'audit/isShow',
            payload: { showInviteCard: '', eventId: id }
        });
    };
    // 表格排序事件
    const handleSortEvent = (pagination = {}, filters, sorter = {}) => {
        const query = {};
        // 换页事件被触发
        const { current } = pagination;
        if (current) {
            query.pageNum = current;
            query.currentPage = current;
        }

        // 排序事件被触发
        const { order, field } = sorter;
        if (field === 'createAt')
            query.sortCreatedAt = order === 'descend' ? 1 : 0;
        if (field === 'type') query.sortType = order === 'descend' ? 1 : 0;
        props.dispatch({
            type: 'audit/getAuditMsg',
            payload: { ...query }
        });
    };
    return (
        <div style={{ position: 'relative' }}>
            <AuditForm />
            <HeaderSearch
                search={search}
                current={props.selectDate}
                changeTime={changeTime}
                globalUserId={setGlobalUser}
            />
            <TablePage
                style={{ marginTop: 20 }}
                pageChange={pageChange}
                pagination={props.pagination}
                data={props.data}
                loading={props.loading}
                cored={cored}
                click={showlModal}
                handleSortEvent={handleSortEvent}
            />
            {props._showUsAuditedDetails && (
                <UnAuditedDetails
                    getSource={getSource}
                    allSources={{
                        eventData: props._UnAEventMessage,
                        auditResultList: props._UnAEventauditResultList
                    }}
                    userIsAudit={props._isAudit}
                    cancelModal={cancelModal}
                    checkboxState={props._checkboxState}
                    submitIpt={submitIpt}
                    inviteAudit={inviteAudit}
                    handleEdit={handleEdit}
                    isShowModal={props._showUsAuditedDetails}
                    switchEdie={props._switchEdie}
                    changeSubmit={changeSubmit}
                    isChecked={props._isSubmit}
                    UnAEventauditResultListPro={
                        props._UnAEventauditResultListPro
                    }
                />
            )}
        </div>
    );
}
function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(Unaudited);
