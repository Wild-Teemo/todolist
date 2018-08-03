import React from 'react';
import styles from './AuditResultsTable.css';
import { connect } from 'dva';
import AuditUserCard from './AuditUserCard';
import { changeScore, score2Index } from '../../../../utils/mytool';
import {
    Table,
    Checkbox,
    Button,
    Icon,
    Input,
    Form,
    Avatar,
    message
} from 'antd';
import userImg from '../../../../assets/images/person_avatar.png';
const { TextArea } = Input;

const FormItem = Form.Item;
message.config({
    top: '90%',
    duration: 2,
    maxCount: 3
});
class UnAuditResultsTable extends React.Component {
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
        isChecked: false
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isChecked.count === 1 && nextProps.isChecked.submited) {
            this.setState({
                ...this.state,
                isChecked: false
            });
            this.props.changeSubmit();
        }
    }
    _chooseScore = () => {
        let l = 0;
        this.props.checkboxState.forEach((e, i) => {
            if (e) l = i + 1;
        });
        if (l > 0) return l;
        else return -1;
    };
    // 单选按钮
    onChange = (index, value, e) => {
        let newArr = this.props.checkboxState.slice(0);
        newArr[index] = !newArr[index];
        this.props.getSource(value, newArr[index], index);
        this.setState({
            ...this.state,
            chooseScore: value,
            isChecked: e.target.checked
        });
    };
    // 计算表名
    tableTitle = (length, index) => {
        if (length === 1) return <span>评分结果</span>;
        else {
            if (index === 0) return <span>初审结果</span>;
            else return <span>复议结果</span>;
        }
    };
    // 过滤数据
    filterData = obj => {
        obj = obj.filter(e => {
            return e.auditUser;
        });
        let indexArr = new Set();
        let filterArr = obj;
        let data = filterArr.map((e, i) => {
            e.key = i;
            indexArr.add(e.score);
            return e;
        });
        let trueArr = Array.from(indexArr);
        let sarr = [1, 2, 3, 4, 5];
        let newsArr = sarr.filter(e => !trueArr.includes(Number(e)));
        newsArr.forEach((e, i) => {
            data.push({ key: data.length + i, score: e });
        });
        data = this.sortData(data);
        return data;
    };
    // 数据排序
    sortData = obj => {
        let objArr = obj;
        objArr.sort((a, b) => a.score - b.score);
        objArr.forEach((ele1, index1) => {
            ele1.datalength = 0;
            objArr.forEach((ele2, index2) => {
                if (ele1.score === ele2.score) {
                    ele1.datalength++;
                }
            });
            if (index1 > 0) {
                if (ele1.score === objArr[index1 - 1].score)
                    ele1.datalength = 0;
            }
        });
        return objArr;
    };
    detailShow(bool) {
        this.setState({
            ...this.state,
            detailShow: bool
        });
    }
    changeData = (
        obj = this.props.source.auditRecordList.filter(e => e.score > 0)
    ) => {
        let indexArr = new Set();
        // .filter(e => (e.score>0))
        let filterArr = obj;
        let data = filterArr.map((e, i) => {
            e.key = i;
            indexArr.add(e.score);
            return e;
        });
        let trueArr = Array.from(indexArr);
        let sarr = [1, 2, 3, 4, 5];
        let newsArr = sarr.filter(e => !trueArr.includes(Number(e)));
        newsArr.forEach((e, i) => {
            data.push({ key: data.length + i, score: e });
        });
        data = this.sortData(data);
        // this.setState({
        //   inData: data
        // })
        return data;
    };
    // 计算标题
    changeTitle = (type, score) => {
        if (this.props.source.score === 0) {
            //评分中
            let lyList;
            this.props.UnAEventauditResultListPro.forEach(e => {
                if (e.score === 0) lyList = e.auditRecordList;
            });
            let hasAudit = 0;
            lyList.forEach(e => {
                if (e.score !== 0) hasAudit++;
            });
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
                            src={
                                e.auditUser.avatar
                                    ? e.auditUser.avatar
                                    : userImg
                            }
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
                if (e.score === 0) unAuditLY.push(ele);
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
                        <span className={styles.detailTitle}>
                            评分中...(
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
                                        boxShadow:
                                              '0 1px 4px 0 rgba(0,0,0,.24)',
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
                        {/*<Content detailShow={this.detailShow} />*/}
                    </div>
                    {/*{this.props.userIsAudit || this.props.source._canEdit ? (
                        this.props.switchEdie ? (
                            <span
                                onClick={e => {
                                    this.handleEdit(true);
                                }}
                                className={styles.tableEdit}
                            >
                                <Icon type="form" />编辑
                            </span>
                        ) : (
                            <span
                                onClick={e => {
                                    this.handleEdit(false);
                                }}
                                className={styles.tableEdit}
                            >
                                <Icon type="close" />取消编辑
                            </span>
                        )
                    ) : null}*/}
                </div>
            );
        } else {
            //评分完成（所有人已评或者时间已过评审期）
            if (type === 1) {
                return (
                    <div className={styles.tableMainTitleRed}>
                        <span>
                            减分成就：
                            {changeScore(score)}
                        </span>
                    </div>
                );
            } else {
                return (
                    <div className={styles.tableMainTitleGreen}>
                        <span>
                            加分成就：
                            {changeScore(score)}
                        </span>
                    </div>
                );
            }
        }
    };
    // 编辑
    handleEdit = bool => {
        this.props.handleEdit();
        this.setState({
            ...this.state,
            isChecked: bool
        });
    };
    // 提交
    submit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values.message === undefined || values.message === '') {
                    message.info('请填写评分和理由');
                    return;
                }
                if (this.state.chooseScore === -1) {
                    // 编辑未评分处理
                    let l;
                    this.props.checkboxState.forEach((e, i) => {
                        if (e) l = i + 1;
                    });
                    this.props.submitIpt({
                        message: values.message,
                        score: l,
                        auditId: this.props.auditId,
                        eventId: this.props.eventIdLy
                    });
                } else {
                    let l;
                    this.props.checkboxState.forEach((e, i) => {
                        if (e) l = i + 1;
                    });
                    this.props.submitIpt({
                        message: values.message,
                        score: l,
                        auditId: this.props.auditId,
                        eventId: this.props.eventIdLy
                    });
                }
            }
        });
    };
    // 邀请
    inviteAudit = () => {
        this.props.inviteAudit(this.props.eventIdLy);
    };
    // 处理数据分颜色
    ditinguishColor = data => {
        return data.map((e, i) => {
            if (i < data.length - 1) {
                if (e.datalength === 0 && data[i + 1].datalength >= 1) {
                    e.isLastData = true;
                } else e.isLastData = false;
            } else e.isLastData = true;
            return e;
        });
    };
    validMark = mark => {
        console.log(mark);
    };
    render() {
        // 定义表格
        const columns = [
            {
                title: '评分',
                dataIndex: 'score',
                width: '10%',
                render: (value, row, index) => {
                    let _index = score2Index(changeScore(Number(value)));
                    let checkCode = (
                        <div className="r-checkbox">
                            {/*<Input placeholder={'请输入0-100的分值'} onChange={this.validMark}/>*/}
                            <Checkbox
                                onChange={e => {
                                    this.onChange(_index, value, e);
                                }}
                                checked={this.props.checkboxState[_index]}
                                value={value}
                            >
                                {changeScore(Number(value))}
                            </Checkbox>
                        </div>
                    );
                    let isCheck;
                    if (this.props.isAuditTable) {
                        isCheck = changeScore(Number(value));
                    } else {
                        isCheck = checkCode;
                    }
                    const obj = {
                        children: isCheck,
                        props: {}
                    };
                    obj.props.rowSpan = row.datalength;
                    return obj;
                }
            },
            {
                title: '评委',
                dataIndex: 'auditUser',
                width: '20%',
                render: (value, record) => {
                    let hasauditUser =
                        !record.auditUser || record.auditUse === null;
                    return (
                        <span>
                            {hasauditUser ? (
                                '0'
                            ) : (
                                <AuditUserCard
                                    score={value}
                                    isInviter={record.inviterUser}
                                />
                            )}
                        </span>
                    );
                }
            },
            {
                title: '评分详情',
                width: '70%',
                className: 'no-text-center',
                dataIndex: 'message',
                editable: true,
                render: (value, record) => {
                    let hasauditUser = !record.message || record.message === '';
                    if (record._isEdit === undefined) {
                        record._isEdit = false;
                    }
                    if (record._isEdit === true) {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <span>
                                <Form className="login-form">
                                    <FormItem>
                                        {getFieldDecorator('message', {
                                            initialValue: value,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入您的理由!',
                                                    min: 1
                                                }
                                            ]
                                        })(
                                            <TextArea
                                                placeholder="请填写理由(必填)"
                                                autosize
                                                onPressEnter={this.submit}
                                            />
                                        )}
                                    </FormItem>
                                </Form>
                            </span>
                        );
                    } else if (!record.auditUser || record._isEdit === false) {
                        return <span>{hasauditUser ? '/' : value}</span>;
                    }
                }
            }
        ];
        let data = this.changeData();
        data = this.ditinguishColor(this.sortData(data));
        let colorFlag = true;
        let userProfile = JSON.parse(sessionStorage.user);
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
                    <Table
                        columns={columns}
                        dataSource={data}
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
                            {}
                            {!this.state.isChecked &&
                            this.props.source.score === 0 &&
                            userProfile.type.indexOf('1') >= 0 ? (
                                    <Button
                                        className="orangeGradient padW"
                                        type="primary"
                                        onClick={this.inviteAudit}
                                        size={'large'}
                                    >
                                    邀请他人评审
                                    </Button>
                                ) : (
                                    <Button
                                        className="orangeGradient padW"
                                        type="primary"
                                        disabled
                                        size={'large'}
                                    >
                                    邀请他人评审
                                    </Button>
                                )}
                            {!this.state.isChecked ? (
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
                                    onClick={this.submit}
                                >
                                    提交
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                <div id="lyErr" className={styles.myMessageBox}>
                    请填写理由和评分
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(Form.create()(UnAuditResultsTable));
