import React from 'react';
import { Component } from 'react';
import { Modal, Card, Row } from 'antd';
import ModalTitle from './ModalTitle';
import ReuseTable from './ReuseTable';
import CardEvent from './CardEvent';
import fileDown from '../../../utils/downFile';
import DiscussForm from '../../../components/DiscussForm/DiscussForm';
import styles from './components.css';
import HtmlDecode from '../../../utils/HtmlDecode';

import DownFileTitle from '../../audit/components/AuditResultsTable/DownFileTitle';

class ModalEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    render() {
        const { source } = this.props;
        if (Object.keys(source).length > 0) {
            let options = [];
            //提交人
            if (source.reportUser.id && source.reportUser.name) {
                options.push({
                    id: source.reportUser.id,
                    name: source.reportUser.name
                });
            }
            //证明人
            if (source.witnesses) {
                source.witnesses.map((witness, index) =>
                    options.push({ id: witness.id, name: witness.name })
                );
            }

            let show;
            if (source.reexaminationList.length > 0) {
                show = (
                    <div className="eventSynopsis">
                        {source.reexaminationList.map(
                            (reexamination, index) => {
                                return (
                                    <CardEvent
                                        events={reexamination}
                                        key={index}
                                    />
                                );
                            }
                        )}
                        <div className={styles.listType}>初审</div>
                        <Row className={styles.cardRow}>
                            <Card title="初审内容">
                                {HtmlDecode(source.description)}
                            </Card>
                        </Row>
                        {source.file !== null && (
                            <Row className={styles.cardRow}>
                                <Card title={<DownFileTitle />}>
                                    <p>
                                        {source.file.name}
                                        <a
                                            onClick={() =>
                                                fileDown(source.file.id)
                                            }
                                        >
                                            下载
                                        </a>
                                    </p>
                                </Card>
                            </Row>
                        )}
                    </div>
                );
            } else {
                show = (
                    <div className="eventSynopsis">
                        {HtmlDecode(source.description)}
                        {source.file !== null && (
                            <Row className={styles.cardRow}>
                                <Card title={<DownFileTitle />}>
                                    <p>
                                        {source.file.name}
                                        <a
                                            onClick={() =>
                                                fileDown(source.file.id)
                                            }
                                        >
                                            下载
                                        </a>
                                    </p>
                                </Card>
                            </Row>
                        )}
                    </div>
                );
            }
            return (
                <span>
                    {this.props.visible && (
                        <Modal
                            className="my-modal-event special-model-event"
                            title={<ModalTitle source={source} />}
                            width={'90%'}
                            style={{ top: 10 }}
                            visible={this.props.visible}
                            onCancel={this.props.onCancel}
                            footer={null}
                            maskClosable={false}
                        >
                            <Row className={styles.cardRow}>
                                <Card
                                    title={
                                        <span className={styles.title}>
                                            成就简介
                                        </span>
                                    }
                                >
                                    {show}

                                    <Row className={styles.cardRow}>
                                        <DiscussForm
                                            topicId={source.id}
                                            showLine={5}
                                        />
                                    </Row>
                                </Card>
                            </Row>
                            {source.auditResultList.map((val, index) => {
                                return (
                                    <ReuseTable
                                        score={source.score} // 总的评分
                                        key={val.id}
                                        scoreResult={val.score}
                                        type={source.type}
                                        dataAuditList={val.auditRecordList}
                                        stateTitle="评分结果"
                                        typeTitle={val.auditNo}
                                        eventID={val.eventId}
                                        eventTitle={source.title}
                                        options={options}
                                        postDone={this.props.postDone}
                                        index={index}
                                        maxLength={
                                            source.auditResultList.length
                                        }
                                    />
                                );
                            })}
                        </Modal>
                    )}
                </span>
            );
        } else {
            return <div />;
        }
    }
}
export default ModalEvent;
