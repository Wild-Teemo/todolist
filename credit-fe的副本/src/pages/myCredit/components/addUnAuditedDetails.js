import { Modal, Card, Row } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from '../../audit/components/components.css';
import AuditResultsTable from '../../audit/components/AuditResultsTable/UnAuditResultsTable';
import ModalTitle from './ModalTitle';

import CardEvent from './CardEvent';
import fileDown from '../../../utils/downFile';
import DiscussForm from '../../../components/DiscussForm/DiscussForm';
import DownFileTitle from '../../audit/components/AuditResultsTable/DownFileTitle';
import HtmlDecode from '../../../utils/HtmlDecode';

class UnAuditedDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props.changeSubmit({ submited: false, count: 0 });
        this.changeSubmit = this.changeSubmit.bind(this);
    }
    handleCancel = e => {
        // 重置
        this.props.cancelModal();
    };
    getSource = (source, check, index) => {
        this.props.getSource(source, check, index);
    };
    submitIpt = obj => {
        this.props.submitIpt(obj);
    };
    handleEdit = () => {
        this.props.handleEdit();
    };
    inviteAudit = id => {
        this.props.inviteAudit(id);
    };
    changeSubmit = () => {
        this.props.changeSubmit({ submited: false, count: 0 });
    };

    render() {
        let source = this.props.allSources.eventData;
        if (Object.keys(source).length > 0) {
            let moreTable = this.props.allSources.auditResultList.map(
                (e, i) => {
                    let userIsAudit; // 关闭编辑按钮
                    if (
                        (!this.props.userIsAudit || e._canEdit) &&
                        i === this.props.allSources.auditResultList.length - 1
                    ) {
                        e.isAuditTable = false;
                        userIsAudit = false;
                    } else {
                        e.isAuditTable = true;
                        userIsAudit = true;
                    }
                    return (
                        <AuditResultsTable
                            getSource={this.getSource}
                            key={i}
                            source={e}
                            isAuditTable={e.isAuditTable}
                            type={this.props.allSources.eventData.type}
                            length={
                                this.props.allSources.auditResultList.length
                            }
                            myindex={i}
                            checkboxState={this.props.checkboxState}
                            submitIpt={this.submitIpt}
                            inviteAudit={this.inviteAudit}
                            auditId={e.id}
                            eventIdLy={e.eventId}
                            userIsAudit={userIsAudit}
                            handleEdit={this.props.handleEdit}
                            switchEdie={this.props.switchEdie}
                            isChecked={this.props.isChecked}
                            changeSubmit={this.changeSubmit}
                            UnAEventauditResultListPro={
                                this.props._UnAEventauditResultListPro
                            }
                        />
                    );
                }
            );
            // 表格倒序
            moreTable.reverse();
            // 成就简介
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
                        <Row className={styles.cardRow}>
                            <Card title={<DownFileTitle />}>
                                {source.file === null ? (
                                    '无'
                                ) : (
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
                                )}
                            </Card>
                        </Row>
                    </div>
                );
            } else {
                show = (
                    <div className="eventSynopsis">
                        {HtmlDecode(source.description)}
                        <Row className={styles.cardRow}>
                            <Card title={<DownFileTitle />}>
                                {source.file === null ? (
                                    '无'
                                ) : (
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
                                )}
                            </Card>
                        </Row>
                    </div>
                );
            }
            return (
                <div className="hasAuditedDetails">
                    <Modal
                        title={<ModalTitle source={source} />}
                        visible={this.props.isShowModal}
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
    return { ...state.myEvents };
}

export default connect(mapStateToProps)(UnAuditedDetails);
