import { Layout, Avatar } from 'antd';
import React from 'react';
import styles from './layouts.css';
import request from '../utils/request';
const { Header } = Layout;

class HeaderAvatar extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionStorageOk: sessionStorage.user !== undefined ? true : false
        };
    }
    render() {
        if (sessionStorage.token && !sessionStorage.user)
            request('/credit/users/compentence').then(data => {
                if (data) sessionStorage.user = JSON.stringify(data);
                this.setState({ sessionStorageOk: true });
            });

        if (this.state.sessionStorageOk) {
            let userProfile = JSON.parse(sessionStorage.user);
            let department = userProfile.departName;
            if (department !== null && department.indexOf('-') > -1) {
                let indexParam = department.indexOf('-');
                department = department.substring(0, indexParam);
            }
            return (
                <Header
                    style={{ background: '#f7f7f7', height: 'auto' }}
                    className="header"
                >
                    <ul className={styles.avatar}>
                        <li className="topAvatar">
                            <Avatar
                                src={userProfile.avatar}
                                size="large"
                                alt="用户头像"
                            />
                        </li>
                        <li>
                            <ul className={styles.avatarDep}>
                                <li>
                                    <span className={styles.name}>
                                        {userProfile.name}
                                    </span>
                                    <span
                                        className={styles.name}
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 'normal'
                                        }}
                                    >
                                        {userProfile.career
                                            ? userProfile.career
                                            : ''}
                                        {!userProfile.career || !department
                                            ? ''
                                            : '/'}
                                        {department ? department : ''}
                                    </span>
                                </li>
                                <li className={styles.departName}>
                                    {userProfile.email}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </Header>
            );
        } else {
            return (
                <p style={{ background: '#fff', height: '100px', margin: 0 }}>
                    未获取到权限
                </p>
            );
        }
    }
}

export default HeaderAvatar;
