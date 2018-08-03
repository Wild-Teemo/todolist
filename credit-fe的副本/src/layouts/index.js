import React from 'react';
import withRouter from 'umi/withRouter';
import SiderBar from './SiderBar';
import Header from './Header';
import { Layout } from 'antd';
import config from '../utils/config';

const { Content } = Layout;
const { API } = config;

function Layouter({ location, children }) {
    if (!location.query.token && !sessionStorage.token) {
        if (location.query.code && location.query.code !== 0) {
            alert('暂无权限，请联系管理员申请……');
            return <Layout style={{ minHeight: '100vh' }} />;
        } else {
            window.location = `${API}/auth/login?callback=${
                window.location.origin
            }`;
            return <div />;
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SiderBar />
            <Layout>
                <Header />
                <Content>
                    <div style={{ minHeight: 360 }}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default withRouter(Layouter);
