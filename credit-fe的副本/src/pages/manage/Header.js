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
                key="/manage"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/manage">成就评定委员</Link>
            </Menu.Item>
        </Menu>
    );
}

export default Header;
