import { Modal, Card, Row } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from './components.css';
import AuditResultsTable from './AuditResultsTable/AuditResultsTable';
import ModalTitle from '../../myCredit/components/ModalTitle';
import Marked from './AuditResultsTable/Marked';
import CardEvent from '../../myCredit/components/CardEvent';
import fileDown from '../../../utils/downFile';
import DiscussForm from '../../../components/DiscussForm/DiscussForm';
import DownFileTitle from './AuditResultsTable/DownFileTitle';
import HtmlDecode from '../../../utils/HtmlDecode';

class HasAuditedDetails extends React.Component {
    handleCancel = e => {
        this.props.cancelModal();
    };

    render() {
        let source = this.props.allSources.eventData;
        if (Object.keys(source).length > 0) {
            let moreTable = this.props.allSources.auditResultList.map(
                (e, i) => {
                    return (
                        <Marked
                            key={i}
                            source={e}
                            type={this.props.allSources.eventData.type}
                            length={
                                this.props.allSources.auditResultList.length
                            }
                        />
                    );
                }
            );
            // 表格倒序
            moreTable.reverse();
            let show;
            if (source.reexaminationList.length > 0) {
                show = (
                    <div className="eventSynopsis">
                        {source.reexaminationList.map(
                            (reexamination, index) => {
                                return (
                                    <CardEvent
                                        key={index}
                                        events={reexamination}
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
                <div className="hasAuditedDetails">
                    <Modal
                        title={<ModalTitle source={source} />}
                        visible={this.props._showHasAuditedDetails}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={'90%'}
                        style={{ top: 10 }}
                        className="special-model-event"
                    >
                        <Row className={styles.cardRow}>
                            <Card
                                className="event-top-title"
                                title={
                                    <span className={styles.title}>
                                        成就简介
                                    </span>
                                }
                            >
                                {show}
                                <Row className={styles.cardRow}>
                                    <DiscussForm
                                        showLine={5}
                                        topicId={source.id}
                                    />
                                </Row>
                            </Card>
                        </Row>
                        <div className="hasAuditedDetails-table">
                            {moreTable}
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return <div />;
        }
    }
}

function mapStateToProps(state) {
    return { ...state.audit };
}

export default connect(mapStateToProps)(HasAuditedDetails);
