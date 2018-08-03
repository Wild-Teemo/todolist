import React from 'react';
import styles from './AuditResultsTable.css';
import { Avatar } from 'antd';
import userImg from '../../../../assets/images/person_avatar.png';

const AuditUserCard = props => {
    return (
        <div className={styles.auditUserCard}>
            <div className={styles.userImgBox}>
                <Avatar
                    size={'large'}
                    style={{ border: '1px solid #D7D7D7' }}
                    src={props.score.avatar ? props.score.avatar : userImg}
                />
            </div>
            <div className={styles.userName}>
                <div>{props.score.name ? props.score.name : '* * *'}</div>
                {props.isInviter ? (
                    <div className={styles.userNameColor}>
                        {props.isInviter.name}
                        邀请
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AuditUserCard;
