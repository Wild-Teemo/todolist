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
            <Menu.Item
                key="/submitEvent"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/submitEvent">提交成就</Link>
            </Menu.Item>
            <Menu.Item
                key="/submitEvent/history"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/submitEvent/history">成就提交记录</Link>
            </Menu.Item>
        </Menu>
    );
}

export default Header;
