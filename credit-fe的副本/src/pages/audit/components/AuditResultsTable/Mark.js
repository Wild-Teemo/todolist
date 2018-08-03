import React from 'react';
import styles from './AuditResultsTable.css';
import { connect } from 'dva';
import { Table, Button, Form, Avatar, message, Input, Modal } from 'antd';
import userImg from '../../../../assets/images/person_avatar.png';
message.config({
    top: '90%',
    duration: 2,
    maxCount: 3
});

// 评论二次确认框
const IssueConfirm = ({ visible, title, width, onClickOk, onClickCancel }) => (
    <Modal
        className={styles.IssueConfirm}
        title={<span className={styles.IssueConfirmTitle}>{title}</span>}
        visible={visible}
        width={width || 515}
        footer={null}
        onCancel={onClickCancel}
        style={{
            top: '20%'
        }}
    >
        <p className={styles.IssueConfirmHeader}>温馨提示</p>
        <p className={styles.IssueConfirmContent}>
            成就系统采用中位数评分，为确保评分质量，
            一旦提交之后不可修改，请再次确认是否提交评分。
        </p>
        <div className={styles.IssueConfirmFooter}>
            <Button
                className={styles.IssueCancelBtn}
                type="primary"
                size={'large'}
                style={{
                    width: '160px',
                    cursor: 'pointer',
                    marginRight: '36px',
                    background:
                        'linear-gradient(180deg,rgba(246,246,246,1),rgba(235,235,235,1))'
                }}
                onClick={onClickOk}
            >
                确定
            </Button>
            <Button
                className="orangeGradient"
                type="primary"
                size={'large'}
                style={{
                    width: '160px'
                }}
                onClick={onClickCancel}
            >
                我再想想
            </Button>
        </div>
    </Modal>
);

class Mark extends React.Component {
    constructor(props) {
        super(props);
        this.detailShow = this.detailShow.bind(this);
    }
    state = {
        checkboxState: this.props._checkboxState,
        chooseScore: -1,
        inData: [],
        isAudit: this.props.source.isAudit,
        detailShow: false,
        isChecked: false,
        submitBtnStatus: true,
        didIssue: false
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setResultScore();
    }
    UNSAFE_componentWillMount() {
        this.setResultScore();
    }

    setResultScore() {
        //判断能否提交评分
        let judges = this.props.source.auditRecordList;
        let resultScore = this.props.source.score; //这次评审的分值（ >=0 中位数, -1评审超时,-2进行中）
        if (resultScore !== -2) {
            //如果这个result不是评审中状态
            this.setState({
                submitBtnStatus: false
            });
        }
        let currAudit = JSON.parse(sessionStorage.user);
        for (let i in judges) {
            //如果当前评委已经评论过
            //-1表示未完成(评审中) >=0表示已评分
            if (!judges[i].auditUser) continue;
            if (
                currAudit.id === judges[i].auditUser.id &&
                judges[i].score >= 0
            ) {
                this.setState({
                    submitBtnStatus: false
                });
            }
        }
    }

