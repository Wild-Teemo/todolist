import { Layout, Menu } from 'antd';
import styles from './layouts.css';
import Link from 'umi/link';
import React from 'react';

import tab_employee from '../assets/images/tab_employee.png';
import tab_employee_choosed from '../assets/images/tab_employee_choosed.png';
import tab_search from '../assets/images/tab_search.png';
import tab_search_choosed from '../assets/images/tab_search_choosed.png';
import tab_audit from '../assets/images/tab_audit.png';
import tab_audit_choosed from '../assets/images/tab_audit_choosed.png';
import tab_submitEvent from '../assets/images/tab_submitEvent.png';
import tab_submitEvent_choosed from '../assets/images/tab_submitEvent_choosed.png';
import tab_manage from '../assets/images/tab_manage.png';
import tab_manage_choosed from '../assets/images/tab_manage_choosed.png';
import request from '../utils/request';

const { Sider } = Layout;

var navsDataTop = [
    {
        key: '0',
        url: '/submitEvent',
        menuName: '提交成就',
        imgPath: imgFlag =>
            imgFlag ? tab_submitEvent_choosed : tab_submitEvent,
        className: '',
        imgClass: 'navIcon',
        isHover: false
    },
    {
        key: '1',
        url: '/myCredit',
        menuName: '我的成就',
        imgPath: imgFlag => (imgFlag ? tab_employee_choosed : tab_employee),
        className: '',
        imgClass: 'navIcon',
        isHover: false
    },
    {
        key: '2',
        url: '/search',
        menuName: '搜索',
        imgPath: imgFlag => (imgFlag ? tab_search_choosed : tab_search),
        className: '',
        imgClass: 'navIcon',
        isHover: false
    },
    {
        key: '3',
        url: '/audit',
        menuName: '评分',
        imgPath: imgFlag => (imgFlag ? tab_audit_choosed : tab_audit),
        className: '',
        imgClass: 'navIcon',
        isHover: false
    },
    {
        key: '4',
        url: '/manage',
        menuName: '管理',
        imgPath: imgFlag => (imgFlag ? tab_manage_choosed : tab_manage),
        className: '',
        imgClass: 'navIcon',
        isHover: false
    }
];

function getCurIndex(data) {
    let curIndex = '0';
    let flag = window.location.pathname;
    data.map(item => {
        if (item.url === flag) {
            curIndex = item.key;
        }
        return true;
    });
    return curIndex;
}

//根据角色类型确定角色可访问的菜单 @parm Integer authType
//@auth wency0
let newData = [];

class SiderBar extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionStorageOk: sessionStorage.user !== undefined ? true : false,
            navsDataTop: navsDataTop
        };
        this.auth = this.auth.bind(this);
    }

    hoverIn = value => {
        let changeValue = value;
        changeValue.isHover = true;
        let currentData = Object.assign([], this.state.navsDataTop);
        currentData[value.key] = changeValue;
        this.setState({
            ...this.state,
            navsDataTop: currentData
        });
    };
    hoverOut = value => {
        let changeValue = value;
        changeValue.isHover = false;
        let currentData = Object.assign([], this.state.navsDataTop);
        currentData[value.key] = changeValue;
        this.setState({
            ...this.state,
            navsDataTop: currentData
        });
    };
    auth(authType) {
        let authTypes = authType.split(',');
        newData = [
            this.state.navsDataTop[0],
            this.state.navsDataTop[1],
            this.state.navsDataTop[3]
        ];
        authTypes.forEach(value => {
            switch (value) {
                case '0':
                    newData.push(this.state.navsDataTop[4]);
                    break;
                case '1':
                    newData.push(this.state.navsDataTop[2]);
                    break;
                case '2':
                default:
                    break;
            }
        });
    }

    render() {
        if (sessionStorage.token && !sessionStorage.user)
            request('/credit/users/compentence').then(data => {
                if (data) sessionStorage.user = JSON.stringify(data);
                this.setState({ sessionStorageOk: true });
            });

        if (this.state.sessionStorageOk) {
            let user = JSON.parse(sessionStorage.user);
            let authType = user.type;
            this.auth(authType);
            let path = window.location.pathname;
            path = path.split('/');
            let flag = '/' + path[1];
            return (
                <Sider className={styles.siderbar}>
                    <div className={styles.logo} />
                    <Menu
                        defaultSelectedKeys={[getCurIndex(newData)]}
                        mode="inline"
                    >
                        {newData.map((item, index) => {
                            let imgFlag = flag === item.url;
                            return (
                                <Menu.Item
                                    onMouseOver={e => this.hoverIn(item)}
                                    onMouseOut={e => this.hoverOut(item)}
                                    key={item.key}
                                    className={styles.navMenu}
                                    style={item.style || ''}
                                >
                                    <Link to={item.url} className={styles.link}>
                                        <div className={styles.MenuImg}>
                                            <img
                                                src={
                                                    item.isHover
                                                        ? item.imgPath(true)
                                                        : item.imgPath(imgFlag)
                                                }
                                                className={`${styles[
                                                    item.imgClass
                                                ] || ''}`}
                                                alt={item.menuName}
                                            />
                                        </div>
                                        <div>
                                            <span>{item.menuName}</span>
                                        </div>
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                </Sider>
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

export default SiderBar;
