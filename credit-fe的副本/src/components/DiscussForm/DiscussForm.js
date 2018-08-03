import React from 'react';
import { Input, Divider, Row, Button, message } from 'antd';
import styles from './DiscussForm.css';
import InputReplay from './InputReplay';
import { connect } from 'dva';
import icon_Discuss from '../../assets/images/discuss.png';
import Fold from './Fold';
import defaultIcon from '../../assets/images/person_avatar.png';

/**
 * 日期格式化函数
 * @param {String} fmt - 传入的你想要的时间格式
 * @param {Object} date - 传入的时间
 * @return {Object} 返回你想要的时间格式
 * @example
 * formatDate('yyyy.MM.dd hh:mm',new Date(row.time))
 */

function formatDate(fmt, date) {
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            );
    return fmt;
}

class DiscussForm extends React.Component {
    /**
     * 构造函数
     * @param {Object} props - 接收的属性对象集合
     * @param {String} props.topicId - 成就id
     * @param {Number} props.showline - 显示的行数
     */
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            allList: [],
            showList: [],
            count: 0,
            dataSource: [],
            collapsible: false,
            collapsed: false,
            data: [],
            isFirstCollapsed: true,
            enableComment: true
        };
        this.onCollapse = this.onCollapse.bind(this);
        this.addMsg = this.addMsg.bind(this);
        this.props.dispatch({
            type: 'discussForm/getCommentList',
            payload: this.props.topicId
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.topicId !== this.props.topicId) {
            this.props.dispatch({
                type: 'discussForm/getCommentList',
                payload: nextProps.topicId
            });
        }
        const response = nextProps.discussForm.data;
        let mainLength = response.length;
        let sublength = 0;
        for (let i in response) {
            if (response[i].childComment) {
                sublength += response[i].childComment.length;
            }
        }
        let count = mainLength + sublength;
        let allList = response;
        let collapsible = false;
        let showList = this.getShowList(allList);
        let dataSource = [];
        if (count > this.props.showLine && this.state.isFirstCollapsed) {
            collapsible = true;
            dataSource = showList;
            this.setState({
                ...this.state,
                allList,
                showList,
                count,
                collapsible,
                dataSource: dataSource,
                data: nextProps.discussForm.data,
                isFirstCollapsed: false
            });
        } else if (
            !this.state.isFirstCollapsed &&
            count <= this.props.showLine
        ) {
            collapsible = false;
            dataSource = allList;
            this.setState({
                ...this.state,
                inputValue: '',
                dataSource,
                collapsible,
                allList,
                showList,
                count
            });
        } else if (
            !this.state.isFirstCollapsed &&
            count > this.props.showLine
        ) {
            dataSource = allList;
            if (!this.state.collapsed) {
                dataSource = showList;
            }
            collapsible = true;
            this.setState({
                ...this.state,
                inputValue: '',
                dataSource,
                collapsible,
                allList,
                showList,
                count
            });
        } else {
            dataSource = showList;
            this.setState({
                ...this.state,
                inputValue: '',
                dataSource,
                allList,
                showList,
                count
            });
        }
    }

    onCollapse = () => {
        let dataSource = [];
        if (!this.state.collapsed) {
            //展开
            dataSource = this.state.allList;
        } else {
            //收起
            dataSource = this.state.showList;
        }
        this.setState({
            ...this.state,
            dataSource,
            collapsed: !this.state.collapsed
        });
    };
    /**
     * 添加评论时的监听函数
     * @param {Object} e - 通过e.target来获取相关的参数
     */
    addMsg = e => {
        let value = e.target.getAttribute('data-value');
        let commentId = e.target.getAttribute('data-comment');
        if (value.trim() === '') {
            message.warning('评论不能为纯空格!');
            return;
        } else {
            // this.props.dispatch({
            //     type: 'discussForm/addComment',
            //     payload: {
            //         commentId: commentId,
            //         content: value,
            //         topicId: this.props.topicId
            //     }
            // });
            this.addComment(commentId, value, this.props.topicId);
        }
    };

    /**
     * 利用闭包控制回复的时机，避免重复提交
     */
    addComment = (() => {
        let label = true;
        return (commentId, value, topicId) => {
            if (!label) return;
            label = false;
            this.props
                .dispatch({
                    type: 'discussForm/addComment',
                    payload: {
                        commentId: commentId,
                        content: value,
                        topicId: topicId
                    }
                })
                .then(() => {
                    label = true;
                });
        };
    })();
    valueChange = e => {
        this.setState({ inputValue: e.target.value });
    };
    enterKey = (e, value) => {
        e.preventDefault();
        let commentId = e.target.getAttribute('data-comment');
        if (value === '') {
            return;
        } else {
            // this.props.dispatch({
            //     type: 'discussForm/addComment',
            //     payload: {
            //         commentId: commentId,
            //         content: value,
            //         topicId: this.props.topicId
            //     }
            // });
            this.addComment(commentId, value, this.props.topicId);
        }
    };
    /**
     * 根据传入的props.showline决定要展示的行数列表
     * @param {Object} allList - 所有评论信息对象
     * @returns {Array} 返回的评论列表
     */
    getShowList = allList => {
        let showList = [];
        let index = 0;
        let tempData = JSON.parse(JSON.stringify(allList));
        for (let row of tempData) {
            if (index >= this.props.showLine) {
                break;
            }
            let subText = row.childComment;
            row['childComment'] = [];
            index = index + 1;
            for (let subrow in subText) {
                if (index >= this.props.showLine) {
                    break;
                }
                row['childComment'].push(subText[subrow]);
                index = index + 1;
            }
            showList.push(row);
        }
        return showList;
    };

    render() {
        return (
            <div className={styles.discussForm}>
                <div className={styles.countClass}>
                    <span>
                        <img
                            alt=""
                            className={styles.iconDiscuss}
                            src={icon_Discuss}
                        />
                    </span>
                    评论 {this.state.count}
                </div>
                <form className={styles.mainInputLayout}>
                    <Input
                        style={{ width: '91%' }}
                        placeholder="添加评论..."
                        enterbutton="评论"
                        value={this.state.inputValue}
                        size="large"
                        onChange={this.valueChange}
                        data-comment={0}
                        onPressEnter={e => {
                            this.enterKey(e, this.state.inputValue);
                        }}
                    />
                    <Button
                        className="orangeGradient"
                        type="primary"
                        onClick={this.addMsg}
                        data-comment={0}
                        data-value={this.state.inputValue}
                        style={{ height: 40, verticalAlign: 'top' }}
                    >
                        评论
                    </Button>
                </form>
                <div className={styles.comment}>
                    {this.state.dataSource.map((row, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    marginBottom: 0,
                                    padding: '0px 0 20px 0'
                                }}
                            >
                                <Row>
                                    <span>
                                        <img
                                            style={{
                                                height: 24,
                                                width: 24,
                                                borderRadius: 12,
                                                border: '1px solid #DFDFDF'
                                            }}
                                            alt={row.user.name}
                                            src={
                                                row.user.avatar
                                                    ? row.user.avatar
                                                    : defaultIcon
                                            }
                                        />
                                        &nbsp;&nbsp;
                                        {row.user.name ? row.user.name : '***'}
                                    </span>
                                    &nbsp;&nbsp;
                                    {row.content}
                                </Row>
                                <InputReplay
                                    title="回复"
                                    commentId={row.id}
                                    justify="start"
                                    enterKey={this.enterKey}
                                    addMsg={this.addMsg}
                                    reponse={row.user.name}
                                >
                                    {formatDate(
                                        'yyyy.MM.dd hh:mm',
                                        new Date(row.time)
                                    )}
                                    <Divider type="vertical" />
                                </InputReplay>
                                {row.childComment &&
                                    row.childComment.map((subrow, subindex) => {
                                        return (
                                            <div
                                                className={styles.subrow}
                                                key={subindex}
                                            >
                                                <Row
                                                    className={styles.callBack}
                                                >
                                                    <span>
                                                        <img
                                                            style={{
                                                                height: 24,
                                                                width: 24,
                                                                borderRadius: 12,
                                                                border:
                                                                    '1px solid #DFDFDF'
                                                            }}
                                                            alt={
                                                                subrow.user.name
                                                            }
                                                            src={
                                                                subrow.user
                                                                    .avatar
                                                                    ? subrow
                                                                        .user
                                                                        .avatar
                                                                    : defaultIcon
                                                            }
                                                        />
                                                        &nbsp;&nbsp;
                                                        {subrow.user.name
                                                            ? subrow.user.name
                                                            : '***'}
                                                    </span>
                                                    &nbsp;&nbsp;回复&nbsp;&nbsp;
                                                    {subrow.respondTo.name
                                                        ? subrow.respondTo.name
                                                        : '***'}{' '}
                                                    :&nbsp;&nbsp;
                                                    {subrow.content}
                                                </Row>
                                                <InputReplay
                                                    title="回复"
                                                    commentId={subrow.id}
                                                    justify="end"
                                                    enterKey={this.enterKey}
                                                    addMsg={this.addMsg}
                                                    style={{
                                                        padding: '0px 0 0px 0'
                                                    }}
                                                    reponse={subrow.user.name}
                                                >
                                                    {formatDate(
                                                        'yyyy.MM.dd hh:mm',
                                                        new Date(subrow.time)
                                                    )}
                                                    <Divider type="vertical" />
                                                </InputReplay>
                                                <div
                                                    className={styles.devider}
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
                <Row
                    type="flex"
                    justify="center"
                    className={this.state.collapsible ? '' : styles.hiden}
                >
                    <a
                        onClick={this.onCollapse}
                        className={styles.collaperFont}
                    >
                        {this.state.collapsed ? (
                            <Fold
                                style={{
                                    color: '#F18D55',
                                    fontSize: 16,
                                    fontWeight: 400
                                }}
                                fold={false}
                            />
                        ) : (
                            <Fold
                                style={{
                                    color: '#F18D55',
                                    fontSize: 16,
                                    fontWeight: 400
                                }}
                                fold={true}
                            />
                        )}
                    </a>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { discussForm: state.discussForm };
}

export default connect(mapStateToProps)(DiscussForm);
