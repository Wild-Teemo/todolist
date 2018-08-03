import React from 'react';
import { Table } from 'antd';
import Filter from '../../../components/FilterTable/Filter';
import dataBlank from '../../../assets/images/dataBlank.png';
import styles from './components.css';

const filterMenus = [
    { label: '已评', value: 'graded' },
    { label: '评分', value: 'grading' }
];
const defaultCheckedList = ['graded', 'grading'];

function TablePage(props) {
    let filterIsAudit = type => {
        if (type.length === 1) {
            if (type[0] === 'graded') {
                props.cored(1);
            } else {
                props.cored(0);
            }
        } else if (type.length === 0) {
            props.cored(2);
        } else {
            props.cored('');
        }
    };
    const columns = [
        {
            title: '成就简介',
            dataIndex: 'title',
            width: '25%'
        },
        /*{
            title: '类型',
            dataIndex: 'type',
            width: '15%'
        },*/
        {
            title: '拥有人',
            dataIndex: 'responsibleUserName',
            width: '10%'
        },
        {
            title: '提交人',
            dataIndex: 'reprotUserName',
            width: '10%'
        },
        {
            title: '时间',
            dataIndex: 'createAt',
            width: '15%',
            sorter: true
        },
        {
            title: '进度',
            dataIndex: 'progress',
            width: '10%'
        },
        {
            // title: (
            //     <Filter
            //         menu={filterMenus}
            //         filtrate={filterIsAudit}
            //         defaultCheckedList={defaultCheckedList}
            //         checkAll={true}
            //         title={'评分结果'}
            //     />
            // ),
            title: '评分结果',
            dataIndex: 'score',
            width: '15%'
            // sorter: true
        }
    ];

    let handleTableChange = pagination => {
        const pager = { ...props.pagination };
        pager.current = pagination.current;
        props.pageChange(pagination.current, pager);
    };
    return (
        <div>
            <Table
                columns={columns}
                dataSource={props.data}
                pagination={props.pagination}
                loading={props.loading}
                onChange={props.handleSortEvent}
                style={props.style}
                locale={{
                    emptyText: (
                        <div className={styles.noDataBox}>
                            <img src={dataBlank} alt="暂无内容" />
                            <p>暂无内容</p>
                        </div>
                    )
                }}
                onRow={record => {
                    return {
                        onClick: () => {
                            props.click(record);
                        } // 点击行
                    };
                }}
            />
        </div>
    );
}

export default TablePage;
