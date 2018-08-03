import React from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';

function Header({ location }) {
    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="horizontal"
            className="navBar"
        >
            <Menu.Item key="/audit" style={{ width: 160, textAlign: 'center' }}>
                <Link to="/audit">待评分</Link>
            </Menu.Item>
            <Menu.Item
                key="/audit/hasAudit"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/audit/hasAudit">已评分</Link>
            </Menu.Item>
        </Menu>
    );
}

export default Header;
