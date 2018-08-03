import React from 'react';
import { Menu } from 'antd';
// import Link from 'umi/link';

function Header({ location }) {
    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="horizontal"
            className="navBar"
        >
            {/* <Menu.Item
                key="/myCredit"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/myCredit">我的成就</Link>
            </Menu.Item>
            <Menu.Item
                key="/myCredit/aboutMe"
                style={{ width: 160, textAlign: 'center' }}
            >
                <Link to="/myCredit/aboutMe">和我相关的成就</Link>
            </Menu.Item> */}
        </Menu>
    );
}

export default Header;