    // 计算表名
    tableTitle = (length, index) => {
        if (length === 1) return <span>评分结果</span>;
        else {
            if (index === 0) return <span>初审结果</span>;
            else return <span>复议结果</span>;
        }
    };
    detailShow(bool) {
        this.setState({
            ...this.state,
            detailShow: bool
        });
    }
    // 计算标题
    changeTitle = (type, score) => {
        let lyList;
        //-2表示未完成（评分中），-1表示无效(超时) >=0表示已评分
        this.props.UnAEventauditResultListPro.forEach(e => {
            /*if (e.score === 0) */ lyList = e.auditRecordList;
        });
        let hasAudit = 0;
        if (lyList) {
            lyList.forEach(e => {
                if (e.score >= 0) hasAudit++;
            });
        }
        let hasAuditLY = [];
        let unAuditLY = [];
        let ele;
        // console.log(lyList);
        lyList.forEach((e, i) => {
            if (!e.auditUser) {
                e.auditUser = {};
            }
            ele = (
                <div className={styles.popoverUluser} key={i}>
                    <Avatar
                        size={'large'}
                        style={{ border: '1px solid #D7D7D7' }}
                        src={e.auditUser.avatar ? e.auditUser.avatar : userImg}
                    />
                    <div className={styles.popoverUlName}>
                        {e.auditUser.name ? e.auditUser.name : '* * *'}
                        {e.inviterUser && e.inviterUser !== null ? (
                            <span style={{ whiteSpace: 'nowrap' }}>
                                ({`${e.inviterUser.name}邀请`})
                            </span>
                        ) : null}
                    </div>
                </div>
            );
            if (e.score < 0) unAuditLY.push(ele);
            else hasAuditLY.push(ele);
        });
        return (
            <div className={styles.tableMainTitleGreen}>
                <div
                    className={styles.detailShow}
                    onMouseOver={e => {
                        this.detailShow(true);
                    }}
                    onMouseOut={e => {
                        this.detailShow(false);
                    }}
                >
                    <span
                        className={styles.detailTitle}
                        style={{
                            color: '#6C6C6C',
                            fontSize: '14px'
                        }}
                    >
                        评分结果(
                        {hasAudit}/{lyList.length})
                    </span>
                    <div
                        style={
                            this.state.detailShow
                                ? {
                                    display: 'block',
                                    border: '1px solid #DCDCDC',
                                    borderRadius: 4,
                                    width: 368,
                                    boxShadow: '0 1px 4px 0 rgba(0,0,0,.24)',
                                    zIndex: 999,
                                    position: 'relative',
                                    background: '#fff'
                                }
                                : { display: 'none' }
                        }
                        className={styles.panelDetail}
                    >
                        <div className="popoverAudit">
                            <div className={styles.popoverHasA}>
                                <div className={styles.popoverHasATitle}>
                                    {hasAuditLY.length}
                                    人已评
                                </div>
                                <div className={styles.popoverUl}>
                                    {hasAuditLY}
                                </div>
                            </div>
                            <div className={styles.popoverUnA}>
                                <p className={styles.popoverUnATitle}>
                                    {unAuditLY.length}
                                    人未评
                                </p>
                                <div className={styles.popoverUl}>
                                    {unAuditLY}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onClickOk = e => {
        e.preventDefault();
        this.submit();
    };

    onClickCancel = e => {
        e.preventDefault();
        this.setState({
            didIssue: false
        });
    };
    onClickSubmit = e => {
        e.preventDefault();
        if (
            !document.getElementById('mark') ||
            !document.getElementById('markDetail')
        ) {
            this.setState({
                submitBtnStatus: false
            });
            return;
        }

        let mark = document.getElementById('mark').value;
        let markDetail = document.getElementById('markDetail').value;
        var reg = new RegExp('^([0-9]|[1-9][0-9]|100)$');
        if (!mark || mark < 0 || mark > 100 || !reg.test(mark)) {
            message.info('评分分值为0-100的整数');
            return;
        }
        if (!markDetail) {
            message.info('请输入您的评分理由');
            return;
        }
        this.setState({
            didIssue: true
        });
    };
    // 提交
    submit = () => {
        let mark = document.getElementById('mark').value;
        let markDetail = document.getElementById('markDetail').value;
        this.props.submitIpt({
            message: markDetail,
            score: +mark,
            auditId: this.props.auditId,
            eventId: this.props.eventIdLy
        });
        this.setState({
            submitBtnStatus: false,
            didIssue: false
        });
    };
    // 邀请
    inviteAudit = () => {
        this.props.inviteAudit(this.props.eventIdLy);
    };

    initMarkData = () => {
        //评委相关数据
        let judges = this.props.source.auditRecordList;
        const markData = [
            {
                key: '0',
                judge: '总计',
                mark: '评分中',
                markDetail: '评分中'
            }
        ];
        let currAudit = JSON.parse(sessionStorage.user);
        markData.push({
            key: currAudit.id,
            judge: (
                <span>
                    <Avatar src={currAudit.avatar} />
                    <span style={{ marginLeft: '12px' }}>{currAudit.name}</span>
                </span>
            ),
            mark: (
                <Input
                    id={'mark'}
                    style={{ width: '90%', outline: 'none' }}
                    placeholder="请输入评分(0-100之间任意分数)"
                    className={styles.inputScore}
                    maxLength="6"
                />
            ),
            markDetail: (
                <Input
                    id={'markDetail'}
                    style={{
                        width: '90%',
                        border: 'none',
                        outline: 'none',
                        textAlign: 'center'
                    }}
                    placeholder="请输入评分详情"
                    className={styles.inputScore}
                />
            )
        });
        for (let i in judges) {
            //-1表示未完成(评审中) >=0表示已评分
            if (!judges[i].auditUser) continue;
            let avatar = judges[i].auditUser.avatar
                ? judges[i].auditUser.avatar
                : userImg;
            let name = judges[i].auditUser.name
                ? judges[i].auditUser.name
                : '***';
            let one = {
                key: null,
                judge: null,
                mark: null,
                markDetail: null
            };
            one.key = judges[i].auditUser.id;
            one.judge = (
                <span>
                    <Avatar src={avatar} />
                    <span style={{ marginLeft: '12px' }}>{name}</span>
                </span>
            );
            if (
                judges[i].auditUser.id === currAudit.id &&
                judges[i].score < 0
            ) {
                markData[1].markDetail = (
                    <input
                        id={'markDetail'}
                        style={{
                            width: '90%'
                        }}
                        placeholder="请输入评分详情"
                        value={judges[i].message}
                        className={styles.inputScore}
                    />
                );
            }
            if (judges[i].score >= 0) {
                if (judges[i].auditUser.id === currAudit.id) {
                    markData.splice(1, 1);
                }
                one.mark = judges[i].score;
                one.markDetail = (
                    <div style={{ maxWidth: '90%', whiteSpace: 'normal' }}>
                        {judges[i].message}
                    </div>
                );
                markData.push(one);
            }
        }
        return markData;
    };

    render() {
        let colorFlag = true;
        const markCols = [
            {
                title: '评委',
                width: '15%',
                dataIndex: 'judge',
                key: 'judge',
                align: 'left'
            },
            {
                title: '评分',
                width: '30%',
                dataIndex: 'mark',
                key: 'mark',
                align: 'left'
            },
            {
                title: '评分详情',
                width: '55%',
                dataIndex: 'markDetail',
                key: 'markDetail',
                align: 'left'
            }
        ];

        let markData = this.initMarkData();

        return (
            <div className={styles.tableContent}>
                <div className={styles.tableTitle}>
                    {this.tableTitle(
                        this.props.length,
                        this.props.source.auditNo
                    )}
                </div>
                <div className={styles.tableMain}>
                    {this.changeTitle(this.props.type, this.props.source.score)}
                    <div
                        style={{
                            marginBottom: '24px',
                            color: '#666666',
                            fontSize: '14px'
                        }}
                    >
                        总评分计算原理：中位数原则，取评分样本数据中居于中间位置的数值为最终评分。
                    </div>
                    <Table
                        columns={markCols}
                        dataSource={markData}
                        pagination={false}
                        bordered
                        rowClassName={(r, i) => {
                            if (colorFlag) {
                                if (r.datalength === 1 || r.isLastData)
                                    colorFlag = !colorFlag;
                                return 'bgcFFF';
                            } else {
                                if (r.datalength === 1 || r.isLastData)
                                    colorFlag = !colorFlag;
                                return 'bgcF7';
                            }
                        }}
                        onRow={record => {
                            return {
                                onMouseEnter: null // 鼠标移入行
                            };
                        }}
                    />
                    {this.props.myindex !== this.props.length - 1 ? null : (
                        <div className={styles.buttonBox}>
                            {!this.state.submitBtnStatus ? (
                                <Button
                                    className="orangeGradient padW"
                                    type="primary"
                                    disabled
                                    size={'large'}
                                >
                                    已提交
                                </Button>
                            ) : (
                                <Button
                                    className="orangeGradient padW"
                                    type="primary"
                                    size={'large'}
                                    onClick={this.onClickSubmit}
                                >
                                    提交
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {/* 评论二次确认 */}
                <IssueConfirm
                    title="提示"
                    visible={this.state.didIssue}
                    onClickOk={this.onClickOk}
                    onClickCancel={this.onClickCancel}
                />
                <div id="lyErr" className={styles.myMessageBox}>
                    请评分并填写理由
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(Form.create()(Mark));
