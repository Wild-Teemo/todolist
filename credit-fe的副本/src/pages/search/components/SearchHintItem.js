import React from 'react';
import style from './components.css';
import { Avatar } from 'antd';

class SeachHintItem extends React.Component {
    render() {
        return (
            <div>
                <div
                    className={
                        this.props.isOdd
                            ? style.resultItemOdd
                            : style.resultItem
                    }
                    data-id={this.props.dataMemberItem.id}
                >
                    <ul className={style.avatar + ' ' + style.noMargin}>
                        <li>
                            <Avatar
                                src={this.props.dataMemberItem.avatar}
                                size="large"
                                alt="用户头像"
                            />
                        </li>
                        <li>
                            <ul className={style.avatarDep}>
                                <li>
                                    <span className={style.name}>
                                        {this.props.dataMemberItem.name}
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span className={style.smallerSize}>
                                        {this.props.dataMemberItem.career}
                                    </span>
                                </li>
                                <li>
                                    <span className={style.smallestSize}>
                                        {' '}
                                        {this.props.dataMemberItem.email}{' '}
                                    </span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default SeachHintItem;
