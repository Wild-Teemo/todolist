import React from 'react';
import DownIcon from '../../../../assets/images/downIcon.png';
import styles from './AuditResultsTable.css';

const DownFileTitle = () => {
    return (
        <span>
            <img alt="下载图标" className={styles.downIcon} src={DownIcon} />
            附件
        </span>
    );
};
export default DownFileTitle;
