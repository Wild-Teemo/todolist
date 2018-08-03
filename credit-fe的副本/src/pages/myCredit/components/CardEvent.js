import React from 'react';
import { Card, Row } from 'antd';
import styles from './components.css';
import DownFileTitle from '../../audit/components/AuditResultsTable/DownFileTitle';
import fileDown from '../../../utils/downFile';

const CardEvent = ({ events }) => {
    let witnessesArr = [];
    let usersArr = [];
    if (events.witnesses) {
        events.witnesses.map(witness =>
            witnessesArr.push(`${witness.name}(${witness.departName})`)
        );
    }

    if (events.users) {
        events.users.map(user =>
            usersArr.push(`${user.name}(${user.departName})`)
        );
    }
    let fileDowns =
        events.file === null ? (
            '无'
        ) : (
            <p>
                {events.file.name}
                <a onClick={() => fileDown(events.file.id)}>下载</a>
            </p>
        );

    return (
        <div>
            <div className={styles.listType}>复审</div>
            <Row className={styles.cardRow}>
                <Card title="复议内容">
                    {usersArr.length > 0 ? (
                        <p>复议人: {usersArr.join(', ')}</p>
                    ) : (
                        <p>复议人：匿名</p>
                    )}
                    <p>
                        复议理由：
                        {events.reason}
                    </p>
                    {witnessesArr.length > 0 && (
                        <p>
                            证明人：
                            {witnessesArr.join(', ')}
                        </p>
                    )}
                </Card>
            </Row>
            {events.file && (
                <Row className={styles.cardRow}>
                    <Card title={<DownFileTitle />}>{fileDowns}</Card>
                </Row>
            )}
        </div>
    );
};
export default CardEvent;
