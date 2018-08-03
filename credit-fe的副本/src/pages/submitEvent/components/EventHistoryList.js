import React from 'react';
import { Table, Pagination } from 'antd';
import { PAGE_SIZE } from './constants';
import Filter from '../../../components/FilterTable/Filter';
import styles from './components.css';
import request from '../../../utils/request';
import ModalEvent from '../../myCredit/components/ModalEvent';
import dataBlank from '../../../assets/images/dataBlank.png';

var dateFormat = require('dateformat');
class EventHistoryList extends React.Component {
    state = {
        current: this.props.current,
        selectRecord: {},
        visible: false
    };
    showModelHandler = row => {
        request(`/credit/event/${row.id}`).then(result => {
            this.setState({
                visible: true,
                selectRecord: result,
                currentRow: row
            });
        });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    postDone = () => {
        this.props.postDone();
        this.showModelHandler(this.state.currentRow);
    };
    render() {
        const filterMenus = [
            // { label: '评分中', value: '0' },
            // { label: '大', value: '1' },
            // { label: '中', value: '2' },
            // { label: '小', value: '3' },
            // { label: '无效', value: '4' }
            { label: '降序', value: '0' },
            { label: '降序', value: '1' }
        ];
        const defaultCheckedList = ['0', '1', '2', '3', '4'];
        const columns = [
            {
                title: '成就简介',
                dataIndex: 'title',
                width: '30%'
            },
            // 删除成就类型
            // {
            //     title: '类型',
            //     width: '15%',
            //     render: (text, record) => (
            //         <span>{record.type === 0 ? '加分成就' : '减分成就'}</span>
            //     )
            // },
            {
                title: '拥有人',
                dataIndex: 'responsibleUserName',
                width: '10%'
            },
            {
                title: '提交人',
                dataIndex: 'reportUserName',
                width: '10%',
                render: text => text || '' // 改匿名为空字符
            },
            {
                title: '时间',
                dataIndex: 'createAt',
                width: '15%',
                sorter: true,
                render: (text, record) => (
                    <span>
                        {dateFormat(record.createAt, 'yyyy.mm.dd HH:MM')}
                    </span>
                )
            },
            {
                // title: (
                //     <Filter
                //         menu={filterMenus}
                //         title={'评分结果'}
                //         filtrate={this.props.filtrate}
                //         defaultCheckedList={defaultCheckedList}
                //         checkAll={true}
                //     />
                // ),
                title: '评分结果',
                key: '6',
                width: '20%',
                dataIndex: 'score',
                sorter: true,
                render: text => {
                    if (text === -2) return '评分中';
                    if (text === -1) return '无效';
                    return text;
                }
                // render: (text, record) => {
                //     let scoreText = '';
                //     switch (record.score) {
                //         case 0:
                //             scoreText = '评分中';
                //             break;
                //         case 1:
                //             scoreText = '大';
                //             break;
                //         case 2:
                //             scoreText = '中';
                //             break;
                //         case 3:
                //             scoreText = '小';
                //             break;
                //         case 4:
                //             scoreText = '无效';
                //             break;
                //         default:
                //             scoreText = '未定义';
                //             break;
                //     }
                //     return <span>{scoreText}</span>;
                // }
            }
        ];
        return (
            <div className={styles.tableMargin}>
                <Table
                    loading={this.props.loading}
                    columns={columns}
                    size="middle"
                    dataSource={this.props.dataSource}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className={styles.noDataBox}>
                                <img src={dataBlank} alt="暂无内容" />
                                <p>暂无内容</p>
                            </div>
                        )
                    }}
                    rowClassName={(_, index) =>
                        index % 2 === 0 ? 'rowClass' : 'rowClass2'
                    }
                    onRow={record => {
                        return {
                            onClick: () => {
                                this.showModelHandler(record);
                            } // 点击行
                        };
                    }}
                    onChange={this.props.handleTableChange}
                />
                {this.props.total !== 0 && (
                    <Pagination
                        className="ant-table-pagination"
                        total={this.props.total}
                        current={this.props.current}
                        pageSize={PAGE_SIZE}
                        onChange={this.props.pageChangeHandler}
                        showQuickJumper={true}
                    />
                )}
                <ModalEvent
                    visible={this.state.visible}
                    source={this.state.selectRecord}
                    onCancel={this.handleCancel}
                    postDone={this.postDone}
                />
            </div>
        );
    }
}

export default EventHistoryList;
