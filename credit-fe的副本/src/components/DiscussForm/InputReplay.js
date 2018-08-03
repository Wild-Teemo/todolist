import React from 'react';
import { Input, Button } from 'antd';
import { Collapse, CardBody, Card } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styels from './DiscussForm.css';

class InputReplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            collapse: false,
            isEnter: false
        };
        this.toggle = this.toggle.bind(this);
        this.enterKey = this.enterKey.bind(this);
    }
    //focse不在输入框则关闭collapse
    onEntered() {}

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    changeValue = e => {
        this.setState({ inputValue: e.target.value });
    };

    send = e => {
        this.props.addMsg(e);
        this.setState({ inputValue: '', collapse: !this.state.collapse });
    };
    enterKey = (e, value) => {
        if (this.state.isEnter) {
            return;
        }
        this.setState({
            isEnter: true
        });
        this.props.enterKey(e, value);
        this.setState({ inputValue: '', collapse: !this.state.collapse });
        setTimeout(e => {
            this.setState({
                isEnter: false
            });
        }, 1000);
    };
    render() {
        return (
            <div className={styels.responseItem} style={this.props.style}>
                <div className="pull-right">
                    {this.props.children}
                    <a onClick={this.toggle}>{this.props.title}</a>
                </div>
                <Collapse
                    isOpen={this.state.collapse}
                    onEntered={this.onEntered}
                    style={{ marginBottom: 16 }}
                >
                    <Card className={styels.replayCard}>
                        <CardBody className={styels.inputLayout}>
                            <Input
                                style={{ width: '91%', marginTop: 0 }}
                                placeholder={`回复 ${
                                    this.props.reponse
                                        ? this.props.reponse
                                        : '***'
                                } :`}
                                data-comment={this.props.commentId}
                                value={this.state.inputValue}
                                onChange={this.changeValue}
                                onPressEnter={e => {
                                    this.enterKey(e, this.state.inputValue);
                                }}
                                size="large"
                            />
                            <Button
                                type="primary"
                                data-comment={this.props.commentId}
                                data-value={this.state.inputValue}
                                onClick={this.send}
                                style={{ height: 40, verticalAlign: 'top' }}
                            >
                                评论
                            </Button>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        );
    }
}

export default InputReplay;
