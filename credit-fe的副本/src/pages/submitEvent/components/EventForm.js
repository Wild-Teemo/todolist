import React from 'react';
import { Form, Input, Icon, Button, Upload, Modal, message } from 'antd';
import styles from './components.css';
import SelectIntelligent from '../../../components/EventsFormSelect/singleSelect';
import SelectIntelligents from '../../../components/EventsFormSelect/SelectIntelligent';
import { connect } from 'dva';
import { API } from '../../../utils/config';
import redirectHome from '../../../utils/redirect';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
// const RadioGroup = Radio.Group;
const { TextArea } = Input;

sessionStorage.token =
    new URL(window.location).searchParams.get('token') ||
    sessionStorage.token ||
    '';

function Title() {
    return (
        <span style={{ borderLeft: '2px solid #8E8E8E', paddingLeft: '10px' }}>
            提示
        </span>
    );
}
class EventForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.emailDeSelect = this.emailDeSelect.bind(this);
        this.dutyDeSelect = this.dutyDeSelect.bind(this);
        this.normFile = this.normFile.bind(this);
        this.propst.onChange = this.propst.onChange.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        let formData = null;
        let that = this;

        that.props.form.validateFields((err, values) => {
            if (!err) {
                formData = values;
                let {
                    title,
                    fileId,
                    unnamedFlag,
                    type,
                    witnessesUsersIds,
                    description,
                    partiesEmail
                } = formData;
                let responsibleUserId = '';
                if (formData.responsibleUserId.value) {
                    responsibleUserId = formData.responsibleUserId.value.key;
                } else {
                    responsibleUserId = formData.responsibleUserId;
                }
                let wintess = [];
                let wintenss = witnessesUsersIds ? witnessesUsersIds.value : [];
                for (let i in wintenss) {
                    wintess.push(wintenss[i].key);
                }

                if (
                    fileId !== null &&
                    fileId.length > 0 &&
                    fileId[0].response.data
                ) {
                    fileId = fileId[0].response.data;
                } else {
                    fileId = null;
                }
                description = description.replace(/[\n|\r]/g, '</br>');
                description = description.replace(/\s/g, '&nbsp');

                // 提交人默认实名 unnamedFlag = 0
                unnamedFlag = 0;
                // 成就类型默认加分成就 type = 0
                type = 0;

                const postValues = {
                    title: title,
                    file: fileId,
                    unnamedFlag: unnamedFlag,
                    type: type,
                    witnessesUsersIds: wintess,
                    responsibleUserId: responsibleUserId,
                    description: description,
                    partiesEmail: partiesEmail
                };

                this.props.dispatch({
                    type: 'events/submitForm',
                    payload: postValues
                });
            } else {
                return;
            }
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return this.props.events.fileList;
    };

    handleChange(data) {
        if (data) {
            let label = data.props.email;
            let key = data.key;
            this.props.dispatch({
                type: 'events/labelChange',
                payload: { labelEmail: [{ key: key, label: label }] }
            });
            this.props.form.setFieldsValue({
                partiesEmail: label
            });
        } else {
            this.props.dispatch({
                type: 'events/labelChange',
                payload: { labelEmail: [], labelDuty: [] }
            });
            this.props.form.setFieldsValue({
                partiesEmail: ''
            });
        }
    }

    emailChange(data) {
        if (data) {
            let label = data.props.detail;
            let key = data.key;
            this.props.dispatch({
                type: 'events/labelChange',
                payload: { labelDuty: [{ key: key, label: label }] }
            });
            this.props.form.setFieldsValue({
                responsibleUserId: key
            });
        } else {
            this.props.dispatch({
                type: 'events/labelChange',
                payload: { labelDuty: [], labelEmail: [] }
            });
            this.props.form.setFieldsValue({
                responsibleUserId: ''
            });
        }
    }

    emailDeSelect = () => {
        this.props.dispatch({
            type: 'events/labelChange',
            payload: { labelEmail: [], labelDuty: [] }
        });
    };

    dutyDeSelect = () => {
        this.props.dispatch({
            type: 'events/labelChange',
            payload: { labelEmail: [], labelDuty: [] }
        });
    };

    selectChange() {}

    handleClose = () => {
        this.props.dispatch({ type: 'events/isVisible', payload: false });
        this.props.form.resetFields();
        this.props.dispatch({
            type: 'events/changeFileList',
            payload: { fileList: null, uploadMsg: '上传文件' }
        });
        this.props.dispatch({
            type: 'events/labelChange',
            payload: { labelEmail: [], labelDuty: [] }
        });
        this.props.dispatch({
            type: 'events/canSubmitStyle',
            payload: {
                canSubmitStyle: {
                    width: 576,
                    height: 48,
                    color: '#999',
                    border: 'none',
                    fontSize: '16px',
                    letterSpacing: '4px',
                    paddingLeft: '-200px',
                    marginLeft: '-200px',
                    background: 'linear-gradient(to left,#F6F6F6 , #EBEBEB)',
                    boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
                    cursor: 'not-allowed'
                }
            }
        });
        this.props.dispatch(routerRedux.push('/submitEvent/history'));
    };

    propst = {
        name: 'file',
        action: `${API}/zuul/storage/upload`,
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            enctype: 'multipart/form-data'
        },
        accept:
            'image/jpg,image/png,application/pdf,image/jpeg,application/zip',
        // beforeUpload:this.forbidSubmit(),
        onChange(info) {
            message.config({
                top: '90%',
                maxCount: 1
            });

            if (info.file.status === 'uploading') {
                this.forbidSubmit();
            }
            if (!info.event) {
                if (info.file.status === 'done' && info.file.response.success) {
                    message.success(`${info.file.name} 上传成功`);
                } else if (
                    info.file.status !== 'uploading' &&
                    info.file.response &&
                    info.file.response.code === 401 &&
                    sessionStorage.token !== ''
                ) {
                    sessionStorage.removeItem('token');
                    message.info(
                        `您的token已过期，${
                            info.file.name
                        } 上传失败，5秒后自动跳转到首页以重新获取最新的token，请重新操作！`,
                        5,
                        redirectHome
                    );
                } else if (info.file.status === 'removed') {
                    message.error(`${info.file.name} 取消上传.`);
                } else if (info.file.status !== 'uploading') {
                    message.error(`${info.file.name} 上传失败.`);
                }
                let lastList = info.fileList.length - 1;
                if (lastList >= 0) {
                    this.props.dispatch({
                        type: 'events/changeFileList',
                        payload: {
                            fileList: [info.fileList[lastList]],
                            uploadMsg: '重新上传'
                        }
                    });
                } else {
                    this.props.dispatch({
                        type: 'events/changeFileList',
                        payload: { fileList: null, uploadMsg: '上传文件' }
                    });
                }
            }
        }
    };

    forbidSubmit = () => {
        this.props.dispatch({
            type: 'events/canSubmitStyle',
            payload: {
                canSubmitStyle: {
                    width: 576,
                    height: 48,
                    color: '#999',
                    border: 'none',
                    fontSize: '16px',
                    letterSpacing: '4px',
                    paddingLeft: '-200px',
                    marginLeft: '-200px',
                    background: 'linear-gradient(to left,#F6F6F6 , #EBEBEB)',
                    boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
                    cursor: 'not-allowed'
                },
                allowSubmit: false
            }
        });
    };
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        };
        const formItemCenterLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 11
                }
            }
        };

        const { getFieldDecorator } = this.props.form;

        // const options = [
        //     { label: '加分成就', value: 0 },
        //     { label: '减分成就', value: 1 }
        // ];

        // const isCryptonym = [
        //     { label: '匿名提交', value: 1 },
        //     { label: '实名提交', value: 0 }
        // ];

        return (
            <Form className="submitEventForm" onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="成就标题">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                whitespace: true,
                                required: true,
                                message: '请填写成就标题'
                            }
                        ]
                    })(
                        <Input
                            style={{ paddingLeft: 16 }}
                            placeholder="请填写成就标题"
                            required
                            autoComplete="off"
                            maxLength={60}
                        />
                    )}
                </FormItem>
                {/* <FormItem {...formItemLayout} label="成就类型">
                    {getFieldDecorator('type', {
                        rules: [
                            {
                                required: true
                            }
                        ],
                        initialValue: 0
                    })(<RadioGroup options={options} name="radiogroup" />)}
                </FormItem> */}
                <FormItem {...formItemLayout} label="拥有人">
                    {getFieldDecorator('responsibleUserId', {
                        rules: [
                            {
                                required: true,
                                message: '请填写拥有人邮箱'
                            }
                        ],
                        initialValue: ''
                    })(
                        <SelectIntelligent
                            handleChange={this.handleChange}
                            deSelect={this.dutyDeSelect}
                            labels={this.props.events.labelDuty}
                            keys="value"
                            required
                            placeholder="请填写拥有人"
                            dropdownMatchSelectWidth={false}
                            showArrow={false}
                        />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="拥有人邮箱">
                    {getFieldDecorator('partiesEmail', {
                        rules: [
                            {
                                required: true,
                                message: '请填写拥有人邮箱'
                            }
                        ],
                        initialValue: ''
                    })(
                        <SelectIntelligent
                            handleChange={this.emailChange}
                            deSelect={this.emailDeSelect}
                            required
                            labels={this.props.events.labelEmail}
                            keys="email"
                            placeholder="请填写拥有人邮箱"
                            dropdownMatchSelectWidth={false}
                            showArrow={false}
                        />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="成就描述">
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                whitespace: true,
                                required: true,
                                message: '请填写成就描述'
                            }
                        ]
                    })(
                        <TextArea
                            style={{ paddingLeft: 16 }}
                            rows={4}
                            placeholder="请填写成就描述"
                            required
                        />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="上传附件">
                    {getFieldDecorator('fileId', {
                        valuePropName: 'file',
                        getValueFromEvent: this.normFile,
                        initialValue: null
                    })(
                        <Upload
                            {...this.propst}
                            fileList={this.props.events.fileList}
                        >
                            <Button className={styles.downBtn}>
                                <Icon type="paper-clip" />{' '}
                                {this.props.events.uploadMsg}
                            </Button>
                            <span style={{ marginLeft: 15, color: '#666' }}>
                                *支持pdf、png、jpg、zip文件格式
                            </span>
                        </Upload>
                    )}
                </FormItem>
                {/* <FormItem {...formItemLayout} label="提交人">
                    {getFieldDecorator('unnamedFlag', {
                        rules: [
                            {
                                required: false
                            }
                        ],
                        initialValue: 1
                    })(
                        <RadioGroup options={isCryptonym} name="isCryptonyms" />
                    )}
                </FormItem> */}
                <FormItem {...formItemLayout} label="证明人">
                    {getFieldDecorator('witnessesUsersIds', {
                        rules: [
                            {
                                required: false,
                                message: '多个证明人用逗号","分隔'
                            }
                        ]
                    })(
                        <SelectIntelligents
                            mode="multiple"
                            showDetail={true}
                            placeholder="请填写证明人"
                            handleChange={this.selectChange}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemCenterLayout}
                    style={{ textAlign: 'left' }}
                >
                    <Button
                        htmlType="submit"
                        className="btnDefalt"
                        style={this.props.events.canSubmitStyle}
                    >
                        提交
                    </Button>
                </FormItem>
                <div id="model-self-define">
                    <Modal
                        title={<Title />}
                        wrapClassName="vertical-center-self-define"
                        visible={this.props.events.visible}
                        footer={null}
                        closable={false}
                        width={515}
                        className="self-define-modal"
                        onCancel={this.handleClose}
                    >
                        <p className={styles.msgTip}>成就提交成功</p>
                        <Button
                            type="primary"
                            className="btnClose"
                            onClick={this.handleClose}
                        >
                            关闭
                        </Button>
                    </Modal>
                </div>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    return { events: state.events };
}

export default connect(mapStateToProps)(
    Form.create({
        onValuesChange: (props, changedValues, allValues) => {
            if (
                allValues.title &&
                allValues.responsibleUserId &&
                allValues.partiesEmail &&
                allValues.description &&
                (allValues.description + '').trim()
            ) {
                props.dispatch({
                    type: 'events/canSubmitStyle',
                    payload: {
                        canSubmitStyle: {
                            width: 576,
                            height: 48,
                            color: '#fff',
                            border: 'none',
                            fontSize: '16px',
                            letterSpacing: '4px',
                            background: 'linear-gradient(#F5A253 , #F37F3A)',
                            paddingLeft: '-200px',
                            marginLeft: '-200px',
                            boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)'
                        },
                        allowSubmit: true
                    }
                });
            } else {
                props.dispatch({
                    type: 'events/canSubmitStyle',
                    payload: {
                        canSubmitStyle: {
                            width: 576,
                            height: 48,
                            color: '#999',
                            border: 'none',
                            fontSize: '16px',
                            letterSpacing: '4px',
                            paddingLeft: '-200px',
                            marginLeft: '-200px',
                            background:
                                'linear-gradient(to left,#F6F6F6 , #EBEBEB)',
                            boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
                            cursor: 'not-allowed'
                        },
                        allowSubmit: false
                    }
                });
            }
        }
    })(EventForm)
);
