import {
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Icon,
    message,
    Row,
    Col
} from 'antd';
import React from 'react';
import Filter from '../../../components/FilterTable/Filter';
import SelectIntelligent from '../../../components/SelectIntelligent/SelectIntelligent';
import styles from './ModalRightCss.css';
import style from './components.css';
import requests from '../../../utils/postRequest';
import { connect } from 'dva';
import { API } from '../../../utils/config';
import redirectHome from '../../../utils/redirect';

const FormItem = Form.Item;
const { TextArea } = Input;

class RightModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.filtrate = this.filtrate.bind(this);
        this.filtrateChangeHandler = this.filtrateChangeHandler.bind(this);
        this.propst.onChange = this.propst.onChange.bind(this);
    }
    state = {
        visible: false,
        confirmLoading: false,
        selectvalue: '',
        selectReconsiderManID: [],
        flag: false,
        filtermenu: this.props.options.map((value, index) => {
            let obj = {};
            obj.label = value.name;
            obj.value = index.toString();
            return obj;
        }),
        fileList: [],
        uploadMsg: '上传文件'
    };

    normFile = e => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return this.state.fileList;
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            selectvalue: '',
            selectReconsiderManID: []
        });
    };
    async handleSubmit(e) {
        let formData = {};
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            if (values.witnesses !== undefined) {
                formData.witnesses = values.witnesses.map(val => {
                    return val.key;
                });
            } else {
                formData.witnesses = null;
            }

            if (
                values.file &&
                values.file.length > 0 &&
                values.file[0].response.data
            ) {
                formData.file = values.file[0].response.data;
            } else {
                formData.file = null;
            }
            formData.users =
                this.state.selectReconsiderManID.length !== 0
                    ? this.state.selectReconsiderManID
                    : null;
            formData.eventId = this.props.eventID;
            formData.reason = values.reason;
        });
        let options = {
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(formData),
            method: 'POST'
        };
        try {
            let { success } = await requests('/credit/reexamination', options);
            if (success) {
                message.success('复议申请提交成功', 2);
                formData = {};
                this.props.postDone();
                this.setState({
                    visible: false,
                    selectvalue: '',
                    selectReconsiderManID: []
                });
            }
        } catch (error) {
            message.error('网络异常，请稍后重试', 1);
        }
    }

    propst = {
        name: 'file',
        action: `${API}/zuul/storage/upload`,
        accept:
            'image/jpg,image/png,application/pdf,image/jpeg,application/zip',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        },
        onChange(info) {
            message.config({
                top: '90%',
                maxCount: 1
            });
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
                    this.setState({
                        ...this.state,
                        fileList: [info.fileList[lastList]],
                        uploadMsg: '重新上传'
                    });
                } else {
                    this.setState({
                        ...this.state,
                        fileList: null,
                        uploadMsg: '上传文件'
                    });
                }
            }
        }
    };

    filtrate = checkedList => {
        let score = checkedList.join(',');
        let arrAdd2 = this.state.filtermenu.filter(val => {
            return score.indexOf(val.value.toString()) !== -1;
        });
        let arr = arrAdd2.map(val => {
            return val.label;
        });
        let str = arr.join(',');
        this.setState({ selectvalue: str });
        let arr2 = [];
        this.props.options.filter((val, index) => {
            if (score.indexOf(index.toString()) !== -1) {
                arr2.push(this.props.options[index].id);
                return true;
            } else {
                return false;
            }
        });
        this.setState({ selectReconsiderManID: arr2 });
    };

    filtrateChangeHandler = flag => {
        this.setState({ flag: flag });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const defaultCheckedList = [];

        return (
            <div>
                <button
                    className={styles.buttonHide}
                    type="primary"
                    onClick={this.showModal}
                >
                    申请复议
                </button>
                <Modal
                    className={styles.modal}
                    title={
                        <span className={style.title + ' ' + style.fontColor}>
                            申请复议
                        </span>
                    }
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    mask={false}
                    onclick={this.closeFilter}
                    destroyOnClose={true}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label={
                                <span>
                                    成就标题{' '}
                                    <span className={styles.orange}>*</span>
                                </span>
                            }
                        >
                            <Input
                                value={this.props.eventTitle}
                                disabled={true}
                            />
                        </FormItem>

                        {/*<FormItem className="right-modal-fyuser" label="复议人">*/}
                        {/*{getFieldDecorator('users')(*/}
                        {/*<Row*/}
                        {/*className={styles.select}*/}
                        {/*span={24}*/}
                        {/*type="flex"*/}
                        {/*justify="space-between"*/}
                        {/*>*/}
                        {/*<Col span={22}>*/}
                        {/*<input*/}
                        {/*placeholder="请选择"*/}
                        {/*className={styles.input}*/}
                        {/*value={this.state.selectvalue}*/}
                        {/*onClick={this.filtrateChangeHandler}*/}
                        {/*/>*/}
                        {/*</Col>*/}
                        {/*<Col span={1}>*/}
                        {/*<Filter*/}
                        {/*outsideVisible={this.state.flag}*/}
                        {/*className={styles.floatLeft}*/}
                        {/*largeWidth={true}*/}
                        {/*filtrateChangeHandler={*/}
                        {/*this.filtrateChangeHandler*/}
                        {/*}*/}
                        {/*outsideCall={true}*/}
                        {/*menu={this.state.filtermenu}*/}
                        {/*defaultCheckedList={*/}
                        {/*defaultCheckedList*/}
                        {/*}*/}
                        {/*checkAll={false}*/}
                        {/*filtrate={this.filtrate}*/}
                        {/*style={{ width: 460 }}*/}
                        {/*listBgc="listBgc"*/}
                        {/*/>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}

                        <FormItem
                            label={
                                <span>
                                    复议理由{' '}
                                    <span className={styles.orange}>*</span>
                                </span>
                            }
                        >
                            {getFieldDecorator('reason')(
                                <TextArea
                                    placeholder="请填写复议理由"
                                    rows={5}
                                    required={true}
                                    id="reconsiderReason"
                                />
                            )}
                        </FormItem>

                        <FormItem label="上传附件">
                            {getFieldDecorator('file', {
                                getValueFromEvent: this.normFile
                            })(
                                <Upload
                                    name="logo"
                                    action="/upload.do"
                                    listType="picture"
                                    fileList={this.state.fileList}
                                    multiple={false}
                                    {...this.propst}
                                >
                                    <Button className={styles.downBtnFy}>
                                        <Icon type="paper-clip" />{' '}
                                        {this.state.uploadMsg}
                                    </Button>
                                    <span style={{ marginLeft: 15 }}>
                                        *支持pdf、png、jpg、zip文件格式
                                    </span>
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem label="证明人" className="reconsider">
                            {getFieldDecorator('witnesses')(
                                <SelectIntelligent
                                    placeholder="请选择证明人"
                                    onChange={() => {}}
                                    mode="multiple"
                                    dropdownMatchSelectWidth={false}
                                />
                            )}
                        </FormItem>

                        <Button
                            className={styles.submit}
                            htmlType="submit"
                            type="primary"
                        >
                            提交
                        </Button>
                    </Form>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { myEvents: state.myEvents };
}

export default connect(mapStateToProps)(Form.create()(RightModal));
