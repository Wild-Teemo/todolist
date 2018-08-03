import React from 'react';
import { Component } from 'react';
import { Table, Row, Card, Icon, Avatar } from 'antd';
import styles from './components.css';
// import RightModal from './RightModal';
import userImg from '../../../assets/images/person_avatar.png';
//import { changeScore } from '../../../../utils/mytool';

class ReuseTable extends Component {
    state = {
        isExpanded: true
    };

    // 返回评分表格的数据
    getDataSource = () => {
        const { score } = this.props;
        if (score === -2)
            return [
                {
                    score: '评分中',
                    message: '评分中',
                    auditUser: '总计'
                }
            ];
        if (score === -1) {
            return [
                {
                    score: '已失效',
                    message: '已失效',
                    auditUser: '总计'
                }
            ];
        }
        const scoreList = [];
        const dataSource = this.props.dataAuditList.map(
            ({ score, message, auditUser }) => {
                scoreList.push(score);
                return {
                    auditUser: auditUser ? (
                        <span>
                            <Avatar src={auditUser.avatar || userImg} />
                            <span style={{ marginLeft: '12px' }}>
                                {auditUser.name}
                            </span>
                        </span>
                    ) : null,
                    score,
                    message
                };
            }
        );

        dataSource.unshift({
            score: score,
            message: scoreList.sort((a, b) => a - b).join(','),
            auditUser: '总计'
        });
        return !this.state.isExpanded ? dataSource : [dataSource[0]];
    };

    handleExpandBtn = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    render() {
        const { score } = this.props;
        const columns = [
            {
                title: '评委',
                width: 106,
                dataIndex: 'auditUser',
                render: text => text || '***',
                align: 'left'
            },
            {
                title: '评分',
                width: 106,
                dataIndex: 'score',
                align: 'left'
            },
            {
                title: '评分详情',
                width: 796,
                dataIndex: 'message',
                align: 'left'
            }
        ];
        return (
            <div>
                <Row className={styles.cardRow}>
                    <Card
                        title={
                            <span className={styles.title}>
                                {this.props.stateTitle}
                            </span>
                        }
                    >
                        <div style={{ marginBottom: '10px' }}>
                            <span className={styles.markPoint} />
                            <span>
                                总评分计算原理：中位数原则，取评分样本数据中居于中间位置的数值为最终评分。
                            </span>
                        </div>
                        <Table
                            className={styles.reuseTable}
                            columns={columns}
                            bordered
                            rowKey={record => record.id}
                            dataSource={this.getDataSource()}
                            pagination={false}
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'bgcFFF' : 'bgcF7'
                            }
                        />
                        {// 当评议完成时展示折叠按钮
                            score >= 0 &&
                            (this.state.isExpanded ? (
                                <div className={styles.expandBtn}>
                                    <span onClick={this.handleExpandBtn}>
                                        展开详情 <Icon type="down" />
                                    </span>
                                </div>
                            ) : (
                                <div className={styles.expandBtn}>
                                    <span onClick={this.handleExpandBtn}>
                                        收起详情 <Icon type="up" />
                                    </span>
                                </div>
                            ))}
                    </Card>
                </Row>
            </div>
        );
    }
}
export default ReuseTable;
