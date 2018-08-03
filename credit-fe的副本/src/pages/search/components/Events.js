import { Row, Col, Table } from 'antd';
import React from 'react';
import style from '../components/components.css';

import dataBlank from '../../../assets/images/dataBlank.png';
import dataBlank2 from '../../../assets/images/dataBlank2.png';
import { connect } from 'dva';

import request from '../../../utils/request';
import ModalEvent from '../../myCredit/components/ModalEvent';
import UnAauditModal from '../../myCredit/components/addUnAuditedDetails';
import AauditModal from '../../myCredit/components/addHasAuditedDetails';
import AuditForm from '../../myCredit/components/addAuditForm';

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectRecord: {},
            visible: false,
            currentRow: null,
            aboutMeSort: {},
            achieveSort: {}
        };
        this.submitIpt = this.submitIpt.bind(this);
    }
    // 是否提交
    changeSubmit = bool => {
        this.props.dispatch({
            type: 'myEvents/changeSubmit',
            payload: { _isSubmit: bool }
        });
    };
    // 编辑
    handleEdit = () => {
        let userId = JSON.parse(sessionStorage.user).id;
        let list = [];
        this.props._UnAEventauditResultList.forEach(e => {
            list.push(JSON.parse(JSON.stringify(e)));
        });
        let ttlist = list[list.length - 1].auditRecordList;
        let checkly = [false, false, false, false, false];
        if (this.props._switchEdie) {
            ttlist.forEach(e => {
                let id = e.auditUser ? e.auditUser.id : '';
                if (userId === id) {
                    e._isEdit = true;
                    checkly[e.score - 1] = true;
                    list[list.length - 1]._canEdit = true;
                }
            });
            this.props.dispatch({
                type: 'myEvents/_addUnAuditedEvent',
                payload: {
                    _UnAEventauditResultList: list,
                    _checkboxState: checkly,
                    _switchEdie: !this.props._switchEdie // 切换编辑状态
                }
            });
        } else {
            // 取消编辑 重新获取成就信息
            this.props.dispatch({
                type: 'myEvents/fetch_getUnAuditedEvent',
                payload: {
                    eventID: list[list.length - 1].eventId,
                    isAudit: true
                }
            });
        }
    };
    // 评分单选按钮
    getSource = (source, check, index) => {
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
        this.props._UnAEventauditResultList.forEach(e => {
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
        this.props.dispatch({
            type: 'myEvents/_addUnAuditedEvent',
            payload: {
                _checkboxState: checkly
            }
        });
        // 异步处理闪烁
        setTimeout(() => {
            this.props.dispatch({
                type: 'myEvents/_addUnAuditedEvent',
                payload: {
                    _UnAEventauditResultList: newList
                }
            });
        }, 120);
    };
    // 提交评分结果
    submitIpt = obj => {
        this.props
            .dispatch({
                type: 'myEvents/submitAudited',
                payload: { obj }
            })
            .then(e => {
                this.props.submitDone();
            });
    };
    // 隐藏详情 提交
    cancelModal = () => {
        this.props.dispatch({
            type: 'myEvents/UnAcancelModal',
            payload: {
                _showUsAuditedDetails: !this.props._showUsAuditedDetails
            }
        });
    };
    cancelModal1 = () => {
        this.props.dispatch({
            type: 'myEvents/UnAcancelModal',
            payload: {
                _showHasAuditedDetails: !this.props._showHasAuditedDetails
            }
        });
    };
    // 邀请
    inviteAudit = id => {
        this.props.dispatch({
            type: 'myEvents/isShow',
            payload: { showInviteCard: '', eventId: id }
        });
    };
    showModelHandler = row => {
        request(`/credit/event/${row.id}`).then(result => {
            this.setState(
                {
                    visible: true,
                    selectRecord: result,
                    currentRow: row
                },
                () => {
                    try {
                        if (this.props.searchTable) {
                            // let loginUser = JSON.parse(sessionStorage.user);
                            var isAudit = 1;
                            let isHas;
                            let lastData = this.state.selectRecord
                                .auditResultList[
                                    this.state.selectRecord.auditResultList.length -
                                    1
                                ];
                            for (
                                var i = 0;
                                i < lastData.auditRecordList.length;
                                i++
                            ) {
                                if (
                                    // lastData.auditRecordList[i].auditUser.id ===
                                    // loginUser.id &&
                                    lastData.auditRecordList[i].score === 0
                                ) {
                                    isAudit = false;
                                    isHas = true;
                                    break;
                                } else if (
                                    // lastData.auditRecordList[i].auditUser.id ===
                                    // loginUser.id &&
                                    lastData.auditRecordList[i].score > 0
                                ) {
                                    isAudit = true;
                                    isHas = true;
                                    break;
                                } else {
                                    isHas = false;
                                }
                            }
                            if (this.state.selectRecord.score === 0 && isHas) {
                                this.props.dispatch({
                                    type: 'myEvents/fetch_getUnAuditedEvent',
                                    payload: { eventID: row.id, isAudit }
                                });
                            } else {
                                this.props.dispatch({
                                    type: 'myEvents/fetch_getHasAuditedEvent',
                                    payload: { eventID: row.id }
                                });
                            }
                        }
                    } catch (error) {
                        new Error(error);
                    }
                }
            );
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    postDone = () => {
        this.props.postDone();
        this.showModelHandler(this.state.currentRow);
    };

    // 我的成就排序成就
    handleTableChange = (pagination, filters, sorter = {}) => {
        this.setState({
            achieveSort: sorter
        });
    };

    // 与我相关排序成就
    handleSelfTableChange = (pagination, filters, sorter = {}) => {
        this.setState({
            aboutMeSort: sorter
        });
    };
    render() {
        const columns = [
            {
                title: '我的成就',
                dataIndex: 'title',
                key: 'title',
                width: '55%'
            },
            {
                title: '评分结果',
                dataIndex: 'score',
                key: 'score',
                sorter: (a, b) => a.score - b.score,
                sortOrder: this.state.achieveSort.order,
                width: '45%',
                render: text => {
                    if (+text === -2) return '未评分';
                    if (+text === -1) return '已失效';
                    return text;
                }
            }
        ];

        const arrTest = [
            {
                key: 1,
                title: (
                    <div className={style.centerBlankBox}>
                        <img src={dataBlank} alt="暂时没有数据" />
                        <p>暂无内容</p>
                    </div>
                ),
                result: '23'
            }
        ];

        if (this.props.addList.length === 0) {
            return (
                <div className={style.centerBlankContainer}>
                    <div className={style.centerBlankBox}>
                        <div className={style.imgBox}>
                            <img
                                className={style.imgBlock}
                                src={dataBlank2}
                                alt="暂无内容"
                            />
                            <p className={style.noDataHint}>暂时没有内容</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className={
                        this.props.searchTable === true
                            ? style.marginTop
                            : style.marginTop50
                    }
                >
                    <Row
                        gutter={32}
                        span={20}
                        className={style.eventDetails}
                        justify="end"
                    >
                        <Col className="gutter-row" span={24} offset={0}>
                            {this.props.addList.length === 0 ? (
                                <div className={style.tableBackground}>
                                    <Table
                                        columns={columns}
                                        dataSource={arrTest}
                                        pagination={false}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={
                                        this.props.searchTable === true
                                            ? style.tableBackground2
                                            : style.tableBackground
                                    }
                                >
                                    <Table
                                        onChange={this.handleTableChange}
                                        className={style.test}
                                        columns={columns}
                                        dataSource={this.props.addList}
                                        pagination={false}
                                        rowClassName={(record, index) =>
                                            index % 2 === 0
                                                ? 'rowClass'
                                                : 'rowClass2'
                                        }
                                        scroll={
                                            this.props.addList.length < 11
                                                ? { x: false }
                                                : { y: 480 }
                                        }
                                        onRow={record => {
                                            return {
                                                onClick: () => {
                                                    this.showModelHandler(
                                                        record
                                                    );
                                                } // 点击行
                                            };
                                        }}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                    {this.props.searchTable ? (
                        this.state.selectRecord.score === 0 &&
                        this.props._showUsAuditedDetails ? (
                                <UnAauditModal
                                    getSource={this.getSource}
                                    allSources={{
                                        eventData: this.props._UnAEventMessage,
                                        auditResultList: this.props
                                            ._UnAEventauditResultList
                                    }}
                                    userIsAudit={this.props._isAudit}
                                    cancelModal={this.cancelModal}
                                    checkboxState={this.props._checkboxState}
                                    submitIpt={this.submitIpt}
                                    inviteAudit={this.inviteAudit}
                                    handleEdit={this.handleEdit}
                                    isShowModal={this.props._showUsAuditedDetails}
                                    switchEdie={this.props._switchEdie}
                                    changeSubmit={this.changeSubmit}
                                    isChecked={this.props._isSubmit}
                                    UnAEventauditResultListPro={
                                        this.props._UnAEventauditResultListPro
                                    }
                                />
                            ) : (
                                <AauditModal
                                    allSources={{
                                        eventData: this.props._hasAEventMessage,
                                        auditResultList: this.props
                                            ._hasAEventauditResultList
                                    }}
                                    cancelModal={this.cancelModal1}
                                    isShowModal={this.props._showHasAuditedDetails}
                                />
                            )
                    ) : (
                        <ModalEvent
                            visible={this.state.visible}
                            source={this.state.selectRecord}
                            onCancel={this.handleCancel}
                            postDone={this.postDone}
                        />
                    )}
                    <AuditForm />
                </div>
            );
        }
    }
}

// export default MyEvents;

function mapStateToProps(state) {
    return { ...state.myEvents };
}

export default connect(mapStateToProps)(Events);
