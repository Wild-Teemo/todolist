import React from 'react';
import { Component } from 'react';
import styles from './components.css';
import { formatDate } from '../../../utils/mytool';

class ModalTitle extends Component {
    render() {
        let witnesses = [];
        if (this.props.source.witnesses) {
            this.props.source.witnesses.map(witness =>
                witnesses.push(witness.name)
            );
        }
        return (
            <div className={styles.modalTitle}>
                <div>
                    <span className={styles.title2}>
                        {this.props.source.title}
                        --
                        {this.props.source.responsibleUser.name}
                    </span>
                    <span>{this.props.source.responsibleUser.departName}</span>
                </div>
                <div className={styles.desc}>
                    <span>
                        提交时间: &nbsp;
                        {formatDate(
                            'yyyy.MM.dd',
                            new Date(this.props.source.createdAt)
                        )}
                    </span>
                    {this.props.source.reportUser.name ? (
                        <span>
                            提交人: &nbsp;
                            {this.props.source.reportUser.name}
                        </span>
                    ) : (
                        <span>提交人: &nbsp;匿名</span>
                    )}
                    {witnesses.length > 0 && (
                        <span>
                            证明人: &nbsp;
                            {witnesses.join(',')}
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

export default ModalTitle;
