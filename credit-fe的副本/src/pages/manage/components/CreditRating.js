import React from 'react';
import { List, Card, Avatar, Row, Col, Button, Modal } from 'antd';
import { connect } from 'dva';
import SearchBar from '../../../components/SearchBar/SearchBar';
import style from './CreditRating.css';
import circle from '../../../assets/images/circle-plus.png';
const { Meta } = Card;

const data1 = [
    {
        title: 'test'
    }
];

function Search(props) {
    return <span style={props.style}>{props.title}</span>;
}

function CreditRating(props) {
    let department =
        props.addAuditMsg && props.addAuditMsg[0]
            ? props.addAuditMsg[0].department
            : null;
    if (department && department.indexOf('-') > -1) {
        let indexParam = department.indexOf('-');
        department = department.substring(0, indexParam);
    }
    let isEditor = () => {
        let actValue = '';
        if (props.isEditor === '编辑') {
            actValue = '完成';
            props.dispatch({
                type: 'manage/addManager',
                payload: { showPlus: true, showMsg: true, showDelete: true }
            });
        } else {
            actValue = '编辑';
            props.dispatch({
                type: 'manage/addManager',
                payload: { showPlus: false, showMsg: false, showDelete: false }
            });
        }
        props.dispatch({
            type: 'manage/editor',
            payload: { isEditor: actValue }
        });
    };
    let selectManager = () => {
        props.dispatch({
            type: 'manage/showModal',
            payload: { showModal: true }
        });
    };
    let closeModal = () => {
        props.dispatch({
            type: 'manage/showSearchManager',
            payload: { showManager: false }
        });
        props.dispatch({
            type: 'manage/addAuditMsg',
            payload: { addAuditMsg: [] }
        });
        props.dispatch({
            type: 'manage/showModal',
            payload: { showModal: false }
        });
    };
    let search = value => {
        if (value === '') {
            return;
        }
        props.dispatch({
            type: 'manage/search',
            payload: { showManager: true }
        });
    };
    let addManager = () => {
        props.dispatch({
            type: 'manage/addAuditUsers',
            payload: props.addAuditMsg[0].id
        });
    };
    let deleteAuditUser = e => {
        let userId = e.target.getAttribute('data-user');
        props.dispatch({ type: 'manage/deleteAuditUser', payload: userId });
    };

    let setGlobalUserId = (id, value) => {
        let actValue = value;
        if (actValue === '') {
            actValue = {};
            props.dispatch({
                type: 'manage/search',
                payload: { showManager: false }
            });
            return;
        }

        props.dispatch({
            type: 'manage/addAuditMsg',
            payload: { addAuditMsg: [actValue] }
        });
        props.dispatch({
            type: 'manage/search',
            payload: { showManager: true }
        });
    };
    let msgShow = null;
    let showBtn = null;
    let showManager = style.managerInfoHide;
    if (props.showMsg === 'init') {
        msgShow = null;
    } else if (!props.showMsg) {
        msgShow = style.hideMsg;
        let init = () => {
            props.dispatch({
                type: 'manage/addManager',
                payload: { showMsg: 'init', showDelete: 'init' }
            });
        };
        setTimeout(init, 300);
    } else {
        msgShow = style.showMsg;
    }
    if (props.showDelete === 'init') {
        showBtn = style.btnRemove;
    } else if (!props.showDelete) {
        showBtn = style.hideDelete;
    } else {
        showBtn = style.showDelete;
    }
    if (props.showManager) {
        showManager = style.managerInfoShow;
    }
    return (
        <div className={style.manageContainer}>
            <Row>
                <Col span={24} offset={0}>
                    <List
                        style={{ display: 'inline-block' }}
                        dataSource={props.auditUser}
                        renderItem={item => {
                            if (props.showPlus && item.id === 'add') {
                                return (
                                    <List.Item className={style.listItem}>
                                        <Card
                                            hoverable
                                            className={style.cardItem}
                                            style={{ lineHeight: 10 }}
                                        >
                                            <img
                                                onClick={selectManager}
                                                src={circle}
                                                alt="添加"
                                                style={{
                                                    display: 'inline-block',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            />
                                        </Card>
                                    </List.Item>
                                );
                            } else {
                                return (
                                    <List.Item
                                        className={style.listItem}
                                        style={
                                            item.id === 'add'
                                                ? { display: 'none' }
                                                : { display: 'inline-block' }
                                        }
                                    >
                                        <Card
                                            hoverable
                                            className={style.cardItem}
                                        >
                                            <div className={msgShow}>
                                                <Avatar
                                                    className={style.avatarItem}
                                                    size="large"
                                                    shape="circle"
                                                    src={item.avatar}
                                                />
                                                <Meta
                                                    title={item.name}
                                                    className={style.metaItem}
                                                />
                                                <Button
                                                    className={showBtn}
                                                    data-user={item.id}
                                                    onClick={deleteAuditUser}
                                                >
                                                    移除
                                                </Button>
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }
                        }}
                    />
                </Col>
            </Row>
            <div className={style.btnContainer}>
                <Row className={style.btnRow}>
                    <Button className={style.editorBtn} onClick={isEditor}>
                        {props.isEditor}
                    </Button>
                </Row>
            </div>
            <Modal
                title={
                    <Search
                        style={{
                            borderLeft: '4px solid #8E8E8E',
                            paddingLeft: 8,
                            fontSize: 16,
                            color: '#666666'
                        }}
                        title={'搜索'}
                    />
                }
                wrapClassName="vertical-center-modal"
                visible={props.showModal}
                onCancel={closeModal}
                maskClosable={false}
                footer={null}
                width={800}
                bodyStyle={{ height: 280 }}
            >
                <div>
                    {props.showModal && (
                        <SearchBar
                            search={search}
                            globalUserId={setGlobalUserId}
                            style={{
                                width: 516,
                                margin: '40px auto 26px auto',
                                height: 40,
                                position: 'relative'
                            }}
                        />
                    )}
                    <div className={showManager}>
                        {
                            <List
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={props.addAuditMsg}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    src={
                                                        props.addAuditMsg[0]
                                                            .avatar
                                                    }
                                                    style={{
                                                        height: 56,
                                                        width: 56,
                                                        borderRadius: 28,
                                                        border:
                                                            '1px solid #D7D7D7'
                                                    }}
                                                />
                                            }
                                            title={
                                                <a style={{ fontSize: 16 }}>
                                                    {props.addAuditMsg[0].name}
                                                </a>
                                            }
                                            description={
                                                <p style={{ fontSize: 14 }}>
                                                    {props.addAuditMsg[0]
                                                        .position ? (
                                                            <span>
                                                                {
                                                                    props
                                                                        .addAuditMsg[0]
                                                                        .position
                                                                }
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    {!props.addAuditMsg[0]
                                                        .position || !department
                                                        ? ''
                                                        : '/'}
                                                    {department ? (
                                                        <span>
                                                            {department}
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                            }
                                        />
                                        <Button
                                            className={style.btnEditor}
                                            onClick={addManager}
                                        >
                                            添加
                                        </Button>
                                    </List.Item>
                                )}
                            />
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function mapStateToProps(state) {
    return { ...state.manage };
}

export default connect(mapStateToProps)(CreditRating);
