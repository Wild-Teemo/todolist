import React from 'react';
import styles from './AuditResultsTable.css';
import { connect } from 'dva';
import { Table, Button, Form, Avatar, message } from 'antd';
import userImg from '../../../../assets/images/person_avatar.png';
message.config({
    top: '90%',
    duration: 2,
    maxCount: 3
});
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
        submitBtnStatus: true
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setResultScore();
    }
    componentWillMount() {
        this.setResultScore();
    }

    setResultScore() {
        //判断能否提交审核
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
                judges[i].auditUser.score >= 0
            ) {
                this.setState({
                    submitBtnStatus: false
                });
            }
        }
    }

    // 计算表名
    tableTitle = (length, index) => {
        if (length === 1) return <span>审核结果</span>;
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

    // 提交
    submit = e => {
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
        console.log(!reg.test(mark));
        if (!mark || mark < 0 || mark > 100 || !reg.test(mark)) {
            message.info('评分分值为0-100的整数');
            return;
        }
        if (!markDetail) {
            message.info('请输入您的评分理由');
            return;
        }
        this.props.submitIpt({
            message: markDetail,
            score: parseInt(mark),
            auditId: this.props.auditId,
            eventId: this.props.eventIdLy
        });
        this.setState({
            submitBtnStatus: false
        });
    };
    // 邀请
    inviteAudit = () => {
        this.props.inviteAudit(this.props.eventIdLy);
    };

    initMarkData = () => {
        //评委相关数据
        let judges = this.props.source.auditRecordList;
        let resultScore = this.props.source.score; //这次评审的分值（ >=0 中位数, -1评审超时,-2进行中）
        let scoreArr = [];
        const markData = [
            {
                key: '0',
                judge: '总计',
                mark: '评分中',
                markDetail: '评分中'
            }
        ];
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
            if (judges[i].score < 0) {
                one.mark = '无效';
                one.markDetail = '无效';
            } else {
                one.mark = judges[i].score;
                one.markDetail = (
                    <div style={{ maxWidth: '90%', whiteSpace: 'normal' }}>
                        {judges[i].message}
                    </div>
                );
            }

            markData.push(one);
            if (judges[i].score >= 0) {
                scoreArr.push(judges[i].score);
            }
        }
        if (resultScore !== -2) {
            //如果这个result不是评审中状态
            scoreArr = sortScoreArr(scoreArr);
            let str = '';
            for (let i in scoreArr) {
                str += scoreArr[i] + '，';
            }
            markData[0].mark = resultScore;
            markData[0].markDetail = str;
        }
        if (resultScore < 0) {
            markData[0].mark = '无效';
            markData[0].markDetail = '无效';
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
                <div style={{ color: '#666', margin: '25px 0 10px 0' }}>
                    <span
                        style={{
                            marginLeft: '42px',
                            display: 'inline-block',
                            height: '6px',
                            width: '6px',
                            borderRadius: '100%',
                            background: '#6c6c6c'
                        }}
                    />
                    <span style={{ marginLeft: '8px' }}>已完成</span>
                </div>
                <div
                    style={{
                        marginBottom: '24px',
                        color: '#666666',
                        fontSize: '14px',
                        marginLeft: '42px'
                    }}
                >
                    总评分计算原理：中位数原则，取评分样本数据中居于中间位置的数值为最终评分。
                </div>
                <div className={styles.tableMain}>
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
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(Form.create()(Mark));

function sortScoreArr(scoreArr) {
    if (!scoreArr || !(scoreArr instanceof Array)) return;
    for (let i = 0; i < scoreArr.length; i++) {
        for (let j = i + 1; j < scoreArr.length; j++) {
            if (scoreArr[i] > scoreArr[j]) {
                let temp = scoreArr[i];
                scoreArr[i] = scoreArr[j];
                scoreArr[j] = temp;
            }
        }
    }
    return scoreArr;
}
