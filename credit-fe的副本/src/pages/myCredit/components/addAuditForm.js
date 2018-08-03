import React from 'react';
import { Icon, Form, Button, Avatar, Row, Col, Card, Select } from 'antd';
import styles from '../../audit/components/components.css';
import { connect } from 'dva';

const Option = Select.Option;

class AuditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sendFlag: 'disabled'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //发送评审邀请
    handleSubmit = e => {
        e.preventDefault();
        this.props.dispatch({
            type: 'myEvents/sendInvite',
            payload: {
                email: this.props.audit.email,
                eventId: this.props.audit.eventId
            }
        });
    };
    //点击关闭图标关闭邀请评审卡片
    hideVisitCard = () => {
        this.props.dispatch({
            type: 'myEvents/isShow',
            payload: { showInviteCard: 'hidden' }
        });
    };
    //select框内容改变时触发
    handleChange = value => {
        let name = value;
        if (name.indexOf('@') > 0) {
            name = name.substring(0, value.indexOf('@'));
        }
        this.props.dispatch({ type: 'myEvents/seachUsers', payload: name });
        if (value !== null && value !== '') {
            this.setState({ sendFlag: '' });
        } else {
            this.setState({ sendFlag: 'disabled' });
        }

        this.props.dispatch({
            type: 'myEvents/setEmail',
            payload: { email: value }
        });
    };

    render() {
        return (
            <div
                className="audit-form"
                hidden={this.props.audit.showInviteCard}
            >
                <Form className={styles.visitCard} onSubmit={this.handleSubmit}>
                    <Card
                        title={<span className="titleIcon">邀请评审</span>}
                        extra={
                            <Icon
                                onClick={this.hideVisitCard}
                                type="close"
                                style={{ fontSize: 16 }}
                            />
                        }
                    >
                        <div
                            className="invite-select"
                            style={{ marginTop: 200, position: 'relative' }}
                            id="model-self-define"
                        >
                            <Icon className={styles.searchIcon} type="search" />
                            <Select
                                mode="combobox"
                                style={{ width: '100%' }}
                                showArrow={false}
                                value={this.props.audit.email}
                                showSearch={true}
                                placeholder={'请填写被邀请人邮箱'}
                                onChange={this.handleChange}
                            >
                                {this.props.audit.users.map(d => (
                                    <Option value={d.email} key={d.id}>
                                        <Row>
                                            <Col span={2}>
                                                <Avatar
                                                    size="small"
                                                    src={d.avatar}
                                                />
                                            </Col>
                                            <Col span={3}>{d.name}</Col>
                                            <Col span={8}>{d.email}</Col>
                                        </Row>
                                    </Option>
                                ))}
                            </Select>

                            <div className="defaultBtn sendBtnP">
                                <Button
                                    className={styles.sendBtn}
                                    type="primary"
                                    onClick={this.handleSubmit}
                                    disabled={this.state.sendFlag}
                                >
                                    发送评审邀请
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { audit: state.myEvents };
}

export default connect(mapStateToProps)(Form.create()(AuditForm));
