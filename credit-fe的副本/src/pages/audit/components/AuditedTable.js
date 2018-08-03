import React from 'react';
import { Table } from 'antd';
import dataBlank from '../../../assets/images/dataBlank.png';
import styles from './components.css';

function TablePage(props) {
    let onChange = pageNumber => {
        props.changePage(pageNumber);
    };

    return (
        <div>
            <Table
                onRow={record => {
                    return {
                        onClick: () => {
                            props.click(record);
                        } // 点击行
                    };
                }}
                columns={props.menu}
                dataSource={props.AuditedData._hasAuditedData}
                loading={props.AuditedData._loading}
                locale={{
                    emptyText: (
                        <div className={styles.noDataBox}>
                            <img src={dataBlank} alt="暂无内容" />
                            <p>暂无内容</p>
                        </div>
                    )
                }}
                onChange={props.changePage}
                pagination={props.AuditedData.auditedDataPagination}
            />
        </div>
    );
}

export default TablePage;
